import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

function Login({ setIsLoggedIn, setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "https://smart-society-agm0.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      if (res.data && res.data.token) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        setIsLoggedIn(true);
        setRole(res.data.role);

        setSuccess("Login Successful!");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-slate-200"
      >
        <h2 className="text-3xl font-bold text-center text-slate-700 mb-6">
          Smart Society Login
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-600 text-center mb-4 font-medium">
            {success}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 mb-4 outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg p-3 mb-4 outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 transition text-white py-3 rounded-lg font-semibold shadow-md"
        >
          Login
        </button>

        <div className="text-center mt-6">
          <p className="text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
