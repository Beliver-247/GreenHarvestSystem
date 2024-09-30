import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const OrderForm = () => {
  const { id } = useParams();
  const { food_list, cartItems } = useContext(StoreContext);
  const product = food_list.find((item) => item._id === id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "", // Assume a logged-in user
    address: {
      country: '',
      street: '',
      city: '',
      postalCode: '',
      phone: ''
    },
    billingAddress: {
      country: '',
      street: '',
      city: '',
      postalCode: '',
      phone: ''
    },
  });

  const [isSameAsShipping, setIsSameAsShipping] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const [field, subfield] = name.split('.');

    if (subfield) {
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...prev[field],
          [subfield]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBillingAddressToggle = (e) => {
    setIsSameAsShipping(e.target.value === 'same');
  };

  useEffect(() => {
    if (isSameAsShipping) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: { ...prev.address } // Copy shipping address to billing address
      }));
    }
  }, [isSameAsShipping, formData.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      userId: formData.userId,
      items: [
        {
          id: product._id,
          name: product.name,
          qty: cartItems[id],
          price: product.price,
          image: product.image
        }
      ],
      amount: product.price * cartItems[id] + 250,
      address: formData.address,
      billingAddress: formData.billingAddress,
      payment: false
    };

    try {
      navigate('/payment', { state: orderData });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left Side: Shipping and Billing Address */}
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  name="address.street"
                  placeholder="Street"
                  onChange={handleChange}
                  value={formData.address.street}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  required
                />
                <input
                  name="address.city"
                  placeholder="City"
                  onChange={handleChange}
                  value={formData.address.city}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  required
                />
                <input
                  name="address.country"
                  placeholder="Country"
                  onChange={handleChange}
                  value={formData.address.country}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  required
                />
                <input
                  name="address.postalCode"
                  placeholder="Postal Code"
                  onChange={handleChange}
                  value={formData.address.postalCode}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  required
                />
                <input
                  name="address.phone"
                  placeholder="Phone"
                  onChange={handleChange}
                  value={formData.address.phone}
                  className="w-full p-2 border rounded-md bg-gray-100"
                  required
                />
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Billing Address</h2>
              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="same"
                    checked={isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2"
                  />
                  <label>Same as shipping address</label>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    name="billingAddressOption"
                    value="different"
                    checked={!isSameAsShipping}
                    onChange={handleBillingAddressToggle}
                    className="mr-2"
                  />
                  <label>Use a different billing address</label>
                </div>

                {!isSameAsShipping && (
                  <>
                    <input
                      name="billingAddress.street"
                      placeholder="Street"
                      onChange={handleChange}
                      value={formData.billingAddress.street}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      required
                    />
                    <input
                      name="billingAddress.city"
                      placeholder="City"
                      onChange={handleChange}
                      value={formData.billingAddress.city}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      required
                    />
                    <input
                      name="billingAddress.country"
                      placeholder="Country"
                      onChange={handleChange}
                      value={formData.billingAddress.country}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      required
                    />
                    <input
                      name="billingAddress.postalCode"
                      placeholder="Postal Code"
                      onChange={handleChange}
                      value={formData.billingAddress.postalCode}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      required
                    />
                    <input
                      name="billingAddress.phone"
                      placeholder="Phone"
                      onChange={handleChange}
                      value={formData.billingAddress.phone}
                      className="w-full p-2 border rounded-md bg-gray-100"
                      required
                    />
                  </>
                )}
              </div>
            </section>
            <button
              type="submit" className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-purple-700">
              Next
            </button>
          </div>

          {/* Right Side: Order Summary */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {/* Display product image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 bg-gray-200 rounded"
                />
                <div className="flex-1">
                  {/* Display product name */}
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-gray-600">{cartItems[id]} Kg</p>
                </div>
                {/* Display product price */}
                <p className="font-semibold">Rs {product.price}.00</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sub total</span>
                <span>Rs {product.price * cartItems[id]}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs 250.00</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {product.price * cartItems[id] + 250}.00</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;


// import React, { useState } from "react";
// import axios from "axios";

// const OrderForm = () => {
//   const [orderData, setOrderData] = useState({
//     userId: "",
//     items: [
//       {
//         id: "",
//         name: "",
//         qty: 0,
//         price: 0,
//         image: ""
//       }
//     ],
//     amount: 0,
//     address: {
//       country: "",
//       street: "",
//       city: "",
//       postalCode: "",
//       phone: ""
//     },
//     payment: false
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setOrderData((prevState) => ({
//       ...prevState,
//       [name]: value
//     }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setOrderData((prevState) => ({
//       ...prevState,
//       address: {
//         ...prevState.address,
//         [name]: value
//       }
//     }));
//   };

//   const handleItemChange = (e, index) => {
//     const { name, value } = e.target;
//     const items = [...orderData.items];
//     items[index] = {
//       ...items[index],
//       [name]: value
//     };
//     setOrderData((prevState) => ({ ...prevState, items }));
//   };

//   const addItem = () => {
//     setOrderData((prevState) => ({
//       ...prevState,
//       items: [...prevState.items, { id: "", name: "", qty: 0, price: 0, image: "" }]
//     }));
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("http://localhost:9000/api/orders/add-orders", orderData);
//       console.log("Order submitted successfully", response.data);
//       alert("Order created successfully!");
//     } catch (error) {
//       console.error("There was an error creating the order!", error);
//       alert("Failed to create order.");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h1>Create an Order</h1>

//       <div>
//         <label>User ID:</label>
//         <input
//           type="text"
//           name="userId"
//           value={orderData.userId}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       {orderData.items.map((item, index) => (
//         <div key={index}>
//           <h3>Item {index + 1}</h3>
//           <div>
//             <label>Item ID:</label>
//             <input
//               type="text"
//               name="id"
//               value={item.id}
//               onChange={(e) => handleItemChange(e, index)}
//               required
//             />
//           </div>
//           <div>
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={item.name}
//               onChange={(e) => handleItemChange(e, index)}
//               required
//             />
//           </div>
//           <div>
//             <label>Quantity:</label>
//             <input
//               type="number"
//               name="qty"
//               value={item.qty}
//               onChange={(e) => handleItemChange(e, index)}
//               required
//             />
//           </div>
//           <div>
//             <label>Price:</label>
//             <input
//               type="number"
//               name="price"
//               value={item.price}
//               onChange={(e) => handleItemChange(e, index)}
//               required
//             />
//           </div>
//           <div>
//             <label>Image URL:</label>
//             <input
//               type="text"
//               name="image"
//               value={item.image}
//               onChange={(e) => handleItemChange(e, index)}
//               required
//             />
//           </div>
//         </div>
//       ))}

//       <button type="button" onClick={addItem}>
//         Add Another Item
//       </button>

//       <div>
//         <label>Total Amount:</label>
//         <input
//           type="number"
//           name="amount"
//           value={orderData.amount}
//           onChange={handleChange}
//           required
//         />
//       </div>

//       <h2>Shipping Address</h2>
//       <div>
//         <label>Country:</label>
//         <input
//           type="text"
//           name="country"
//           value={orderData.address.country}
//           onChange={handleAddressChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Street:</label>
//         <input
//           type="text"
//           name="street"
//           value={orderData.address.street}
//           onChange={handleAddressChange}
//           required
//         />
//       </div>
//       <div>
//         <label>City:</label>
//         <input
//           type="text"
//           name="city"
//           value={orderData.address.city}
//           onChange={handleAddressChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Postal Code:</label>
//         <input
//           type="text"
//           name="postalCode"
//           value={orderData.address.postalCode}
//           onChange={handleAddressChange}
//           required
//         />
//       </div>
//       <div>
//         <label>Phone Number:</label>
//         <input
//           type="text"
//           name="phone"
//           value={orderData.address.phone}
//           onChange={handleAddressChange}
//           required
//         />
//       </div>

//       <div>
//         <label>Payment Completed:</label>
//         <input
//           type="checkbox"
//           name="payment"
//           checked={orderData.payment}
//           onChange={(e) => setOrderData({ ...orderData, payment: e.target.checked })}
//         />
//       </div>

//       <button type="submit">Submit Order</button>
//     </form>
//   );
// };

// export default OrderForm;
