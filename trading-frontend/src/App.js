import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Transactions from "./pages/Transactions";

// 🔐 Private Route
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" />;
}

// 🎬 Animated Wrapper
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />

        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Dashboard />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Portfolio />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/buy"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Buy />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/sell"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Sell />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Transactions />
              </PageWrapper>
            </PrivateRoute>
          }
        />

        {/* Catch invalid routes */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </AnimatePresence>
  );
}

// 🎨 Page Animation Component
function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;