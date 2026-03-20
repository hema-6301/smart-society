import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status from localStorage
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    if (loginStatus === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      
      {/* Hero Section */}
      <div
        className="h-[80vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent"></div>

        <div className="relative text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Smart Society
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-6">
            A Modern Way to Manage Apartments & Communities
          </p>

          {/* Show only if NOT logged in */}
          {!isLoggedIn && (
            <button
              onClick={handleGetStarted}
              className="backdrop-blur-md bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition"
            >
              Get Started
            </button>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 px-6 bg-white dark:bg-gray-800 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">
          Smart Society Management System
        </h2>

        <p className="max-w-4xl mx-auto text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
          Manage complaints, visitor entries, maintenance payments,
          and apartment records easily with our digital platform.
          Designed to simplify community living and improve transparency.
        </p>
      </div>

      {/* Features Section */}
      <div className="py-20 px-6 bg-indigo-100 dark:bg-gray-900 text-center">
        <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400 mb-12">
          Our Features
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          
          {/* Complaint */}
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-indigo-500/50 transition">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600 dark:text-indigo-400">
              Complaint Management
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              Residents can raise and track complaints easily.
            </p>
          </div>

          {/* Visitors */}
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-green-500/50 transition">
            <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
              Visitor Logging
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              Secure visitor tracking for better safety.
            </p>
          </div>

          {/* Payments */}
          <div className="bg-white/30 dark:bg-white/10 backdrop-blur-md shadow-xl rounded-2xl p-8 hover:scale-105 hover:shadow-purple-500/50 transition">
            <h3 className="text-xl font-semibold mb-4 text-purple-600 dark:text-purple-400">
              Maintenance Payments
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              Easy monthly payment management system.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;