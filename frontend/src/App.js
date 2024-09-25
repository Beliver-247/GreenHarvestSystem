import React from 'react';
import './App.css';
import SideNav from './components/SideNav';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import OrderForm from './components/order/OrderForm';
import Home from "./pages/home/Home.js";
import Cart from "./pages/cart/Cart.js";
import Product from "./pages/product/Product.js";



function App() {
  return (

    <div className="App">   
   
      <Router>
        <SideNav/>
        <OrderForm/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<Product />} />
        </Routes>
      </Router>
      
    </div>
  );
}

export default App;
