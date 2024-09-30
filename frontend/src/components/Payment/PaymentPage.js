import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // For selecting payment method
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state; // This contains the passed order data

  const handlePayment = async () => {
    try {
      // Check if orderData exists and has the required fields
      if (!orderData || !orderData.amount) {
        console.error("Order data is not available or missing required fields.");
        return;
      }

      // Set payment as true in orderData before sending to backend
      const updatedOrderData = { ...orderData, payment: true };
  
      // Make the POST request to add the order
      await axios.post("http://localhost:3001/api/orders/add-order", updatedOrderData);
  
      setTimeout(() => {
        alert('Payment Successful');
        navigate('/my-orders'); // Redirect to orders page after payment
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

      <h3 className="text-lg mb-4">How would you like to pay?</h3>

      <div className="flex space-x-4 mb-6">
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'card' ? 'border-green-500' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          Credit Card
        </button>
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'paypal' ? 'border-green-500' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <img src="/api/placeholder/80/30" alt="PayPal" className="mx-auto" />
        </button>
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'plaid' ? 'border-green-500' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('plaid')}
        >
          <img src="/api/placeholder/80/30" alt="Plaid" className="mx-auto" />
        </button>
      </div>

      <h3 className="text-lg mb-4">Fill up your personal information</h3>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-1/2 p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-1/2 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <input
          type="text"
          placeholder="Card Number"
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Expiration Date"
            className="w-1/3 p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="CVC"
            className="w-1/3 p-2 border border-gray-300 rounded-lg"
          />
          <input
            type="text"
            placeholder="ZIP"
            className="w-1/3 p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <button
          type="button" // Ensure the button does not cause form submission
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          Pay Now
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Powered by</p>
        <div className="flex justify-center space-x-2 mt-2">
          {['Stripe', 'PayPal', 'Visa', 'UnionPay', 'CB', 'Plaid'].map(
            (brand) => (
              <img key={brand} src={`/api/placeholder/40/25`} alt={brand} className="h-6 object-contain" />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
