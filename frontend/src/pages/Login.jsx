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
        { email, password }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-100 to-indigo-200 px-4">
      <motion.form
        onSubmit={handleLogin}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-8 w-full max-w-md border border-indigo-100 transition duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.3)]"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Smart Society Login
        </h2>

        {error && (
          <p className="bg-red-50 text-red-600 text-center mb-4 font-medium rounded-lg py-2">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-50 text-green-600 text-center mb-4 font-medium rounded-lg py-2">
            {success}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-indigo-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 rounded-lg p-3 mb-4 outline-none transition"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-indigo-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 rounded-lg p-3 mb-4 outline-none transition"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold shadow-md hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-transform"
        >
          Login
        </button>

        <div className="text-center mt-6 space-y-2">
          <p className="text-slate-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
          <p>
            <Link
              to="/forgot-password"
              className="text-sm text-purple-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
      </motion.form>
    </div>
  );
}

export default Login;
