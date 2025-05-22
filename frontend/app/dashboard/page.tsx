"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "../components/common/Button";
import { FiPlus, FiDownload, FiEdit, FiEye, FiTrendingUp, FiUsers, FiDollarSign, FiBox, FiClipboard } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { api } from "../lib/api";

const COLORS = ["#4CAF50", "#FFA726", "#EF5350"];

function DashboardPage() {
  const [managers, setManagers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const managersRes = await api.getManagers()
        const invoicesRes = await api.getAllInvoices()
        const quotationsRes = await api.GetQuotations()
        const usersRes = await api.getUsers()
        const productsRes = await api.getProducts()
        const customersRes = await api.getCustomers()

        setManagers(managersRes.managers || []);
        setInvoices(invoicesRes.data || []);
        setQuotations(quotationsRes.data || []);
        setUsers(usersRes.users || []);
        setProducts(productsRes.data || []);
        setCustomers(customersRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dynamic Data for Charts
  const invoiceTrendsData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1500 },
    { month: "Mar", revenue: invoices.reduce((sum, inv:any) => sum + inv.total_amount, 0) },
  ];

  const getStatusBadge = (dueDate:any) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return "Overdue";
    return due.toDateString() === today.toDateString() ? "Pending" : "Paid";
  };

  const invoiceStatusData = [
    {
      name: "Paid",
      value: invoices.filter((inv:any) => getStatusBadge(inv.due_date) === "Paid").length,
    },
    {
      name: "Pending",
      value: invoices.filter((inv:any) => getStatusBadge(inv.due_date) === "Pending").length,
    },
    {
      name: "Overdue",
      value: invoices.filter((inv:any) => getStatusBadge(inv.due_date) === "Overdue").length,
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <div className="flex space-x-4">
            <Button className="flex items-center space-x-2 bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
              <FiPlus className="w-5 h-5" />
              <span>New Invoice</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all">
              <FiDownload className="w-5 h-5" />
              <span>Export Data</span>
            </Button>
          </div>
        </motion.div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Total Users", value: users.length, icon: <FiUsers />, color: "bg-blue-500" },
            { title: "Total Revenue", value: `$${invoices.reduce((sum, inv:any) => sum + inv.total_amount, 0).toLocaleString()}`, icon: <FiDollarSign />, color: "bg-green-500" },
            { title: "Total Products", value: products.length, icon: <FiBox />, color: "bg-purple-500" },
            { title: "Total Invoices", value: invoices.length, icon: <FiClipboard />, color: "bg-orange-500" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className={`${stat.color} text-white rounded-xl p-6 shadow-lg flex items-center space-x-4`}
            >
              <div className="text-3xl">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Revenue Trends
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={invoiceTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                />
                <Bar dataKey="revenue" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invoice Status</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={invoiceStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {invoiceStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Recent Invoices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Invoices</h2>
            <Button size="small" className="text-indigo-600 hover:text-indigo-800">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invoices.slice(0, 3).map((invoice:any, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="group p-5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-indigo-50 hover:border-indigo-400 transition-all relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="small" className="p-1 text-gray-600 hover:text-indigo-600">
                    <FiEdit className="w-4 h-4" />
                  </Button>
                  <Button size="small" className="p-1 text-gray-600 hover:text-indigo-600">
                    <FiEye className="w-4 h-4" />
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{invoice.customer}</h3>
                <p className="text-sm text-gray-600">Ref: {invoice.reference_number}</p>
                <p className="text-sm text-gray-600">Issued: {new Date(invoice.issue_date).toLocaleDateString()}</p>
                <p className="text-sm text-gray-600">Due: {new Date(invoice.due_date).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">${invoice.total_amount.toLocaleString()}</p>
                <span
                  className={`text-xs px-2 py-1 rounded-full mt-2 inline-block ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.status === "pending"
                      ? "bg-orange-100 text-orange-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {invoice.status}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.slice(0, 3).map((product:any) => (
              <motion.div
                key={product._id}
                whileHover={{ scale: 1.03 }}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all flex items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-600">Category: {product.category_id.name}</p>
                  <p className="text-sm text-gray-600">Unit: {product.unit_id.name}</p>
                  <p className="text-lg font-bold text-purple-600">${product.price.toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Managers Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Managers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {managers.map((manager:any) => (
              <motion.div
                key={manager._id}
                whileHover={{ scale: 1.03 }}
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <img
                  src={manager.avatar}
                  alt={manager.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{manager.name}</h3>
                  <p className="text-sm text-gray-600">{manager.email}</p>
                  <p className="text-sm text-gray-500">Role: {manager.role}</p>
                </div>
                <span
                  className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    manager.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPage;