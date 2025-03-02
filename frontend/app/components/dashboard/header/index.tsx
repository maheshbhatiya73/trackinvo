'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex items-center justify-end px-8 py-4  bg-white shadow-sm relative">
      {/* Decorative curved element */}
      
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <button className="p-2 relative text-gray-600 hover:text-blue-600 transition-colors">
          <FiBell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 group"
          >
            <div className="relative cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-pulse"></div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100"
            >
              <div className="p-2">
                <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2">
                  <FiUser className="w-4 h-4" />
                  <span>Profile</span>
                </div>
                <div className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2">
                  <FiSettings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
                <hr className="my-1" />
                <div className="px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2">
                  <FiLogOut className="w-4 h-4" />
                  <span>Logout</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;