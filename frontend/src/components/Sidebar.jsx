import { Link } from "react-router-dom";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button (always visible at top-left) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-indigo-600 text-white p-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        <Bars3Icon className="w-6 h-6" />
      </button>

      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-700 to-purple-800 text-white shadow-lg transform transition-transform duration-300 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white hover:text-yellow-300"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Logo / Title */}
        <div className="p-6 border-b border-indigo-600">
          <h2 className="text-2xl font-extrabold tracking-wide">SSMS</h2>
          <p className="text-sm opacity-80">Smart Society</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-6 space-y-4">
          <Link
            to="/home"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/users"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Users
          </Link>
          <Link
            to="/complaints"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Complaints
          </Link>
          <Link
            to="/payments"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Payments
          </Link>
          <Link
            to="/visitors"
            className="block px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            onClick={() => setIsOpen(false)}
          >
            Visitors
          </Link>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-indigo-600 text-sm opacity-70">
          © 2026 Smart Society
        </div>
      </div>
    </>
  );
}

export default Sidebar;