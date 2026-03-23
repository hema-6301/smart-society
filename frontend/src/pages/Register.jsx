import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { UserIcon, MailIcon, HomeIcon, LockClosedIcon, ShieldCheckIcon } from "@heroicons/react/outline";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("resident");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bodyData = { name, email, password, role };
      if (role === "resident") bodyData.flatNumber = flatNumber;

      const res = await fetch("https://smart-society-agm0.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server Error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-pink-100 to-pink-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 backdrop-blur-md rounded-3xl shadow-lg p-10 w-full max-w-md border border-pink-100 transition duration-300 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]"
      >
        <h2 className="text-4xl font-extrabold text-center text-pink-700 mb-6">
          Create Account
        </h2>

        {message && (
          <p className="text-center text-sm mb-4 text-pink-600 font-medium">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <UserIcon className="h-5 w-5 text-pink-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <MailIcon className="h-5 w-5 text-pink-400 absolute left-3 top-3" />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Flat Number (only for resident) */}
          {role === "resident" && (
            <div className="relative">
              <HomeIcon className="h-5 w-5 text-pink-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Flat Number"
                className="w-full pl-10 border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none transition"
                value={flatNumber}
                onChange={(e) => setFlatNumber(e.target.value)}
                required
              />
            </div>
          )}

          {/* Password */}
          <div className="relative">
            <LockClosedIcon className="h-5 w-5 text-pink-400 absolute left-3 top-3" />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Dropdown */}
          <div className="relative">
            <ShieldCheckIcon className="h-5 w-5 text-pink-400 absolute left-3 top-3" />
            <select
              className="w-full pl-10 border border-pink-200 rounded-lg p-3 focus:ring-2 focus:ring-pink-300 outline-none transition"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="resident">🏠 Resident</option>
              <option value="admin">👑 Owner</option>
              <option value="security">🛡️ Security</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-pink-400 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] transition-transform"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
