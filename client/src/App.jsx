import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'

// Auth
import Login from './auth/Login'
import Register from './auth/Register'
import ResetPassword from './auth/ResetPassword'

// Buyer
import ContactUs from './buyer/ContactUs'
import Messages from './buyer/Messages'
import Property from './buyer/Property'
import Wishlist from './buyer/Wishlist'

// Seller
import AddProperty from './seller/AddProperty'
import MyListings from './seller/MyListings'
import SellerDashboard from './seller/SellerDashboard'

// Admin
import AdminDashboard from './admin/AdminDashboard'
import UsersManager from './admin/UsersManager'

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 px-8">
          <Routes>
            {/* Public / Common Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Buyer Routes */}
            <Route path="/properties" element={<Property />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/contact-us" element={<ContactUs />} />

            {/* Seller Routes */}
            <Route path="/seller/dashboard" element={<SellerDashboard />} />
            <Route path="/seller/add-property" element={<AddProperty />} />
            <Route path="/seller/my-listings" element={<MyListings />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManager />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
