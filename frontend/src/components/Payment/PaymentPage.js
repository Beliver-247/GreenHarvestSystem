import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const navigate = useNavigate();

  const handlePayment = () => {
    // Simulate payment process
    setTimeout(() => {
      alert('Payment Successful');
      navigate('/my-orders'); // Redirect to order page after payment
    }, 1000);
  };

  return (
    <div>
      <h1>Payment</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;