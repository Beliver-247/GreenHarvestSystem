import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function UpdateFarmer() {
  const { id } = useParams(); // Get the farmer ID from the URL
  const navigate = useNavigate(); // For navigation after update

  const [farmerData, setFarmerData] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    age: "",
    gender: "",
    NIC: "",
    address: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({}); // Error tracking state

  useEffect(() => {
    // Fetch the farmer's details by ID
    axios
      .get(`http://localhost:3001/farmer/get/${id}`)
      .then((res) => {
        setFarmerData(res.data.farmer);
      })
      .catch((err) => {
        alert("Error fetching farmer data: " + err.message);
      });
  }, [id]);

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!/^[A-Za-z\s]*$/.test(value)) {
          error = "Only alphabets and spaces are allowed.";
        }
        break;
      case "DOB":
        const calculatedAge = calculateAge(value);
        if (calculatedAge < 18 || calculatedAge > 60) {
          error = "Age must be between 18 and 60 years.";
        }
        break;
      case "NIC":
        if (!validateNIC(value)) {
          error = "Invalid NIC format or mismatch with DOB.";
        }
        break;
      case "contact":
        if (!/^[0-9]{10}$/.test(value)) {
          error = "Contact number must be exactly 10 digits.";
        }
        break;
      case "email":
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          error = "Invalid email format.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const regex = /^[A-Za-z\s]*$/; // Allows alphabets and spaces (no numbers or special characters)
      if (!regex.test(value)) return; // Reject if not valid
    }

    setFarmerData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    validateField(name, value);
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const validateAge = (age) => {
    if (age < 18 || age > 60) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        age: "Age must be between 18 and 60 years.",
      }));
      return false;
    }
    return true;
  };

  const validateNIC = () => {
    const dobYear = new Date(farmerData.DOB).getFullYear();
    const dobYearLast2 = dobYear.toString().slice(-2); // Last 2 digits of DOB year

    if (farmerData.NIC.length === 12) {
      const nicYear = farmerData.NIC.slice(0, 4); // First 4 digits for NIC year
      const nicDays = parseInt(farmerData.NIC.slice(4, 7)); // 5th to 7th digit for days of the year
      if (nicYear !== dobYear.toString()) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "NIC year does not match Date of Birth year.",
        }));
        return false;
      }
      if (farmerData.gender === "Male" && nicDays >= 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "For males, NIC day values should be below 500.",
        }));
        return false;
      } else if (farmerData.gender === "Female" && nicDays < 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "For females, NIC day values should be 500 or above.",
        }));
        return false;
      }
    } else if (
      farmerData.NIC.length === 10 &&
      /^[0-9]{9}[Vv]$/.test(farmerData.NIC)
    ) {
      const nicYear = farmerData.NIC.slice(0, 2); // First 2 digits for NIC year
      const nicDays = parseInt(farmerData.NIC.slice(2, 5)); // 3rd to 5th digit for days of the year
      if (nicYear !== dobYearLast2) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "NIC year does not match Date of Birth year.",
        }));
        return false;
      }
      if (farmerData.gender === "Male" && nicDays >= 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "For males, NIC day values should be below 500.",
        }));
        return false;
      } else if (farmerData.gender === "Female" && nicDays < 500) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          NIC: "For females, NIC day values should be 500 or above.",
        }));
        return false;
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        NIC: "Invalid NIC format. It should be either 12 digits or 9 digits followed by 'V'.",
      }));
      return false;
    }
    return true;
  };

  const validateContact = () => {
    const contactPattern = /^[0-9]{10}$/; // Assuming a 10-digit contact number
    if (!contactPattern.test(farmerData.contact)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        contact: "Invalid contact number. It should be 10 digits.",
      }));
      return false;
    }
    return true;
  };

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format.",
      }));
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (farmerData.password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters long.",
      }));
      return false;
    }
    return true;
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const calculatedAge = calculateAge(farmerData.DOB);

    if (
      !validateAge(calculatedAge) ||
      !validateNIC() ||
      !validateContact() ||
      !validatePassword() ||
      !validateEmail(farmerData.email)
    ) {
      return;
    }

    const updatedFarmer = {
      ...farmerData,
      age: calculatedAge,
    };

    axios
      .put(`http://localhost:3001/farmer/update/${id}`, updatedFarmer)
      .then(() => {
        alert("Farmer updated successfully");
        navigate("/admin/all-farmers"); // Redirect to the "All Farmers" page
      })
      .catch((err) => {
        alert("Error updating farmer: " + err.message);
      });
  };

  // Date picker restrictions
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 60,
    today.getMonth(),
    today.getDate()
  ) // Minimum DOB for age 60
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ) // Maximum DOB for age 18
    .toISOString()
    .split("T")[0];

  return (
    <div className="flex justify-center items-center p-8 bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-lg w-full max-w-3xl">
        <h2 className="text-2xl font-bold text-center mb-6">
          Update Farmer Details
        </h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="firstName"
                value={farmerData.firstName}
                onChange={handleInputChange}
                required
              />
              {errors.firstName && (
                <span className="text-red-500">{errors.firstName}</span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="lastName"
                value={farmerData.lastName}
                onChange={handleInputChange}
                required
              />
              {errors.lastName && (
                <span className="text-red-500">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="DOB"
                value={farmerData.DOB.split("T")[0]} // Format date for input
                onChange={(e) => {
                  const dob = e.target.value;
                  setFarmerData((prevState) => ({
                    ...prevState,
                    DOB: dob,
                    age: calculateAge(dob),
                  }));
                }}
                min={minDate}
                max={maxDate}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Age</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="age"
                value={farmerData.age}
                disabled
              />
              {errors.age && (
                <span className="text-red-500">{errors.age}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Gender</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="gender"
                value={farmerData.gender}
                onChange={handleInputChange}
                required
              />
              {errors.gender && (
                <span className="text-red-500">{errors.gender}</span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">NIC</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="NIC"
                value={farmerData.NIC}
                onChange={handleInputChange}
                required
              />
              {errors.NIC && <span className="text-red-500">{errors.NIC}</span>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Contact No.</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="contact"
                value={farmerData.contact}
                onChange={handleInputChange}
                required
              />
              {errors.contact && (
                <span className="text-red-500">{errors.contact}</span>
              )}
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="password"
                value={farmerData.password}
                onChange={handleInputChange}
                required
              />
              {errors.password && (
                <span className="text-red-500">{errors.password}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">Address</label>
              <input
                type="text"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="address"
                value={farmerData.address}
                onChange={handleInputChange}
                required
              />
              {errors.address && (
                <span className="text-red-500">{errors.address}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="form-input border border-gray-300 rounded-md p-2 w-full"
                name="email"
                value={farmerData.email}
                onChange={handleInputChange}
                required
              />
              {errors.email && (
                <span className="text-red-500">{errors.email}</span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 w-full"
          >
            Update Farmer
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateFarmer;
