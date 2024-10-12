import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [cvc, setCVC] = useState('');
  const [zip, setZip] = useState('');
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state;

  // Validation functions
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateString = (value) => /^[A-Za-z]+$/.test(value); // Only letters
  const validateCardNumber = (value) => /^\d{16}$/.test(value);
  const validateExpirationDate = (value) => /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/.test(value); // MM/DD format
  const validateCVC = (value) => /^\d{3}$/.test(value);

  // Handle input change and validate in real-time
  const handleInputChange = (field, value) => {
    let newErrors = { ...errors };

    // Validation logic based on the field
    switch (field) {
      case 'email':
        setEmail(value);
        if (!validateEmail(value)) {
          newErrors.email = 'Enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'firstName':
        setFirstName(value);
        if (!validateString(value)) {
          newErrors.firstName = 'First Name must contain only letters';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        setLastName(value);
        if (!validateString(value)) {
          newErrors.lastName = 'Last Name must contain only letters';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'cardNumber':
        setCardNumber(value);
        if (!validateCardNumber(value)) {
          newErrors.cardNumber = 'Card Number must be 16 digits';
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case 'expirationDate':
        setExpirationDate(value);
        if (!validateExpirationDate(value)) {
          newErrors.expirationDate = 'Expiration Date must be in MM/DD format';
        } else {
          delete newErrors.expirationDate;
        }
        break;
      case 'cvc':
        setCVC(value);
        if (!validateCVC(value)) {
          newErrors.cvc = 'CVC must be 3 digits';
        } else {
          delete newErrors.cvc;
        }
        break;
      case 'zip':
        setZip(value);
        if (!value) {
          newErrors.zip = 'ZIP is required';
        } else {
          delete newErrors.zip;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handlePayment = async () => {
    if (Object.keys(errors).length > 0 || !email || !firstName || !lastName || !cardNumber || !expirationDate || !cvc || !zip) {
      alert('Please fill in all the fields correctly.');
      return;
    }

    try {
      if (!orderData || !orderData.amount) {
        console.error("Order data is not available or missing required fields.");
        return;
      }

      const updatedOrderData = { ...orderData, payment: true };

      await axios.post("http://localhost:3001/api/orders/add-order", updatedOrderData);

      setTimeout(() => {
        alert('Payment Successful');
        navigate('/my-orders');
      }, 1000);
    
    } catch (error) {
      console.error("Payment error:", error);
      alert('An error occurred during payment. Please try again.');
    }
  };

  return (
    <div className="max-w-md mt-16 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Payment Summary</h2>

      <div className="mb-6">
        <div className="border border-green-500 rounded-lg p-6 bg-green-50 text-green-700 text-xl font-semibold hover:bg-green-100 transition duration-200 ease-in-out">
          Amount to Pay LKR {orderData?.amount ?? 'N/A'}
        </div>
      </div>

      <h3 className="text-lg mb-4">Fill up your personal information</h3>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-1/2 p-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-1/2 p-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
        </div>
        {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
        {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => handleInputChange('cardNumber', e.target.value)}
          className={`w-full p-2 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
        />
        {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}

        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Expiration Date (MM/DD)"
            value={expirationDate}
            onChange={(e) => handleInputChange('expirationDate', e.target.value)}
            className={`w-1/3 p-2 border ${errors.expirationDate ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          <input
            type="text"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => handleInputChange('cvc', e.target.value)}
            className={`w-1/3 p-2 border ${errors.cvc ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
          <input
            type="text"
            placeholder="ZIP"
            value={zip}
            onChange={(e) => handleInputChange('zip', e.target.value)}
            className={`w-1/3 p-2 border ${errors.zip ? 'border-red-500' : 'border-gray-300'} rounded-lg`}
          />
        </div>
        {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate}</p>}
        {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
        {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}

        <button
          type="button"
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
