import React, { useState, useEffect } from "react";
import jsPDF from "jspdf"; // Import jsPDF

export default function CustomerRequestDB() {
  const [customerRequest, setCustomerRequest] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  // Search state
  const [selectedDateRange, setSelectedDateRange] = useState("");

  // Edit fields
  const [editPickupLocation, setEditPickupLocation] = useState("");
  const [editPickupDate, setEditPickupDate] = useState("");
  const [editPickupTime, setEditPickupTime] = useState("");
  const [editSelectedVehicle, setEditSelectedVehicle] = useState("");

  const apiUrl = "http://localhost:3001/api";

  useEffect(() => {
    getCustomerRequest();
  }, []);

  const getCustomerRequest = () => {
    fetch(apiUrl + "/customerRequest")
      .then((res) => res.json())
      .then((res) => {
        setCustomerRequest(res);
      });
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditPickupLocation(item.pickupLocation);
    setEditPickupDate(item.pickupDate);
    setEditPickupTime(item.pickupTime);
    setEditSelectedVehicle(item.selectedVehicle);
  };

  const handleUpdate = () => {
    setError("");

    if (
      editPickupLocation.trim() !== "" &&
      editPickupDate.trim() !== "" &&
      editPickupTime.trim() !== "" &&
      editSelectedVehicle.trim() !== ""
    ) {
      fetch(apiUrl + "/customerRequest/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickupLocation: editPickupLocation,
          pickupDate: editPickupDate,
          pickupTime: editPickupTime,
          selectedVehicle: editSelectedVehicle,
        }),
      })
        .then((res) => {
          if (res.ok) {
            const updatedCustomerRequest = customerRequest.map((item) => {
              if (item._id === editId) {
                item.pickupLocation = editPickupLocation;
                item.pickupDate = editPickupDate;
                item.pickupTime = editPickupTime;
                item.selectedVehicle = editSelectedVehicle;
              }
              return item;
            });

            setCustomerRequest(updatedCustomerRequest);
            setSuccessMessage("Customer request updated successfully");
            setError("");
            setTimeout(() => {
              setSuccessMessage("");
            }, 3000);
            setEditId(-1);
          } else {
            setError("Unable to update customer request");
          }
        })
        .catch(() => {
          setError("Failed to fetch");
        });
    } else {
      setError("All fields are required");
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete?")) {
      fetch(apiUrl + "/customerRequest/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedCustomerRequest = customerRequest.filter(
          (item) => item._id !== id
        );
        setCustomerRequest(updatedCustomerRequest);
      });
    }
  };

  // Handle search range selection
  const handleSearchChange = (e) => {
    setSelectedDateRange(e.target.value);
  };

  const filterCustomerRequestsByDateRange = () => {
    if (!selectedDateRange) return customerRequest;

    const [minDay, maxDay] = selectedDateRange.split("-").map(Number);

    return customerRequest.filter((item) => {
      const dayOfMonth = parseInt(item.pickupDate.split("-")[2], 10); // Assuming date format YYYY-MM-DD
      return dayOfMonth >= minDay && dayOfMonth <= maxDay;
    });
  };

  // Function to generate PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    let y = 10; // Starting Y position in PDF
    doc.text("Customer Requests", 10, y);
    y += 10;

    // Add each customer request to PDF
    customerRequest.forEach((item, index) => {
      doc.text(
        `Request ${index + 1}: ${item.pickupLocation}, ${item.pickupDate}, ${item.pickupTime}, ${item.selectedVehicle}`,
        10,
        y
      );
      y += 10;
    });

    // Download the PDF
    doc.save("customer_requests.pdf");
  };

  return (
    <>
      <div className="container mx-auto mt-3 bg-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
            Customer Requests
          </h1>

          {/* Search Dropdown in Top Right Corner */}
          <div className="flex flex-col ml-4">
            <label htmlFor="date-range" className="text-gray-700">Search by Date Range:</label>
            <select
              id="date-range"
              className="border border-gray-300 p-2 rounded"
              value={selectedDateRange}
              onChange={handleSearchChange}
            >
              <option value="">All Dates</option>
              <option value="1-5">1-5</option>
              <option value="6-10">6-10</option>
              <option value="11-15">11-15</option>
              <option value="16-20">16-20</option>
              <option value="21-25">21-25</option>
              <option value="26-30">26-30</option>
            </select>
          </div>

          {/* Export PDF Button */}
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={exportToPDF}>
            Export to PDF
          </button>
        </div>

        <div className="mt-6">
          <ul className="space-y-4">
            {filterCustomerRequestsByDateRange().map((item) => (
              <li
                className="bg-blue-100 p-4 rounded-lg shadow-lg flex justify-between items-center"
                key={item._id}
              >
                <div className="flex flex-col">
                  {editId === -1 || editId !== item._id ? (
                    <>
                      <span className="font-bold text-gray-800">{item.pickupLocation}</span>
                      <span className="text-gray-600">{item.pickupDate}</span>
                      <span className="text-gray-600">{item.pickupTime}</span>
                      <span className="text-gray-600">{item.selectedVehicle}</span>
                    </>
                  ) : (
                    <>
                      <div className="mb-2">
                        <label htmlFor="pickup-location" className="block text-gray-700">Pickup Location</label>
                        <input
                          type="text"
                          id="pickup-location"
                          placeholder="Enter your location"
                          onChange={(e) => setEditPickupLocation(e.target.value)}
                          value={editPickupLocation}
                          className="border border-gray-300 p-2 rounded w-full"
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="pickup-date" className="block text-gray-700">Pickup Date</label>
                        <input
                          type="date"
                          id="pickup-date"
                          onChange={(e) => setEditPickupDate(e.target.value)}
                          value={editPickupDate}
                          className="border border-gray-300 p-2 rounded w-full"
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="pickup-time" className="block text-gray-700">Pickup Time</label>
                        <input
                          type="time"
                          id="pickup-time"
                          onChange={(e) => setEditPickupTime(e.target.value)}
                          value={editPickupTime}
                          className="border border-gray-300 p-2 rounded w-full"
                        />
                      </div>

                      <div className="mb-2">
                        <label htmlFor="vehicle-type" className="block text-gray-700">Vehicle Type</label>
                        <select
                          id="vehicle-type"
                          onChange={(e) => setEditSelectedVehicle(e.target.value)}
                          value={editSelectedVehicle}
                          className="border border-gray-300 p-2 rounded w-full"
                        >
                          <option value="" disabled>
                            Select vehicle type
                          </option>
                          <option value="Farmer Vehicle">Farmer Vehicle</option>
                          <option value="Company Vehicle">Company Vehicle</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-2">
                  {editId === -1 || editId !== item._id ? (
                    <button
                      className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                  ) : (
                    <button
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                  )}

                  {editId === -1 ? (
                    <button
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  ) : (
                    <button
                      className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
