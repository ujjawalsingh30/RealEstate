import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';

// Pages
import Home from './pages/Home';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';
import ResetPassword from './auth/ResetPassword';

// Buyer
import ContactUs from './buyer/ContactUs';
import Messages from './buyer/Messages';
import Property from './buyer/Property';
import Wishlist from './buyer/Wishlist';

// Seller
import AddProperty from './seller/AddProperty';
import MyListings from './seller/MyListings';
import SellerDashboard from './seller/SellerDashboard';

// Admin
import AdminDashboard from './admin/AdminDashboard';
import UsersManager from './admin/UsersManager';

// Public Layout Wrapper with standard Navbar
const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <div className="pt-20 md:pt-24 flex-1">
      <Outlet />
    </div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Common Routes with Public Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Buyer Account Layout Routes */}
        <Route element={<BuyerLayout />}>
          <Route path="/buyer/home" element={<Home />} />
          <Route path="/properties" element={<Property />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>

        {/* Seller Account Layout Routes */}
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-property" element={<AddProperty />} />
          <Route path="/seller/my-listings" element={<MyListings />} />
          <Route path="/seller/leads" element={<SellerDashboard />} />
          <Route path="/seller/messages" element={<Messages />} />
          <Route path="/seller/profile" element={<SellerDashboard />} />
          <Route path="/seller/support" element={<ContactUs />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
