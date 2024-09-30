// src/components/EditOrder.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate

const EditOrder = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/orders/${orderId}`);
        if (response.data.success) {
          setOrder(response.data.data);
        } else {
          setError("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prevOrder) => ({ ...prevOrder, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8070/api/orders/list-all-orders/${orderId}`, order);
      // Show toast here (you can implement a toast library)
      alert("Order edited successfully!");
      navigate('/my-orders'); // Redirect to My Orders page
    } catch (error) {
      console.error("Error updating order:", error);
      setError("Error updating order");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Edit Order</h1>
      <form onSubmit={handleSave}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            value={order.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
          />
        </div>
        <div>
          <label>Status</label>
          <input
            type="text"
            name="status"
            value={order.status}
            onChange={handleChange}
            placeholder="Status"
            required
          />
        </div>
        <div>
          <h3>Items</h3>
          {order.items.map((item, index) => (
            <div key={index}>
              <label>{item.name}</label>
              <input
                type="number"
                name="qty"
                value={item.qty}
                onChange={(e) => {
                  const newItems = [...order.items];
                  newItems[index].qty = e.target.value;
                  setOrder({ ...order, items: newItems });
                }}
                placeholder="Quantity"
                required
              />
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={(e) => {
                  const newItems = [...order.items];
                  newItems[index].price = e.target.value;
                  setOrder({ ...order, items: newItems });
                }}
                placeholder="Price"
                required
              />
            </div>
          ))}
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditOrder;
