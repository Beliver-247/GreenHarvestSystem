import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerRequest() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [customerRequest, setCustomerRequest] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const apiUrl = "http://localhost:3001/api";

  const validateForm = () => {
    // Ensure pickup location is filled and has at least 3 characters
    if (pickupLocation.trim().length < 3) {
      return "Pickup location must be at least 3 characters.";
    }

    // Ensure the date is in the future
    const currentDate = new Date();
    const selectedDate = new Date(pickupDate);
    if (!pickupDate || selectedDate <= currentDate) {
      return "Please select a valid future date.";
    }

    // Ensure time is selected
    if (!pickupTime) {
      return "Please select a valid time.";
    }

    // Ensure vehicle type is selected
    if (!selectedVehicle) {
      return "Please select a vehicle type.";
    }

    return null; // No errors, form is valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const errorMessage = validateForm(); // Validate form before submission
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    fetch(apiUrl + "/customerRequest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pickupLocation, 
        pickupDate, 
        pickupTime, 
        selectedVehicle,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP status ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCustomerRequest([
          ...customerRequest,
          { pickupLocation, pickupDate, pickupTime, selectedVehicle },
        ]);
        setSuccessMessage("Customer request added successfully");
        setError("");

        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);

        navigate("/customerRequestDB");
      })
      .catch((error) => {
        console.error("Error:", error);
        setError("Failed to create customer request. Please try again.");
      });
  };

  return (
    <div className="w-screen h-screen bg-cover bg-center bg-no-repeat flex justify-center items-center"
         style={{ backgroundImage: `url('./customerRequest.jpg')` }}>
          <div className="fixed top-0 left-0 h-full w-60 bg-green-800 text-white flex flex-col py-4 px-6 shadow-lg">
        <h2 className="text-xl mb-8">G S P Traders</h2>
        <nav className="space-y-4">
          <a href="http://localhost:3000/FarmerRequest" className="flex items-center space-x-2 hover:underline">
            <span>🚜</span>
            <span>Farmer requests</span>
          </a>
          <a href="http://localhost:3000/customerRequest" className="flex items-center space-x-2 hover:underline">
          <span>🛒</span>
          <span>Customer requests</span>
          </a>
          
        </nav>
      </div>
      
      <div className="bg-white bg-opacity-90 max-w-xs md:max-w-sm w-11/12 p-6 md:p-8 mt-16 rounded-lg shadow-lg text-center animate-fadeIn">
        <h2 className="text-2xl mb-4 text-gray-800 font-semibold animate-slideDown">Customer Delivery Request</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="block text-left">Pickup Location</label>
            <input 
              type="text" 
              placeholder="Enter your location"
              className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
              onChange={(e) => setPickupLocation(e.target.value)}
              value={pickupLocation}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-left">Pickup Date</label>
            <input 
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
              onChange={(e) => setPickupDate(e.target.value)}
              value={pickupDate}
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-left">Pickup Time</label>
            <input 
              type="time" 
              className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
              onChange={(e) => setPickupTime(e.target.value)}
              value={pickupTime}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-left">Vehicle Type</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 hover:scale-105"
              onChange={(e) => setSelectedVehicle(e.target.value)} 
              value={selectedVehicle}
            >
              <option value="" disabled>Select vehicle type</option>
              <option value="Farmer Vehicle">Farmer Vehicle</option>
              <option value="Company Vehicle">Company Vehicle</option>
            </select>
          </div>
          
          <button type="submit" className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 transform hover:scale-105">Submit delivery schedule</button>
          {successMessage && <p className="text-green-600 mt-4 animate-pulse">{successMessage}</p>}
          {error && <p className="text-red-600 mt-4 animate-bounce">{error}</p>}
        </form>
      </div>
    </div>
  );
}
