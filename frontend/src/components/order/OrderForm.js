import React, { useState } from "react";
import axios from "axios";

const OrderForm = () => {
  const [orderData, setOrderData] = useState({
    userId: "",
    items: [
      {
        id: "",
        name: "",
        qty: 0,
        price: 0,
        image: ""
      }
    ],
    amount: 0,
    address: {
      country: "",
      street: "",
      city: "",
      postalCode: "",
      phone: ""
    },
    payment: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prevState) => ({
      ...prevState,
      address: {
        ...prevState.address,
        [name]: value
      }
    }));
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    const items = [...orderData.items];
    items[index] = {
      ...items[index],
      [name]: value
    };
    setOrderData((prevState) => ({ ...prevState, items }));
  };

  const addItem = () => {
    setOrderData((prevState) => ({
      ...prevState,
      items: [...prevState.items, { id: "", name: "", qty: 0, price: 0, image: "" }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/orders/add-orders", orderData);
      console.log("Order submitted successfully", response.data);
      alert("Order created successfully!");
    } catch (error) {
      console.error("There was an error creating the order!", error);
      alert("Failed to create order.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create an Order</h1>

      <div>
        <label>User ID:</label>
        <input
          type="text"
          name="userId"
          value={orderData.userId}
          onChange={handleChange}
          required
        />
      </div>

      {orderData.items.map((item, index) => (
        <div key={index}>
          <h3>Item {index + 1}</h3>
          <div>
            <label>Item ID:</label>
            <input
              type="text"
              name="id"
              value={item.id}
              onChange={(e) => handleItemChange(e, index)}
              required
            />
          </div>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={(e) => handleItemChange(e, index)}
              required
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              name="qty"
              value={item.qty}
              onChange={(e) => handleItemChange(e, index)}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={(e) => handleItemChange(e, index)}
              required
            />
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="image"
              value={item.image}
              onChange={(e) => handleItemChange(e, index)}
              required
            />
          </div>
        </div>
      ))}

      <button type="button" onClick={addItem}>
        Add Another Item
      </button>

      <div>
        <label>Total Amount:</label>
        <input
          type="number"
          name="amount"
          value={orderData.amount}
          onChange={handleChange}
          required
        />
      </div>

      <h2>Shipping Address</h2>
      <div>
        <label>Country:</label>
        <input
          type="text"
          name="country"
          value={orderData.address.country}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Street:</label>
        <input
          type="text"
          name="street"
          value={orderData.address.street}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>City:</label>
        <input
          type="text"
          name="city"
          value={orderData.address.city}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Postal Code:</label>
        <input
          type="text"
          name="postalCode"
          value={orderData.address.postalCode}
          onChange={handleAddressChange}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          type="text"
          name="phone"
          value={orderData.address.phone}
          onChange={handleAddressChange}
          required
        />
      </div>

      <div>
        <label>Payment Completed:</label>
        <input
          type="checkbox"
          name="payment"
          checked={orderData.payment}
          onChange={(e) => setOrderData({ ...orderData, payment: e.target.checked })}
        />
      </div>

      <button type="submit">Submit Order</button>
    </form>
  );
};

export default OrderForm;
