import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from '@headlessui/react';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // จะแก้ไขให้ใช้ context ภายหลัง

  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold text-white">🚗 CarX Store</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              หน้าแรก
            </Link>
            <Link to="/shop" className="text-gray-300 hover:text-white transition">
              ร้านค้ารถ
            </Link>
            <Link to="/shop/id" className="text-gray-300 hover:text-white transition">
              ร้านค้าไอดี
            </Link>
            <Link to="/topup" className="text-gray-300 hover:text-white transition">
              เติมเกม
            </Link>
            <Link to="/deposit" className="text-gray-300 hover:text-white transition">
              เติมเงิน
            </Link>
            <Link to="/claim" className="text-gray-300 hover:text-white transition">
              เคลม
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center space-x-2 text-gray-300 hover:text-white">
                  <img
                    src="/images/avatar-placeholder.jpg"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>บัญชีของฉัน</span>
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-700 text-white' : 'text-gray-300'
                        }`}
                      >
                        โปรไฟล์
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/history"
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-700 text-white' : 'text-gray-300'
                        }`}
                      >
                        ประวัติการซื้อ
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/claim"
                        className={`block px-4 py-2 text-sm ${
                          active ? 'bg-gray-700 text-white' : 'text-gray-300'
                        }`}
                      >
                        เคลมสินค้า
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          active ? 'bg-gray-700 text-white' : 'text-gray-300'
                        }`}
                      >
                        ออกจากระบบ
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Menu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
