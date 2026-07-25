import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ChevronUp, Layers } from 'lucide-react';
import logo from '../assets/logo.png';

// Reliable Inline SVG Social Icons to prevent external icon module import errors
const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white pt-14 md:pt-20 pb-12 px-6 md:px-12 border-t border-gray-100 relative overflow-hidden w-full">
      <div className="max-w-[1400px] mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-12 pb-14 border-b border-gray-200/80">
          
          {/* Column 1: Brand & Bio - Centered on mobile, left-aligned on desktop */}
          <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-4 md:space-y-5">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src={logo} alt="RealEstate Logo" className="w-10 h-10 object-contain" />
              <span className="text-[#047262] font-extrabold text-2xl tracking-tight">RealEstate</span>
            </Link>
            <p className="text-gray-700 text-sm leading-relaxed max-w-sm font-normal">
              The most trusted platform for buying, selling, and renting
              premium real estate globally. We make property hunting seamless.
            </p>
            {/* Minimalist Social Icons matching phone view */}
            <div className="flex items-center gap-8 md:gap-6 pt-3 pb-2">
              <a href="#" aria-label="Facebook" className="text-gray-900 hover:text-[#047262] transition-colors transform hover:scale-110 duration-200">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-900 hover:text-[#047262] transition-colors transform hover:scale-110 duration-200">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-900 hover:text-[#047262] transition-colors transform hover:scale-110 duration-200">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-900 hover:text-[#047262] transition-colors transform hover:scale-110 duration-200">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Company */}
          <div className="flex flex-col items-start text-left space-y-3.5 lg:ml-auto pt-2 md:pt-0">
            <h4 className="text-[#1a2b3c] font-black text-lg mb-2">Company</h4>
            <Link to="/" className="text-gray-700 hover:text-[#047262] text-sm font-normal transition-colors py-0.5">
              Home
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-[#047262] text-sm font-normal transition-colors py-0.5">
              Property
            </Link>
            <Link to="/wishlist" className="text-gray-700 hover:text-[#047262] text-sm font-normal transition-colors py-0.5">
              Wishlist
            </Link>
            <Link to="/contact-us" className="text-gray-700 hover:text-[#047262] text-sm font-normal transition-colors py-0.5">
              Contact
            </Link>
          </div>

          {/* Column 3: Support */}
          <div className="flex flex-col items-start text-left space-y-4 pt-2 md:pt-0">
            <h4 className="text-[#1a2b3c] font-black text-lg mb-2">Support</h4>
            <div className="flex items-center gap-3.5 text-sm text-gray-700 font-normal">
              <Mail className="text-[#047262] flex-shrink-0" size={19} />
              <span className="break-all">contact@realestate.com</span>
            </div>
            <div className="flex items-center gap-3.5 text-sm text-gray-700 font-normal">
              <Phone className="text-[#047262] flex-shrink-0" size={19} />
              <span>+91 1234567890</span>
            </div>
            <div className="flex items-start gap-3.5 text-sm text-gray-700 font-normal">
              <MapPin className="text-[#047262] flex-shrink-0 mt-0.5" size={19} />
              <span>123 Business Hub, India</span>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="flex flex-col items-start text-left space-y-3.5 w-full pt-2 md:pt-0">
            <h4 className="text-[#1a2b3c] font-black text-lg mb-1">Newsletter</h4>
            <p className="text-gray-700 text-sm leading-relaxed max-w-sm font-normal">
              Subscribe to get the latest listings and market insights directly in your inbox.
            </p>
            {/* Input pill */}
            <div className="bg-white border border-gray-200 rounded-full p-1.5 shadow-sm flex items-center justify-between focus-within:border-[#047262] transition-colors mt-2 w-full max-w-md">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-1.5 text-sm text-gray-700 outline-none bg-transparent w-full min-w-0" 
              />
              <button className="bg-[#047262] hover:bg-[#03594d] text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-colors whitespace-nowrap shadow-sm flex-shrink-0">
                Join
              </button>
            </div>
            <span className="text-[11px] text-gray-400 font-normal">
              🔒 We respect your privacy. No spam ever.
            </span>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500 font-medium text-center md:text-left">
          <p>© 2026 RealEstate. All rights reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs md:text-sm">
            <a href="#" className="hover:text-[#047262] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#047262] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#047262] transition-colors">Cookies Settings</a>
          </div>
        </div>

        {/* Design Credit Footer Note */}
        <div className="pt-8 pb-4 flex items-center justify-center gap-2 text-xs text-gray-600 font-medium">
          <Layers size={14} className="text-[#047262]" />
          <span>Designed by</span>
          <span className="text-[#047262] font-bold">Hexagon Digital Services</span>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScroll && (
        <button 
          onClick={scrollTop} 
          className="fixed right-5 bottom-5 md:right-10 md:bottom-10 bg-[#047262] hover:bg-[#03594d] text-white p-3.5 rounded-full shadow-2xl z-50 transition-all transform hover:-translate-y-1 focus:outline-none border-2 border-white"
          aria-label="Scroll to top"
        >
          <ChevronUp size={24} strokeWidth={3} />
        </button>
      )}
    </footer>
  );
};

export default Footer;
