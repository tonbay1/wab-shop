import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('ออกจากระบบสำเร็จ');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-white font-bold text-xl">WAB Shop</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/shop" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">ร้านค้ารถ</Link>
              <Link to="/shopid" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">ร้านค้าไอดี</Link>
              <Link to="/topup" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">เติมเงิน</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">โปรไฟล์</Link>
                  <button onClick={handleLogout} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">ออกจากระบบ</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">เข้าสู่ระบบ</Link>
                  <Link to="/register" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">สมัครสมาชิก</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 pb-3 pt-2">
          <div className="px-2 space-y-1">
            <Link to="/shop" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">ร้านค้ารถ</Link>
            <Link to="/shopid" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">ร้านค้าไอดี</Link>
            <Link to="/topup" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">เติมเงิน</Link>
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">โปรไฟล์</Link>
                <button onClick={handleLogout} className="text-gray-300 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium">ออกจากระบบ</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">เข้าสู่ระบบ</Link>
                <Link to="/register" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">สมัครสมาชิก</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
