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
  const res = await axios.post("https://smart-society-agm0.onrender.com/api/auth/login", {  
    email,  
    password,  
  });  

  if (res.data && res.data.token) {  
    localStorage.setItem("isLoggedIn", "true");  
    localStorage.setItem("token", res.data.token);  
    localStorage.setItem("role", res.data.role);  

    setIsLoggedIn(true);  
    setRole(res.data.role);  

    setSuccess("Login Successful!");  

    // Delay navigation so message shows  
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
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 px-4">
<motion.form
className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-200"
onSubmit={handleLogin}
initial={{ opacity: 0, y: 40 }}
animate={{ opacity: 1, y: 0 }}
>
<h2 className="text-3xl font-extrabold text-center text-emerald-700 mb-6">
Smart Society Login
</h2>

{error && <p className="text-red-600 text-center mb-4">{error}</p>}  
    {success && <p className="text-green-600 text-center mb-4">{success}</p>}  

    <input  
      type="email"  
      placeholder="Email"  
      className="w-full border rounded-lg p-3 mb-4"  
      onChange={(e) => setEmail(e.target.value)}  
      required  
    />  

    <input  
      type="password"  
      placeholder="Password"  
      className="w-full border rounded-lg p-3 mb-4"  
      onChange={(e) => setPassword(e.target.value)}  
      required  
    />  

    <button  
      type="submit"  
      className="w-full bg-gradient-to-r from-emerald-600 to-green-500 text-white py-3 rounded-lg"  
    >  
      Login  
    </button>  

    <div className="text-center mt-6">  
      <p>  
        Don’t have an account?{" "}  
        <Link to="/register" className="text-emerald-600 font-semibold">  
          Register  
        </Link>  
      </p>  
    </div>  
  </motion.form>  
</div>

);
}

export default Login;
