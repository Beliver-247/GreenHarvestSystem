import React, { useState, useEffect } from "react";
import PriceChart from "./PriceChart";
import QuantitySelector from "./QuantitySelector";
import productImage from "../../images/Carrot.jpeg"; // Adjust path as needed

const ProductDetails = () => {
  const minQuantity = 10; // Minimum quantity constant
  const maxQuantity = 100; // Maximum quantity constant
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(350);
  const [discount, setDiscount] = useState(5);
  const [discountedPrice, setDiscountedPrice] = useState(unitPrice * quantity);
  const [savePrice, setSavePrice] = useState(0);
  const [minQuantityWarning, setMinQuantityWarning] = useState(false);
  const [maxQuantityWarning, setMaxQuantityWarning] = useState(false);

  const calculatePrice = (newQuantity) => {
    let newUnitPrice = 350;
    let newDiscount = 5;

    if (newQuantity >= 26 && newQuantity <= 50) {
      newUnitPrice = 340;
      newDiscount = 7;
    } else if (newQuantity >= 51 && newQuantity <= 100) {
      newUnitPrice = 310;
      newDiscount = 11;
    } else if (newQuantity >= 101) {
      newUnitPrice = 300;
      newDiscount = 14;
    }

    const newDiscountedPrice =
      newUnitPrice * newQuantity * (1 - newDiscount / 100);
    const newSavePrice = newUnitPrice * newQuantity * (newDiscount / 100);

    setUnitPrice(newUnitPrice);
    setDiscount(newDiscount);
    setDiscountedPrice(newDiscountedPrice);
    setSavePrice(newSavePrice);
  };

  useEffect(() => {
    calculatePrice(quantity);
  }, [quantity]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < minQuantity) {
      setMinQuantityWarning(true);
      setMaxQuantityWarning(false);
    } else if (newQuantity > maxQuantity) {
      setMaxQuantityWarning(true);
      setMinQuantityWarning(false);
    } else {
      setQuantity(newQuantity);
      calculatePrice(newQuantity);
      setMinQuantityWarning(false);
      setMaxQuantityWarning(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100">
      <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row max-w-6xl w-full">
        {/* Left Section: Product Image */}
        <div className="md:w-1/2 relative flex flex-col">
          <div className="relative w-full" style={{ paddingBottom: "100%" }}>
            <img
              src={productImage}
              alt="Product_image"
              className="absolute top-0 left-0 h-full w-full object-cover rounded-md"
            />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold">Beetroot</h2>
            <p className="text-gray-500">Rs {unitPrice}.00 Per Kg</p>
          </div>
        </div>

        {/* Right Section: Product Info */}
        <div className="md:w-1/2 mt-6 md:mt-0 md:ml-6">
          <div className="mt-4">
            <div className="text-gray-500">
              <span className="text-gray-500 pr-1 line-through">
                {" "}
                Rs {unitPrice * quantity}.00{" "}
              </span>
              <span className="text-red-600 pr-1 font-bold">
                {" "}
                - {discount}% off{" "}
              </span>
            </div>
            <div className="text-black">
              <span className="pr-1 font-bold">Rs </span>
              <span className="text-4xl font-extrabold text-black-500">
                {discountedPrice.toFixed(2)}
              </span>
              <span className="pl-1 font-bold"> LKR </span>
              <p className="text-gray-500">Rs {unitPrice}.00 Per Kg</p>
            </div>
            <div className="text-red-600 mt-1">
              <span className="pr-1">Save</span>
              <span className="font-bold pr-1">Rs {savePrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Price Chart */}
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-700">Price Chart</div>
            <PriceChart />
          </div>

          {/* Quantity Selector */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              minQuantity={minQuantity}
              maxQuantity={maxQuantity}
            />
            {maxQuantityWarning && (
              <div className="mt-4 text-sm text-red-600">
                Quantity cannot exceed {maxQuantity}.
              </div>
            )}
            {minQuantityWarning && (
              <div className="mt-4 text-sm text-red-600">
                Quantity cannot be less than {minQuantity}.
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-md font-semibold">
              Add to Cart
            </button>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md font-semibold">
              Buy it now
            </button>
          </div>

          {/* Delivery Information */}
          <div className="mt-4 text-sm text-red-600">
            Delivery charges calculated at checkout
          </div>

          {/* Share Button */}
          <div className="mt-2 text-left">
            <button className="text-gray-500 hover:text-gray-700">Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
