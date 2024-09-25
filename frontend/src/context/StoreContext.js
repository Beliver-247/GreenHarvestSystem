import React, { useEffect, useState, createContext } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);
  const url = "http://localhost:8070";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Function to add items to cart
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Function to remove items from cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { token } }
      );
    }
  };

  // Function to calculate the total cart amount
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  // Fetch food list from API
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.foods); // Set food_list state with data
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  // Load cart data if token is available
  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token } }
    );
    setCartItems(response.data.cartData);
  };

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
          await loadCartData(localStorage.getItem("token"));
        }
      } catch (error) {
        console.error("Error loading data", error);
      }
    }
    loadData();
  }, []);

  // Add sample data in case fetch fails
  useEffect(() => {
    if (food_list.length === 0) {
      // If food_list is still empty, use this sample data as fallback
      console.log("Adding sample data");
      setFoodList([
        {
          _id: "66f0e1c94c4202ca997ecd3f",
          name: "Carrot Delight",
          description: "Fresh carrots from organic farms",
          quantity: 100,
          price: 330,
          image: "file_1727062473398.jpg",
          discount: 25,
          category: "Carrots",
          expDate: "2024-09-27T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2104c4202ca997ecd44",
          name: "Green Cabbage",
          description: "Crisp and fresh green cabbage",
          quantity: 50,
          price: 270,
          image: "file_1727062544389.jpg",
          discount: 30,
          category: "Cabbage",
          expDate: "2024-09-30T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2904c4202ca997ecd4d",
          name: "Organic Leeks",
          description: "Organic leeks and pesticide-free",
          quantity: 75,
          price: 200,
          image: "file_1727062672479.jpg",
          discount: 10,
          category: "Leeks",
          expDate: "2024-09-29T00:00:00.000+00:00",
        },
        {
          _id: "66f0e2df4c4202ca997ecd52",
          name: "Mini Carrots",
          description: "Bite-sized mini carrots",
          quantity: 20,
          price: 300,
          image: "file_1727062751656.jpg",
          discount: 50,
          category: "Carrots",
          expDate: "2024-09-27T00:00:00.000+00:00",
        },
        {
          _id: "66f0e3184c4202ca997ecd57",
          name: "Organic Potatoes",
          description: "Potatoes grown in organic farms",
          quantity: 1000,
          price: 300,
          image: "file_1727062808600.jpg",
          discount: 60,
          category: "Potatoes",
          expDate: "2024-09-25T00:00:00.000+00:00",
        },
        {
          _id: "66f0e35b4c4202ca997ecd5c",
          name: "Shredded Cabbage",
          description: "Pre-shredded cabbage for salads",
          quantity: 90,
          price: 270,
          image: "file_1727062875766.jpg",
          discount: 20,
          category: "Cabbage",
          expDate: "2024-09-24T00:00:00.000+00:00",
        },
        {
          _id: "66f0e3844c4202ca997ecd61",
          name: "Organic Potatoes",
          description: "Potatoes grown in organic farms",
          quantity: 20,
          price: 300,
          image: "file_1727062916984.jpg",
          discount: 20,
          category: "Potatoes",
          expDate: "2024-09-30T00:00:00.000+00:00",
        },
        {
          _id: "66f0e3c34c4202ca997ecd6c",
          name: "Leek Mix",
          description: "Mixed leeks for various dishes",
          quantity: 120,
          price: 2100,
          image: "file_1727062979448.jpg",
          discount: 20,
          category: "Leeks",
          expDate: "2024-10-05T00:00:00.000+00:00",
        },
      ]);
    }
  }, [food_list]); // Only add sample data if `food_list` is empty

  const contextValue = {
    food_list, // Use the state value here
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
