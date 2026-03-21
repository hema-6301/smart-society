import { Link, useNavigate } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // must match backend exactly ("admin", "resident", "security")

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("flatNumber"); // clear resident flat info
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50">
      
      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
        🏘️Smart Society
      </h1>

        {/* Navigation Links */}
      <div className="flex items-center gap-4 md:gap-6 font-medium">
        <Link to="/" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Home</Link>

        {/* ---------------- ADMIN MENU ---------------- */}
        {isLoggedIn && role === "admin" && (
          <>
            <Link to="/dashboard" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Dashboard</Link>
            <Link to="/flats" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Flats</Link>
            <Link to="/payments" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Payments</Link>
            <Link to="/visitors" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Visitors</Link>
            <Link to="/complaints" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Complaints</Link>
          </>
        )}

        {/* ---------------- RESIDENT MENU ---------------- */}
        {isLoggedIn && role === "resident" && (
          <>
            <Link to="/mypayments" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">My Payments</Link>
            <Link to="/mycomplaints" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">My Complaints</Link>
              <Link
    to="/resident-visitors"
    className="px-3 py-1 rounded hover:bg-purple-500/50 transition"
  >
    My Visitors
  </Link>

          </>
        )}

        {/* ---------------- SECURITY MENU ---------------- */}
        {isLoggedIn && role === "security" && (
          <Link to="/visitors" className="px-3 py-1 rounded hover:bg-purple-500/50 transition">Visitor Entry</Link>
        )}

        {/* ---------------- LOGIN / LOGOUT ---------------- */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-white text-purple-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="border border-white px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
