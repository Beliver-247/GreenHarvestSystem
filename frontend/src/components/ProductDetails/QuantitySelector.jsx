import React from "react";
import "./QuantitySelector.css";
const QuantitySelector = ({
  quantity,
  onQuantityChange,
  minQuantity,
  maxQuantity,
}) => {
  const updateQuantity = (amount) => {
    const newQuantity = quantity + amount;
    onQuantityChange(newQuantity);
  };

  return (
    <div className="quantity-input-container mt-2 flex items-center">
      <button
        onClick={() => updateQuantity(-10)}
        className="quantity-button"
        disabled={quantity <= minQuantity - 1}
      >
        -
      </button>
      <input
        id="quantity-input"
        type="number"
        value={quantity}
        min={minQuantity}
        max={maxQuantity}
        className="quantity-input mx-2 w-16 text-center"
        readOnly
      />
      <div className="quantity-unit">Kg</div>
      <button
        onClick={() => updateQuantity(10)}
        className="quantity-button"
        disabled={quantity >= maxQuantity + 1}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
