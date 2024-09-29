import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Helper function for name validation (only letters and exactly two words)
const validateName = (name) => {
  const nameRegex = /^[A-Za-z]+\s[A-Za-z]+$/;
  return nameRegex.test(name);
};

// Helper function for NIC validation (should be either 10 digits + 'V' or 12 digits)
const validateNIC = (NIC) => {
  return /^\d{12}$|^\d{10}V$/.test(NIC);
};

// Helper function for phone number validation (must be exactly 10 digits)
const validatePhone = (phone) => {
  return /^\d{10}$/.test(phone);
};

// Helper function for password validation (must be at least 8 characters, contain one uppercase, one number, and one special character)
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

const AddQAmember = () => {
  const [name, setName] = useState("");
  const [NIC, setNIC] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState(""); 
  const [performanceRating, setPerformanceRating] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState(""); 
  const [NICError, setNICError] = useState(""); 
  const [phoneError, setPhoneError] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateName(name)) {
      setNameError("Name must contain only letters and exactly two words.");
      return;
    } else {
      setNameError("");
    }

    if (!validateNIC(NIC)) {
      setNICError("NIC must be either 12 digits or 10 digits followed by 'V'.");
      return;
    } else {
      setNICError("");
    }

    if (!validatePhone(phone)) {
      setPhoneError("Phone number must contain exactly 10 digits.");
      return;
    } else {
      setPhoneError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.");
      return;
    } else {
      setPasswordError("");
    }

    const newMember = {
      name,
      NIC,
      contactInfo: {
        email,
        phone,
      },
      birthDay,
      address: {
        street,
        city,
      },
      password, 
      performanceRating,
      isActive,
    };

    try {
      const response = await fetch("http://localhost:3000/QATeam/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        const message = await response.json();
        alert(message.message || "QA Member added successfully!");
        setName("");
        setNIC("");
        setEmail("");
        setPhone("");
        setBirthDay("");
        setStreet("");
        setCity("");
        setPassword(""); 
        setPerformanceRating(3);
        setIsActive(true);
        setNameError(""); 
        setNICError(""); 
        setPhoneError(""); 
        setPasswordError(""); 
        navigate("/"); 
      } else {
        const errorMessage = await response.text();
        alert("Error: " + errorMessage);
      }
    } catch (err) {
      console.error("Error: " + err);
      alert("Error: " + err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-lg shadow-md transition duration-300 ease-in-out hover:shadow-lg">
      <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800">Add QA Member</h2>
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">NIC:</label>
          <input
            type="text"
            value={NIC}
            onChange={(e) => setNIC(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {NICError && <p className="text-red-500 text-sm mt-1">{NICError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
          <input
            type="date"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Performance Rating:</label>
          <input
            type="number"
            value={performanceRating}
            onChange={(e) => setPerformanceRating(e.target.value)}
            min="1"
            max="5"
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700">Is Active:</label>
          <input
            className="ml-3 w-6 h-6 text-green-500 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
        <button type="submit" className="w-full bg-green-500 text-white font-semibold py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out">
          Add QA Member
        </button>
      </form>
    </div>
  );
};

export default AddQAmember;
