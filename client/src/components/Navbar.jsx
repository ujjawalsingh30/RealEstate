import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 md:px-10 py-4 md:py-6 bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between max-w-[1500px] mx-auto relative">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer z-10">
            <img src={logo} alt="RealEstate Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            <span className="text-[#047262] font-bold text-xl md:text-2xl tracking-tight">RealEstate</span>
          </Link>

          {/* Desktop Navigation Links (Centered Pill Container) */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-gray-100/80 backdrop-blur-md px-8 py-3 rounded-full items-center gap-8 shadow-sm z-10">
            <Link 
              to="/" 
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              to="/login" 
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="text-[#1a2b3c] font-medium text-[15px] hover:text-[#047262] transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Hamburger Icon & Desktop spacer balance */}
          <div className="flex items-center z-10">
            <button 
              onClick={() => setIsOpen(true)} 
              className="md:hidden text-[#1a2b3c] focus:outline-none"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Mobile Side Drawer (Left aligned) */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <img src={logo} alt="RealEstate Logo" className="w-8 h-8 object-contain" />
            <span className="text-[#047262] font-bold text-xl tracking-tight">RealEstate</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-800 focus:outline-none transition-colors">
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex flex-col p-6 gap-6">
          <Link 
            to="/properties" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] font-semibold text-lg hover:text-[#047262] transition-colors flex items-center gap-2"
          >
            Browse Properties
          </Link>
          <Link 
            to="/login" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] font-semibold text-lg hover:text-[#047262] transition-colors flex items-center gap-2"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            onClick={() => setIsOpen(false)}
            className="text-[#1a2b3c] font-semibold text-lg hover:text-[#047262] transition-colors flex items-center gap-2"
          >
            Register
          </Link>
        </div>
      </div>
    </>
  )
}

export default Navbar
