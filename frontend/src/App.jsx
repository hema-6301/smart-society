import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import Complaints from "./pages/Complaints";
import Visitors from "./pages/Visitors";
import Flats from "./pages/Flats";
import MyPayments from "./pages/MyPayments";
import MyComplaints from "./pages/MyComplaints";
import ResidentVisitors  from "./pages/ResidentVisitors";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    const userRole = localStorage.getItem("role");

    if (loginStatus === "true") {
      setIsLoggedIn(true);
      setRole(userRole);
    }
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        {/* Main content */}
        <main className="flex-grow">
          <Routes>

            {/* HOME */}
            <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

            {/* LOGIN */}
            <Route
              path="/login"
              element={
                isLoggedIn
                  ? <Navigate to="/" />
                  : <Login setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              }
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={
                isLoggedIn
                  ? <Navigate to="/" />
                  : <Register setIsLoggedIn={setIsLoggedIn} setRole={setRole} />
              }
            />

            {/* ADMIN ONLY */}
            <Route
              path="/dashboard"
              element={
                isLoggedIn && role === "admin"
                  ? <Dashboard />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/flats"
              element={
                isLoggedIn && role === "admin"
                  ? <Flats />
                  : <Navigate to="/" />
              }
            />

            {/* ADMIN + RESIDENT */}
            <Route
              path="/payments"
              element={
                isLoggedIn && (role === "admin" || role === "resident")
                  ? <Payments />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/complaints"
              element={
                isLoggedIn && (role === "admin" || role === "resident")
                  ? <Complaints />
                  : <Navigate to="/" />
              }
            />

            {/* SECURITY + ADMIN */}
            <Route
              path="/visitors"
              element={
                isLoggedIn && (role === "admin" || role === "security")
                  ? <Visitors />
                  : <Navigate to="/" />
              }
            />

            {/* RESIDENT ONLY */}
            <Route
              path="/mypayments"
              element={
                isLoggedIn && role === "resident"
                  ? <MyPayments />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/resident-visitors"
              element={
                isLoggedIn && role === "resident"
                  ? <ResidentVisitors />
                  : <Navigate to="/" />
              }
            />

            <Route
              path="/mycomplaints"
              element={
                isLoggedIn && role === "resident"
                  ? <MyComplaints />
                  : <Navigate to="/" />
              }
            />

          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
