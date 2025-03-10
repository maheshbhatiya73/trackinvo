"use client";

import React, { useState } from "react";
import { ChromePicker } from "react-color";

export default function SettingsPage() {
  const [themeColor, setThemeColor] = useState("#6366f1");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState("/applogo.png");
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(10);
  const [defaultNotes, setDefaultNotes] = useState("Payment due within 30 days.");

  const transactions = [
    { _id: "1", description: "Jemima Bender", quantity: 2, unit_price: 663, total_amount: 1326, date: "2025-03-08" },
    { _id: "2", description: "Premium Service Plan", quantity: 1, unit_price: 1500, total_amount: 1500, date: "2025-03-09" },
    { _id: "3", description: "Consulting Fee", quantity: 3, unit_price: 200, total_amount: 600, date: "2025-03-10" },
  ];

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const settings = { themeColor, currency, logo, taxEnabled, taxRate, defaultNotes, transactions };
    console.log("Settings saved:", settings);
    alert("Settings saved successfully!");
  };

  return (
    <div className="">
      <div className=" mx-auto bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-gradient">
          Settings Dashboard
        </h1>

        {/* Horizontal Grid for Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Theme Color Card */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Theme Color</h2>
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-14 h-14 rounded-full border-2 border-gray-200 shadow-sm hover:scale-105 transition-transform"
                style={{ backgroundColor: themeColor }}
              />
              {showColorPicker && (
                <div className="absolute z-20 mt-2 left-0">
                  <ChromePicker
                    color={themeColor}
                    onChange={(color) => setThemeColor(color.hex)}
                  />
                  <button
                    onClick={() => setShowColorPicker(false)}
                    className="mt-2 w-full py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Currency Card */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Currency</h2>
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span>{currency}</span>
                <svg
                  className={`w-4 h-4 transform transition-transform ${showCurrencyDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCurrencyDropdown && (
                <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {["USD", "EUR", "INR", "GBP"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => {
                        setCurrency(curr);
                        setShowCurrencyDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      {curr} - {curr === "USD" ? "Dollar ($)" : curr === "EUR" ? "Euro (€)" : curr === "INR" ? "Rupee (₹)" : "Pound (£)"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Logo Card */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Logo</h2>
            <div className="flex items-center gap-4">
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="w-16 h-16 object-contain rounded-lg border border-gray-200"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="text-sm text-gray-600 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-colors"
              />
            </div>
          </div>

          {/* Tax Settings Card */}
          <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Enable Taxes</label>
                <input
                  type="checkbox"
                  checked={taxEnabled}
                  onChange={() => setTaxEnabled(!taxEnabled)}
                  className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              {taxEnabled && (
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min="0"
                    step="0.1"
                    className="w-20 p-2 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Default Notes Card */}
        
        </div>
        <div className="p-6 mt-2 w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100 md:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Default Notes</h2>
            <textarea
              value={defaultNotes}
              onChange={(e) => setDefaultNotes(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

        {/* Transactions Grid */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Transactions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="group p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all border border-gray-100 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {transaction.description}
                </h3>
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600">Qty: <span className="font-medium">{transaction.quantity}</span></p>
                  <p className="text-sm text-gray-600">Unit: <span className="font-medium">${transaction.unit_price.toFixed(2)}</span></p>
                  <p className="text-lg font-bold text-indigo-600">Total: ${transaction.total_amount.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">{transaction.date}</p>
                <button className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-indigo-600 hover:text-indigo-800 transition-opacity">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-pink-600 transform hover:scale-105 transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Tailwind Animation for Gradient Text */}
      <style jsx>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 5s ease infinite;
        }
      `}</style>
    </div>
  );
}