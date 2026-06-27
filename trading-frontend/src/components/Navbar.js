import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  const [balance, setBalance] = useState(0);
  const underlineRef = useRef(null);
  const linksRef = useRef([]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Fetch live balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await API.get(`/users/${user.id}`);
        setBalance(res.data.balance || 0);
      } catch (err) {
        console.error("Balance fetch error", err);
      }
    };

    if (user?.id) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 5000); // refresh every 5s
      return () => clearInterval(interval);
    }
  }, []);

  // Sliding underline logic
  useEffect(() => {
    const activeIndex = linksRef.current.findIndex(
      (link) => link?.pathname === location.pathname
    );

    const activeLink = linksRef.current[activeIndex];

    if (activeLink && underlineRef.current) {
      underlineRef.current.style.width =
        activeLink.offsetWidth + "px";
      underlineRef.current.style.left =
        activeLink.offsetLeft + "px";
    }
  }, [location.pathname]);

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-left">
        <h2 className="logo">TradeGem</h2>
      </div>

      <div className="nav-links-wrapper">
        <div className="nav-links">
          {[
            { name: "Dashboard", path: "/dashboard" },
            { name: "Portfolio", path: "/portfolio" },
            { name: "Buy", path: "/buy" },
            { name: "Sell", path: "/sell" },
            { name: "Transactions", path: "/transactions" }
          ].map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              ref={(el) => (linksRef.current[index] = el)}
              className="nav-link"
            >
              {item.name}
            </Link>
          ))}
          <span className="underline" ref={underlineRef}></span>
        </div>
      </div>

      <div className="nav-right">
        <div className="balance-box">
          💰 ₹{balance.toFixed(2)}
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}