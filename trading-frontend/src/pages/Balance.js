import { useState } from "react";
import api from "../api/api";

export default function Balance() {
  const [amount,setAmount]=useState("");
  const userId = localStorage.getItem("userId");

  const addBalance = async () => {
    await api.put(`/users/${userId}/balance?amount=${amount}`);
    alert("Balance Updated");
  };

  return (
    <div>
      <h2>Add Balance</h2>
      <input placeholder="Amount"
             onChange={e=>setAmount(e.target.value)} />
      <br /><br />
      <button onClick={addBalance}>Add</button>
    </div>
  );
}
