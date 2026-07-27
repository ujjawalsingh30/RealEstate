import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';

// Auth
import Login from './auth/Login';
import Register from './auth/Register';
import ResetPassword from './auth/ResetPassword';
import Profile from './auth/Profile';

// Buyer
import ContactUs from './buyer/ContactUs';
import Messages from './buyer/Messages';
import Wishlist from './buyer/Wishlist';

// Seller
import AddProperty from './seller/AddProperty';
import MyListings from './seller/MyListings';
import SellerDashboard from './seller/SellerDashboard';

// Admin
import AdminDashboard from './admin/AdminDashboard';
import UsersManager from './admin/UsersManager';
import SellerRequests from './admin/SellerRequests';
import MessageInbox from './admin/MessageInbox';

// Public Layout Wrapper with standard Navbar
const PublicLayout = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-[#0b131e] flex flex-col transition-colors duration-300">
    <Navbar />
    <div className="pt-20 md:pt-24 flex-1">
      <Outlet />
    </div>
  </div>
);

// Auth-Aware Layout Wrapper for shared routes (viewable without login OR with login)
const AuthAwareLayout = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'seller') return <SellerLayout />;
  if (role === 'buyer') return <BuyerLayout />;
  return <PublicLayout />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public-Only & Common Routes with Public Navbar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Universal & Shared Routes (Accessible Publicly without login OR inside Buyer/Seller header if logged in) */}
        <Route element={<AuthAwareLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/property-details" element={<PropertyDetails />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>

        {/* Buyer Account Layout Routes */}
        <Route element={<BuyerLayout />}>
          <Route path="/buyer/home" element={<Home />} />
          <Route path="/buyer/profile" element={<Profile />} />
        </Route>

        {/* Seller Account Layout Routes */}
        <Route element={<SellerLayout />}>
          <Route path="/seller/home" element={<Home />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-property" element={<AddProperty />} />
          <Route path="/seller/my-listings" element={<MyListings />} />
          <Route path="/seller/profile" element={<Profile />} />
          <Route path="/seller/support" element={<ContactUs />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManager />} />
          <Route path="/admin/seller-requests" element={<SellerRequests />} />
          <Route path="/admin/properties" element={<Properties />} />
          <Route path="/admin/message-inbox" element={<MessageInbox />} />
          <Route path="/admin/message inbox" element={<MessageInbox />} />
          <Route path="/admin/messages" element={<MessageInbox />} />
          <Route path="/admin/inquiries" element={<MessageInbox />} />
          <Route path="/admin/contact-inbox" element={<MessageInbox />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
