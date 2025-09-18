import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const NavLinks = [
    { name: "DISCOVER", href: "/tickets" },
    { name: "ABOUT", href: "/about" },
    { name: "HOSTS", href: "/hosts" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-white text-3xl font-extrabold tracking-tighter select-none">
            OUTSIDE
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NavLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white/70 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
            <a href="/auth">
              <button
                className="bg-white text-black px-6 py-2 rounded-full text-sm font-semibold 
                           hover:scale-105 hover:bg-gray-100 transition-all duration-300"
              >
                Join Beta
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/85 z-50 md:hidden flex flex-col items-center justify-center 
                    transition-opacity duration-300 ${
                      mobileMenuOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-modal="true"
        role="dialog"
      >
        <div className="absolute top-6 right-6">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Close Mobile Menu"
          >
            <X size={32} />
          </button>
        </div>

        <div className="flex flex-col space-y-8 text-center">
          {NavLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={toggleMobileMenu}
              className="text-white text-2xl font-medium hover:text-gray-300 transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a href="/auth" onClick={toggleMobileMenu}>
            <button
              className="w-full bg-white text-black px-6 py-3 rounded-full text-lg font-semibold 
                               hover:bg-gray-100 transition-colors"
            >
              Join Beta
            </button>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
