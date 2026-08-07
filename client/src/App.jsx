import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import BuyerLayout from './layouts/BuyerLayout';
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
import SellerMessages from './seller/messages';

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

// Auth-Aware Layout Wrapper for shared routes
const AuthAwareLayout = () => {
  const role = localStorage.getItem('userRole');
  if (role === 'seller') return <SellerLayout />;
  if (role === 'buyer') return <BuyerLayout />;
  if (role === 'admin' || role === 'superadmin') return <AdminLayout />;
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

        {/* Universal & Shared Public Routes (Accessible with or without login) */}
        <Route element={<AuthAwareLayout />}>
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetails />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/property-details" element={<PropertyDetails />} />
          <Route path="/property-details/:id" element={<PropertyDetails />} />
        </Route>

        {/* Protected Universal Private Routes (Requires Login as any role) */}
        <Route element={<ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}><AuthAwareLayout /></ProtectedRoute>}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Protected Buyer Account Layout Routes (Only accessible by Buyers) */}
        <Route element={<ProtectedRoute allowedRole="buyer"><BuyerLayout /></ProtectedRoute>}>
          <Route path="/buyer/home" element={<Home />} />
          <Route path="/buyer/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/buyer/messages" element={<Messages />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/buyer/wishlist" element={<Wishlist />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/buyer/contact-us" element={<ContactUs />} />
        </Route>

        {/* Protected Seller Account Layout Routes */}
        <Route element={<ProtectedRoute allowedRole="seller"><SellerLayout /></ProtectedRoute>}>
          <Route path="/seller/home" element={<Home />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/add-property" element={<AddProperty />} />
          <Route path="/seller/my-listings" element={<MyListings />} />
          <Route path="/seller/profile" element={<Profile />} />
          <Route path="/seller/support" element={<ContactUs />} />
          <Route path="/seller/messages" element={<SellerMessages />} />
        </Route>

        {/* Protected Admin Account Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']}><AdminLayout /></ProtectedRoute>}>
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
