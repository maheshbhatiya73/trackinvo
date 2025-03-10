"use client"
import React, { useState } from 'react';
import { FiChevronDown, FiSave, FiMail, FiDollarSign, FiFileText } from 'react-icons/fi';

const EmailTemplateSettings = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('Invoice Sent');
  const [subject, setSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const templateVariables = [
    { name: 'Customer Name', value: '{{customer_name}}' },
    { name: 'Invoice Number', value: '{{invoice_number}}' },
    { name: 'Due Date', value: '{{due_date}}' },
    { name: 'Total Amount', value: '{{total_amount}}' },
  ];

  const templates = [
    { name: 'Invoice Sent', icon: <FiFileText /> },
    { name: 'Payment Received', icon: <FiDollarSign /> },
    { name: 'Quotation Sent', icon: <FiMail /> }
  ];

  return (
    <div className="">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FiFileText className="text-blue-600" />
              Email Template Settings
            </h1>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Type
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex justify-between items-center px-4 py-3 bg-white border border-gray-300 rounded-lg 
                         hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <div className="flex items-center gap-3">
                  {templates.find(t => t.name === selectedTemplate)?.icon}
                  <span className="text-gray-700">{selectedTemplate}</span>
                </div>
                <FiChevronDown className={`text-gray-500 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDropdownOpen && (
                <div className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 
                              origin-top transition-all duration-150">
                  {templates.map((template) => (
                    <button
                      key={template.name}
                      onClick={() => {
                        setSelectedTemplate(template.name);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 
                                ${selectedTemplate === template.name ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}
                                hover:bg-gray-50 transition-colors`}
                    >
                      {template.icon}
                      {template.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter email subject..."
            />
          </div>
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-3">
              <label className="block text-sm font-medium text-gray-700">
                Email Content
              </label>
              <div className="flex flex-wrap gap-2">
                {templateVariables.map((varItem) => (
                  <button
                    key={varItem.value}
                    onClick={() => setEmailContent(prev => prev + varItem.value)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md 
                             hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    {varItem.name}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all 
                       font-mono text-sm resize-y"
              placeholder="Write your email template..."
            />
          </div>
          <button
            className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <FiSave className="text-lg" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateSettings;