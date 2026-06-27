import { useEffect, useState } from "react";
import api from "../api/api";

export default function Stocks() {
  const [stocks,setStocks]=useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    api.get("/stocks/all").then(res=>setStocks(res.data));
  },[]);

  const buy = async (symbol, qty) => {
    await api.post("/transactions/buy",{
      userId,
      symbol,
      quantity: qty
    });
    alert("Stock Purchased");
  };

  return (
    <div>
      <h2>Stocks</h2>
      {stocks.map(stock=>(
        <div key={stock.id}>
          {stock.symbol} - ₹{stock.price}
          <input id={stock.symbol} placeholder="Qty" />
          <button onClick={() =>
            buy(stock.symbol, document.getElementById(stock.symbol).value)
          }>
            Buy
          </button>
        </div>
      ))}
    </div>
  );
}
