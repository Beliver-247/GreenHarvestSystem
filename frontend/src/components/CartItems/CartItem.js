import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from "react-icons/fa";

const Cart = () => {
  const { food_list } = useContext(StoreContext);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.post("http://localhost:3001/api/cart/get");
        if (response.data.success) {
          setCartItems(response.data.cartData);
          console.log("Fetched Cart Data:", response.data.cartData);
        } else {
          console.error("Failed to fetch cart data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    fetchCartData();
  }, []);

  // Remove item from cart and update both frontend and backend
  const handleRemoveFromCart = async (itemId) => {
    try {
      const response = await axios.post("http://localhost:3001/api/cart/remove", {
        userId: "6139e2b53e8bfc456789abcd",  // Replace this with the logged-in user ID
        itemId: itemId
      });

      if (response.data.success) {
        console.log("Item removed from cart:", itemId);
        // Update frontend state after successful backend update
        setCartItems((prevItems) => {
          const updatedItems = { ...prevItems };
          delete updatedItems[itemId];
          return updatedItems;
        });
      } else {
        console.error("Failed to remove item from cart:", response.data.message);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const newQuantity = updatedItems[itemId] + change;
      if (newQuantity > 0) {
        updatedItems[itemId] = newQuantity;
      }
      return updatedItems;
    });
  };

  const calculateDiscountPercentage = (quantity) => {
    if (quantity >= 10 && quantity <= 25) return 5;
    if (quantity >= 26 && quantity <= 50) return 7;
    if (quantity >= 51 && quantity <= 100) return 11;
    if (quantity > 100) return 14;
    return 0;
  };

  const calculateTotal = () => {
    return Object.keys(cartItems).reduce((total, itemId) => {
      const product = food_list.find((item) => item._id === itemId);
      const quantity = cartItems[itemId];
      const discountPercentage = calculateDiscountPercentage(quantity) / 100;
      const discountedPrice = product ? product.price * (1 - discountPercentage) * quantity : 0;
      return total + discountedPrice;
    }, 0);
  };

  const calculateNetWeight = () => {
    return Object.values(cartItems).reduce((totalWeight, quantity) => totalWeight + quantity, 0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-lg w-full max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-gray-900 text-left">Your Cart</h1>

        {Object.keys(cartItems).length === 0 ? (
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
              <p className="ml-4 text-xl font-semibold text-green-600">Loading...</p>
            </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="text-left border-b text-gray-700">
                    <th className="pb-6">Product</th>
                    <th className="pb-6">Quantity</th>
                    <th className="pb-6">Discount %</th>
                    <th className="pb-6 text-right">Discounted Price</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(cartItems).map((itemId) => {
                    const product = food_list.find((item) => item._id === itemId);
                    if (!product) {
                      console.warn(`Product with ID ${itemId} not found in food_list.`);
                      return null;
                    }

                    const quantity = cartItems[itemId];
                    const discountPercentage = calculateDiscountPercentage(quantity);
                    const discountedPrice = product.price * (1 - discountPercentage / 100) * quantity;

                    return (
                      <tr key={itemId} className="border-b hover:bg-gray-50 transition">
                        <td className="py-2 flex items-center">
                          <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-left">
                            <p className="font-semibold text-lg text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">Rs {product.price.toFixed(2)}</p>
                          </div>
                        </td>
                        <td className="py-6">
                          <div className="flex items-center">
                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(itemId, -1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                              >
                                -
                              </button>
                              <span className="font-bold px-4 py-2">
                                {cartItems[itemId]} Kg
                              </span>
                              <button
                                onClick={() => handleQuantityChange(itemId, 1)}
                                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="ml-4 text-gray-400 hover:text-red-600 transition"
                              onClick={() => handleRemoveFromCart(itemId)}  // Updated to call handleRemoveFromCart
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </td>
                        <td className="py-6 text-center">{discountPercentage}%</td>
                        <td className="py-6 text-right font-semibold">
                          Rs {discountedPrice.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Section */}
            <div className="mt-12 border-t pt-6">
              <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="text-gray-600">Net Weight</span>
                  <span className="font-semibold text-xl text-gray-900">
                    {calculateNetWeight()} Kg
                  </span>
                </div>
                <div className="flex flex-col mb-4 md:mb-0">
                  <span className="text-gray-600">Sub total</span>
                  <span className="font-semibold text-xl text-gray-900">
                    Rs {calculateTotal().toFixed(2)} LKR
                  </span>
                </div> 
                <Link to={{
                    pathname: "/checkout",
                    state: { cartItems }  // Send the cartItems as state
                  }}>
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition duration-300 text-lg font-medium">
                      Check out
                    </button>
                  </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;


