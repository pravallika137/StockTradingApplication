import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Register() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", data);
    alert("Registered Successfully");
    navigate("/");
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={register}>
        <input placeholder="Name" onChange={(e)=>setData({...data,name:e.target.value})} /><br />
        <input placeholder="Email" onChange={(e)=>setData({...data,email:e.target.value})} /><br />
        <input type="password" placeholder="Password"
          onChange={(e)=>setData({...data,password:e.target.value})} /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}