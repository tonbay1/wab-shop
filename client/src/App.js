import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ShopID from './pages/ShopID';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import TopUp from './pages/TopUp';
import Deposit from './pages/Deposit';
import Claim from './pages/Claim';
import ClaimHistory from './pages/ClaimHistory';
import AdminCategories from './pages/admin/Categories';
import AdminClaimManagement from './pages/admin/ClaimManagement';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Toaster position="top-right" />
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/id" element={<ShopID />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/claims" element={<AdminClaimManagement />} />
            <Route path="/topup" element={<TopUp />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/claim" element={<Claim />} />
            <Route path="/claim/history" element={<ClaimHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
