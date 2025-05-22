"use client";

import { api } from "@/app/lib/api";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InputField from "@/app/components/common/InputField";
import { FaEdit, FaCamera } from "react-icons/fa";
import Modal from "@/app/components/common/Model";
import Button from "@/app/components/common/Button";

interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await api.getUsersById();
      if (response && response.user) {
        setUser(response.user);
        setFormData(response.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      console.error("No user ID available");
      return;
    }
    try {
      const response = await api.EditUser(
        user._id,
        formData.username || user.username,
        formData.email || user.email,
        formData.role || user.role,
        formData.status || user.status,
        user.lastLogin,
        avatarFile,
      );
      fetchUserData();
      if (response) {
        setUser(response);
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Profile"
          width="600px"
          showCloseButton={true}
          onProcess={handleSubmit}
          processLabel="Save Changes"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6 p-4"
          >
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium text-gray-700 mb-2">Profile Avatar</label>
              <div className="relative group cursor-pointer">
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                  id="avatarInput"
                />
                <label
                  htmlFor="avatarInput"
                  className="relative flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 overflow-hidden"
                >
                  {formData.avatar ? (
                    <motion.img
                      src={formData.avatar}
                      alt="Current Avatar"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                      whileHover={{ scale: 1.05 }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <FaCamera className="w-10 h-10 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                      <span className="text-xs text-gray-500 group-hover:text-indigo-500 mt-2">Upload Photo</span>
                    </div>
                  )}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ opacity: 1 }}
                  >
                    <FaCamera className="w-8 h-8 text-white" />
                  </motion.div>
                </label>
              </div>
            </div>
            <InputField
              id="username"
              name="username"
              label="Username"
              value={formData.username || ""}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <InputField
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </motion.div>
        </Modal>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <Button
            variant="primary"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
            icon={<FaEdit />}
          >
            Edit Profile
          </Button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 overflow-hidden relative"
        >
          {/* Decorative Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-50 pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={user?.avatar || "/default-avatar.png"}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-indigo-100 object-cover shadow-lg"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
            </motion.div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{user?.username}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-3">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    user?.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {user?.status.charAt(0).toUpperCase() + user?.status.slice(1)}
                </span>
                <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-800 text-sm font-medium">
                  {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Member Since</h3>
              <p className="text-lg font-medium text-gray-900">
                {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100"
            >
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Last Login</h3>
              <p className="text-lg font-medium text-gray-900">
                {user?.lastLogin
                  ? new Date(user.lastLogin).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Never"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;