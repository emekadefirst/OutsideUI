import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Section */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Events Section */}
          <div>
            <h3 className="text-white font-bold mb-4">Events</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Concerts
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Festivals
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Club Nights
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Terms
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us Section */}
          <div>
            <h3 className="text-white font-bold mb-4">Follow Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-white/70 hover:text-white text-sm">
                  TikTok
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
