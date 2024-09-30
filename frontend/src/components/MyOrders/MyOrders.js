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

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
        <p className="ml-4 text-xl font-semibold text-green-600">Loading...</p>
      </div>
    );
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
    {orders.length > 0 ? (
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 font-semibold text-left hidden">Order ID</th>
            <th className="py-2 px-4 font-semibold text-left hidden">User ID</th>
            <th className="py-2 px-4 font-semibold text-left">Amount</th>
            <th className="py-2 px-4 font-semibold text-left">Status</th>
            <th className="py-2 px-4 font-semibold text-left">Payment</th>
            <th className="py-2 px-4 font-semibold text-left">Items</th>
            <th className="py-2 px-4 font-semibold text-left">Shipping Address</th>
            <th className="py-2 px-4 font-semibold text-left">Billing Address</th>
            <th className="py-2 px-4 font-semibold text-left">Created At</th>
            <th className="py-2 px-4 font-semibold text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="py-2 px-4 hidden">{order._id}</td>
              <td className="py-2 px-4 hidden">{order.userId}</td>
              <td className="py-2 px-4">${order.amount}</td>
              <td className="py-2 px-4">{order.status}</td>
              <td className="py-2 px-4">{order.payment ? 'Paid' : 'Unpaid'}</td>
              <td className="py-2 px-4">
                <ul className="list-disc ml-4">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.name} - {item.qty} x ${item.price} (${item.qty * item.price})
                    </li>
                  ))}
                </ul>
              </td>
              <td className="py-2 px-4">
                {order.address.street}, {order.address.city}, {order.address.country} - {order.address.postalCode}
                <br />
                Phone: {order.address.phone}
              </td>
              <td className="py-2 px-4">
                {order.billingAddress.street}, {order.billingAddress.city}, {order.billingAddress.country} - {order.billingAddress.postalCode}
                <br />
                Phone: {order.billingAddress.phone}
              </td>
              <td className="py-2 px-4">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => editOrder(order._id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => viewOrder(order._id)}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                >
                  View Order
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-gray-600 text-lg">No orders found.</p>
    )}
  </div>
  );
};

export default MyOrders;
