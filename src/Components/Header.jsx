import React, { useEffect, useState } from "react";
import Product from "./Product";
import Cart from "./Cart";
import "./Header.css";
import { addProductToDatabase, listenForProductChanges } from "../Firebase";

const Header = () => {
  const [itemName, setItemName] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemQuantity, setItemQuantity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [productList, setProductList] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    listenForProductChanges(setProductList);
  }, []);

  const nameHandler = (e) => {
    setItemName(e.target.value);
  };
  const descHandler = (e) => {
    setItemDesc(e.target.value);
  };
  const priceHandler = (e) => {
    setItemPrice(e.target.value);
  };
  const quantityHandler = (e) => {
    setItemQuantity(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const newProduct = {
      name: itemName,
      description: itemDesc,
      price: itemPrice,
      quantity: itemQuantity
    };
    addProductToDatabase(newProduct);

    setProductList([...productList, newProduct]);

    setItemName("");
    setItemDesc("");
    setItemPrice("");
    setItemQuantity("");
  };

  const handleBuyClick = (quantityToBuy, name, description, price) => {
    const existingItemIndex = cartItems.findIndex((item) => item.name === name);

    if (existingItemIndex !== -1) {
      const updatedCartItems = [...cartItems];
      const existingQuantity = updatedCartItems[existingItemIndex].quantity;
      const newQuantity = existingQuantity + quantityToBuy;

      if (newQuantity >= 0) {
        updatedCartItems[existingItemIndex].quantity = newQuantity;
        updatedCartItems[existingItemIndex].price = price * newQuantity;
        setCartItems(updatedCartItems);
      }
    } else {
      const newItem = {
        name: name,
        description: description,
        price: price * quantityToBuy,
        quantity: quantityToBuy
      };
      setCartItems([...cartItems, newItem]);
    }

    const updatedProductList = productList.map((product) => {
      if (product.name === name) {
        return {
          ...product,
          quantity: product.quantity - quantityToBuy
        };
      }
      return product;
    });

    setProductList(updatedProductList);
  };

  const searchHandler = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = productList.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="header">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="name"
            value={itemName}
            onChange={nameHandler}
          />
          <label htmlFor="desc">Description: </label>
          <input
            type="text"
            className="description"
            value={itemDesc}
            onChange={descHandler}
          />
          <label htmlFor="price">Price: </label>
          <input
            type="number"
            className="price"
            value={itemPrice}
            onChange={priceHandler}
          />
          <label htmlFor="quantity">Quantity: </label>
          <input
            type="number"
            className="quantity"
            value={itemQuantity}
            onChange={quantityHandler}
          />
          <button type="submit">Add</button>
        </div>
      </form>
      <div className="list">
        <label htmlFor="find">Find</label>
        <input type="text" onChange={searchHandler} />
        <ul>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <Product
                key={index}
                name={product.name}
                description={product.description}
                price={product.price}
                quantity={product.quantity}
                handleBuyClick={handleBuyClick}
              />
            ))
          ) : (
            <p>Out of Stock</p>
          )}
        </ul>
      </div>
      <div className="cart">
        <Cart cartItems={cartItems} />
      </div>
    </div>
  );
};

export default Header;
