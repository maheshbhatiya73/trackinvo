"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiBell, FiUser, FiSettings, FiLogOut, FiSearch, FiGlobe } from "react-icons/fi";
import { useRouter } from "next/navigation";

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLang, setSelectedLang] = useState("EN");
  const router = useRouter();
  const profileDropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: { target: any; }) {
      if (
        (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) &&
        (langDropdownRef.current && !langDropdownRef.current.contains(event.target))
      ) {
        setIsProfileOpen(false);
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Language options
  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Spanish" },
    { code: "FR", name: "French" },
    { code: "DE", name: "German" },
  ];

  // Handle search submission
  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here (e.g., redirect or filter)
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md relative z-10">
      <div className="flex-1 max-w-lg mx-6">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-sm transition-all"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 rounded-full"
          >
            <FiSearch className="w-4 h-4" />
          </motion.button>
        </form>
      </div>

      {/* Right Section: Icons and Dropdowns */}
      <div className="flex items-center space-x-6">
        {/* Notification Icon */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="p-2 relative text-gray-600 hover:text-blue-600 transition-colors"
        >
          <FiBell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
        </motion.button>

        {/* Language Selector */}
        <div className="relative" ref={langDropdownRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FiGlobe className="w-6 h-6" />
            <span className="text-sm font-medium">{selectedLang}</span>
          </motion.button>

          {isLangOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100"
            >
              <div className="p-2">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setIsLangOpen(false);
                      // Add language change logic here
                    }}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md cursor-pointer flex items-center space-x-2"
                  >
                    <span>{lang.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 group"
          >
            <div className="relative cursor-pointer w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
              <FiUser className="w-5 h-5 text-white" />
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-pulse"></div>
            </div>
          </motion.button>

          {isProfileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100"
            >
              <div className="p-2">
                <div
                  onClick={() => {
                    router.push("/dashboard/profile");
                    setIsProfileOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2"
                >
                  <FiUser className="w-4 h-4" />
                  <span>Profile</span>
                </div>
                <div
                  onClick={() => {
                    router.push("/dashboard/settings");
                    setIsProfileOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2"
                >
                  <FiSettings className="w-4 h-4" />
                  <span>Settings</span>
                </div>
                <hr className="my-1" />
                <div
                  onClick={() => {
                    // Add logout logic here
                    setIsProfileOpen(false);
                  }}
                  className="px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2"
                >
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