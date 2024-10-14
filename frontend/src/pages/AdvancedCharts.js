import React, { useRef } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";

// Register Chart.js components
Chart.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdvancedCharts = ({ ordersData }) => {
  const printRef = useRef(); // Reference to the component for capturing

  const orderStatuses = ordersData.map((order) => order.status);
  const paymentStatuses = ordersData.map((order) =>
    order.payment ? "Paid" : "Unpaid"
  );

  const statusCounts = {
    Processing: orderStatuses.filter((status) => status === "Processing")
      .length,
    Shipped: orderStatuses.filter((status) => status === "Shipped").length,
    Delivered: orderStatuses.filter((status) => status === "Delivered").length,
    Cancelled: orderStatuses.filter((status) => status === "Cancelled").length,
  };

  const paymentCounts = {
    Paid: paymentStatuses.filter((status) => status === "Paid").length,
    Unpaid: paymentStatuses.filter((status) => status === "Unpaid").length,
  };

  // Helper function to group orders by date
  const groupOrdersByDate = (orders) => {
    return orders.reduce((acc, order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { totalAmount: 0, orderCount: 0 };
      }
      acc[date].totalAmount += order.amount;
      acc[date].orderCount += 1;

      return acc;
    }, {});
  };

  // Aggregate the data by date
  const aggregatedData = groupOrdersByDate(ordersData);

  // Sort the dates in ascending order
  const sortedDates = Object.keys(aggregatedData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const orderAmountsByDay = sortedDates.map(
    (date) => aggregatedData[date].totalAmount
  );
  const orderCountsByDay = sortedDates.map(
    (date) => aggregatedData[date].orderCount
  );

  // Multi-Axis Chart (Revenue and Orders per Day)
  const trendData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Revenue ($)",
        data: orderAmountsByDay,
        type: "line",
        borderColor: "#FF6384",
        yAxisID: "y-axis-1",
        fill: false,
      },
      {
        label: "Order Count",
        data: orderCountsByDay,
        backgroundColor: "#36A2EB",
        yAxisID: "y-axis-2",
      },
    ],
  };

  // Stacked Bar Chart for Orders by Status
  const stackedBarData = {
    labels: ["Processing", "Shipped", "Delivered", "Cancelled"],
    datasets: [
      {
        label: "Order Count",
        data: [
          statusCounts.Processing,
          statusCounts.Shipped,
          statusCounts.Delivered,
          statusCounts.Cancelled,
        ],
        backgroundColor: ["#FFCE56", "#36A2EB", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  // Doughnut Chart for Payment Status
  const doughnutData = {
    labels: ["Paid", "Unpaid"],
    datasets: [
      {
        data: [paymentCounts.Paid, paymentCounts.Unpaid],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      yAxes: [
        {
          id: "y-axis-1",
          type: "linear",
          position: "left",
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Revenue ($)",
          },
        },
        {
          id: "y-axis-2",
          type: "linear",
          position: "right",
          ticks: {
            beginAtZero: true,
          },
          scaleLabel: {
            display: true,
            labelString: "Order Count",
          },
        },
      ],
    },
  };

  // Function to generate PDF
  const generatePDF = () => {
    const input = printRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("charts-summary.pdf");
    });
  };

  return (
    <div class="">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Detailed Sales Report</h2>

        <button
          onClick={generatePDF}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
          Print Summary as PDF
        </button>
      </div>

      {/* Charts content */}
      <div
        ref={printRef}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10"
      >
        {/* Multi-Axis Line & Bar Chart for Revenue and Order Trends */}
        <div className="col-span-2">
          <h3 className="text-xl font-bold mb-4">Revenue and Orders Per Day</h3>
          <Line data={trendData} options={options} />
        </div>

        {/* Stacked Bar Chart for Order Status */}
        <div>
          <h3 className="text-xl font-bold mb-4">Order Status Overview</h3>
          <Bar
            data={stackedBarData}
            options={{ scales: { x: { stacked: true }, y: { stacked: true } } }}
          />
        </div>

        {/* Doughnut Chart for Payment Status */}
        <div>
          <h3 className="text-xl font-bold mb-4">Payment Status</h3>
          <div style={{ width: "250px", height: "250px", margin: "0 auto" }}>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCharts;
