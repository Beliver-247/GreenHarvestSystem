import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import xlsx for Excel export

const OrderAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by creation date
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [data, setData] = useState([]); // Initialize as an empty array to avoid iterability issues
  const [isLoading, setIsLoading] = useState(true); // Loading state for API call

  const statuses = ["All", "Order Processing", "Shipped", "Delivered", "Cancelled"];
  const sortOptions = [
    { value: "createdAt", label: "Order Date" },
    { value: "amount", label: "Total Amount" },
    { value: "status", label: "Status" },
  ];

  const itemsPerPage = 10; // Number of rows per page

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true); // Set loading state
      try {
        const response = await fetch("http://localhost:3001/api/orders/list");
        const result = await response.json();
  
        // Check if the response contains the 'data' key and if it's an array
        if (result.success && Array.isArray(result.data)) {
          setData(result.data); // Use result.data, which is the actual array
        } else {
          console.error("Unexpected response structure:", result);
          setData([]); // Reset to empty array if structure is not as expected
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setData([]); // Handle error by resetting data to an empty array
      } finally {
        setIsLoading(false); // Stop loading
      }
    };
    fetchOrders();
  }, []);

  // Sort the data based on the selected sort option
  const sortedData = [...data].sort((a, b) => {
    if (sortBy === "amount") {
      // Sort by amount
      return b.amount - a.amount;
    } else {
      return new Date(b[sortBy]) - new Date(a[sortBy]); // Sort by date or other fields
    }
  });

  // Filtered data based on search term and status
  const filteredData = sortedData.filter((order) => {
    const matchesStatus = selectedStatus === "All" || order.status === selectedStatus;
    const matchesSearchTerm = order.items.some((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesStatus && matchesSearchTerm;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Paginate the filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle pagination
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle order status update
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch("http://localhost:3001/api/orders/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          status: newStatus,
        }),
      });
      const result = await response.json();
      if (result.success) {
        // Update the order status locally
        setData((prevData) =>
          prevData.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Export table as PDF
const exportPDF = () => {
    const input = document.getElementById("table-to-pdf");
    
    // Set table width for better capture
    html2canvas(input, {
      scale: 2, // Increases resolution of canvas
      scrollX: 0,
      scrollY: -window.scrollY,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: 'landscape', // Ensure landscape mode for wide tables
        unit: 'px',
        format: [canvas.width, canvas.height] // Set size to canvas
      });
  
      pdf.addImage(imgData, "PNG", 10, 10, canvas.width, canvas.height);
      pdf.save("table.pdf");
    });
  };
  
// Export table as Excel
const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");
    XLSX.writeFile(workbook, "table.xlsx");
  };

  return (
    <div className="container mx-auto p-4">
  {/* Loading state */}
  {isLoading ? (
    <div>Loading orders...</div>
  ) : (
    <>
      {/* Search and Filter Inputs */}
      <div className="mb-4 flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <input
          type="text"
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
          placeholder="Search by item name..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Status Dropdown */}
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map((status, index) => (
            <option key={index} value={status}>
              {status}
            </option>
          ))}
        </select>

        {/* Sort By Dropdown */}
        <select
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/4"
          onChange={(e) => setSortBy(e.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div id="table-to-pdf" className="overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Items</th>
              <th className="border border-gray-300 px-4 py-2">Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
              <th className="border border-gray-300 px-4 py-2">Billing Address</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((order) => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{order._id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.items.map((item) => (
                    <div key={item.id}>{item.name} (x{item.qty} Kg)</div>
                  ))}
                </td>
                <td className="border border-gray-300 px-4 py-2">${order.amount}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {/* Status Selection */}
                  <select
                    className="border border-gray-300 rounded"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    {statuses.slice(1).map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.address.street}, {order.address.city}, {order.address.country}, {order.address.postalCode}, {order.address.phone}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.billingAddress.street}, {order.billingAddress.city}, {order.billingAddress.country}, {order.billingAddress.postalCode}, {order.billingAddress.phone}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={goToPreviousPage}
          className={`${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={goToNextPage}
          className={`${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Export Buttons */}
      <div className="mt-4">
        <button
          onClick={exportPDF}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Export to PDF
        </button>
        <button
          onClick={exportExcel}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export to Excel
        </button>
      </div>
    </>
  )}
</div>
  );
};

export default OrderAdmin;