import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddQAmember.css";

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
  const [password, setPassword] = useState(""); // New password state
  const [performanceRating, setPerformanceRating] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [nameError, setNameError] = useState(""); // State for name validation error
  const [NICError, setNICError] = useState(""); // State for NIC validation error
  const [phoneError, setPhoneError] = useState(""); // State for phone validation error
  const [passwordError, setPasswordError] = useState(""); // State for password validation error

  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate name
    if (!validateName(name)) {
      setNameError(
        "Name must contain only letters and exactly two words."
      );
      return;
    } else {
      setNameError(""); // Clear the error if validation passes
    }

    // Validate NIC
    if (!validateNIC(NIC)) {
      setNICError("NIC must be either 12 digits or 10 digits followed by 'V'.");
      return;
    } else {
      setNICError("");
    }

    // Validate phone number
    if (!validatePhone(phone)) {
      setPhoneError("Phone number must contain exactly 10 digits.");
      return;
    } else {
      setPhoneError("");
    }

    // Validate password
    if (!validatePassword(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character."
      );
      return;
    } else {
      setPasswordError(""); // Clear the error if validation passes
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
      password, // Include the password field
      performanceRating,
      isActive,
    };

    try {
      const response = await fetch("http://localhost:3001/QATeam/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });

      if (response.ok) {
        const message = await response.json();
        alert(message.message || "QA Member added successfully!");
        // Reset form fields after successful submission
        setName("");
        setNIC("");
        setEmail("");
        setPhone("");
        setBirthDay("");
        setStreet("");
        setCity("");
        setPassword(""); // Reset password field
        setPerformanceRating(3);
        setIsActive(true);
        setNameError(""); // Clear name error
        setNICError(""); // Clear NIC error
        setPhoneError(""); // Clear phone error
        setPasswordError(""); // Clear password error
        // Optionally navigate to another page
        navigate("/"); // Adjust the path as needed
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
    <div className="add-qa-member-container">
      <h2>Add QA Member</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {nameError && <p className="error">{nameError}</p>}
        </div>
        <div>
          <label>NIC:</label>
          <input
            type="text"
            value={NIC}
            onChange={(e) => setNIC(e.target.value)}
            required
          />
          {NICError && <p className="error">{NICError}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          {phoneError && <p className="error">{phoneError}</p>}
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <p className="error">{passwordError}</p>}
        </div>
        <div>
          <label>Performance Rating:</label>
          <input
            type="number"
            value={performanceRating}
            onChange={(e) => setPerformanceRating(e.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
        <div>
          <label>Is Active:</label>
          <input className="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </div>
        <button type="submit">Add QA Member</button>
      </form>
    </div>
  );
};

export default AddQAmember;
