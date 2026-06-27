import React, { useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";

export default function Trade() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  const buy = async () => {
    await api.post("/transactions/buy", {
      userId: user.id,
      symbol,
      quantity,
    });
    alert("Bought successfully");
  };

  const sell = async () => {
    await api.post("/transactions/sell", {
      userId: user.id,
      symbol,
      quantity,
      sellingPrice: price,
    });
    alert("Sold successfully");
  };

  return (
    <div>
      <Navbar />
      <h2>Trade</h2>
      <input placeholder="Symbol" onChange={e => setSymbol(e.target.value)} />
      <input type="number" placeholder="Quantity" onChange={e => setQuantity(e.target.value)} />
      <input type="number" placeholder="Selling Price" onChange={e => setPrice(e.target.value)} />

      <button onClick={buy}>Buy</button>
      <button onClick={sell}>Sell</button>
    </div>
  );
}
