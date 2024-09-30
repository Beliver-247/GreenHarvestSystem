import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To handle navigation

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // React Router hook for navigation

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/orders/user-list');
        if (response.data && response.data.data) {
          setOrders(response.data.data); // Assuming the response is { success: true, data: [...] }
        } else {
          setOrders([]); // Ensure it's an empty array if the response doesn't contain valid data
        }
      } catch (error) {
        setError('Error fetching orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?"); // Confirmation dialog
    console.log("Delete confirmation dialog shown:", confirmDelete); // Log confirmation response
    if (!confirmDelete) return; // Exit if user cancels

    try {
        console.log(`Attempting to delete order with ID: ${orderId}`); // Log the order ID
        await axios.delete(`http://localhost:3001/api/orders/${orderId}`);
        // Remove the deleted order from the orders list
        setOrders(orders.filter((order) => order._id !== orderId));
        // Show toast here for deletion success
        alert("Order deleted successfully!"); // Replace with toast notification if desired
    } catch (error) {
        console.error('Error deleting order:', error);
        alert("Error deleting order"); // Replace with toast notification if desired
    }
};

  const editOrder = (orderId) => {
    navigate(`/edit-order/${orderId}`);
    console.log(`Edit order with ID: ${orderId}`);
  };

  const viewOrder = (orderId) => {
    // Redirect to order details page
    navigate(`/order-details/${orderId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <table border="1" cellPadding="10" cellSpacing="0">
          <thead>
            <tr>
              {/* Order ID is hidden */}
              {/* <th>Order ID</th> */}
              <th>Amount</th>
              <th>Status</th>
              <th>Items</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                {/* Order ID column is hidden */}
                {/* <td>{order._id}</td> */}
                <td>${order.amount}</td>
                <td>{order.status}</td>
                <td>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} - {item.qty} x ${item.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button onClick={() => editOrder(order._id)}>Edit</button>
                  <button onClick={() => deleteOrder(order._id)} style={{ marginLeft: '10px' }}>
                    Delete
                  </button>
                  <button onClick={() => viewOrder(order._id)} style={{ marginLeft: '10px' }}>
                    View Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
