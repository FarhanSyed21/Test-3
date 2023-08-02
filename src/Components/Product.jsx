import React from "react";
import "./Product.css";

const Product = ({ name, description, price, quantity, handleBuyClick }) => {
  return (
    <div className="product">
      <p>Name: {name}</p>
      <p>Description: {description}</p>
      <p>Price: {price}</p>
      <p>Quantity: {quantity}</p>

      <button onClick={() => handleBuyClick(1, name, description, price)}>
        Buy
      </button>
    </div>
  );
};

export default Product;
