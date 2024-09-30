import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('card'); // For selecting payment method
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state; // This contains the passed card data

  const handlePayment = async () => {
    try {
      // Set payment method (assuming paymentMethod is a boolean flag)
      orderData.paymentMethod = true;
  
      // Make the API request to add the order
      const response = await axios.post("http://localhost:3001/api/orders/add-order", orderData);
  
     
        // Simulate payment success process
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
        <div className="border border-indigo-500 rounded-lg p-4 text-lg">
          Amount to Pay LKR {orderData?.amount}
        </div>
      </div>

      <h3 className="text-lg mb-4">How would you like to pay?</h3>

      <div className="flex space-x-4 mb-6">
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'card' ? 'border-indigo-500' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('card')}
        >
          Credit Card
        </button>
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'paypal' ? 'border-indigo-500' : 'border-gray-300'
          }`}
          onClick={() => setPaymentMethod('paypal')}
        >
          <img src="/api/placeholder/80/30" alt="PayPal" className="mx-auto" />
        </button>
        <button
          className={`flex-1 py-2 px-4 border rounded-lg ${
            paymentMethod === 'plaid' ? 'border-indigo-500' : 'border-gray-300'
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
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold"
        >
          PAY NOW
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
