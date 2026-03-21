import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 text-gray-900 py-16 overflow-hidden">
      
      {/* Decorative Glow Circles */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl -translate-x-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-pink-500/30 rounded-full blur-2xl animate-pulse-slower"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left z-10">
        
        {/* Brand */}
        <div className="space-y-4 backdrop-blur-md bg-white/40 p-6 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-extrabold text-black tracking-wide">
            Smart Society
          </h2>
          <p className="text-black/80 text-sm leading-relaxed">
            Simplifying apartment & community management for residents and owners.
          </p>
          <p className="text-black/60 text-xs mt-2">
            © 2026 Smart Society. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4 backdrop-blur-md bg-white/40 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-black">Quick Links</h3>
          <ul className="space-y-2 text-black/80">
            {["Home","Dashboard","Complaints","Visitors"].map((link) => (
              <li key={link}>
                <a 
                  href={`/${link.toLowerCase()}`} 
                  className="group relative inline-block hover:text-black transition-colors"
                >
                  {link}
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Links */}
        <div className="space-y-4 backdrop-blur-md bg-white/40 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-black">Follow Us</h3>
          <div className="flex justify-center md:justify-start gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <button
                key={i}
                aria-label={`Follow on ${Icon.name}`}
                className="p-3 rounded-full bg-white/50 backdrop-blur-md shadow-md hover:bg-white hover:scale-110 hover:shadow-lg transition-transform focus:outline-none focus:ring-2 focus:ring-black"
              >
                <Icon className="w-6 h-6 text-black" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-14 border-t border-black/20 pt-6 text-center text-black/70 text-xs z-10 relative">
        Designed with ❤️ using React & Tailwind CSS | Developed by YourName
      </div>
    </footer>
  );
};

export default Footer;
