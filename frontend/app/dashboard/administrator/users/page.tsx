"use client";
import Button from '@/app/components/common/Button';
import InputField from '@/app/components/common/InputField';
import Modal from '@/app/components/common/Model';
import Loader from '@/app/components/loader';
import { useToast } from '@/app/Context/ToastContext';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin?: string | null;
  createdAt: string;
  avatar: string;
  updatedAt: string;
  __v: number;
}

interface FormData {
  avatar: React.JSX.Element;
  username: string;
  email: string;
  password: string;
  role: string;
  status: 'active' | 'inactive';
}

const ITEMS_PER_PAGE = 10;

const UserTable = () => {
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const router = useRouter();
  const { showToast } = useToast();
  const defaultAvatar = 'https://icons.iconarchive.com/icons/papirus-team/papirus-status/512/avatar-default-icon.png';

  const initialFormData: FormData = {
    username: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    avatar: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormData);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const data = await api.getUsers();
        setUsersData(data.users);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        showToast('error', 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [showToast]);

  useEffect(() => {
    const filtered = usersData.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchQuery, usersData]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = { ...initialFormData };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }
    if (!currentUser && !formData.password) {
      errors.password = 'Password is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (currentUser) {
        await api.EditUser(
          currentUser._id,
          formData.username,
          formData.email,
          formData.password,
          formData.role,
          formData.status,
          null,
          avatarFile,
          showToast
        );
      } else {
        await api.createUser(
          formData.username,
          formData.email,
          formData.password,
          formData.role,
          formData.status,
          null,
          avatarFile,
          showToast
        );
      }

      const updatedUsers = await api.getUsers();
      setUsersData(updatedUsers.users);
      closeModal();
    } catch (error) {
      console.error(`Failed to ${currentUser ? 'update' : 'create'} user:`, error);
      showToast('error', `Failed to ${currentUser ? 'update' : 'create'} user`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
    setFormData(initialFormData);
    setFormErrors(initialFormData);
    setAvatarFile(null);
  };

  const handleViewClick = (id: string) => {
    router.push(`/dashboard/administrator/users/${id}`);
  };

  const handleDeleteClick = (user: User) => {
    setCurrentUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (user: User) => {
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      avatar: user.avatar
    });
    setIsModalOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
  };

  const confirmDelete = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      await api.DeleteUser(currentUser._id, showToast);
      const updatedUsers = await api.getUsers();
      setUsersData(updatedUsers.users);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete user:', error);
      showToast('error', 'Failed to delete user');
    } finally {
      setIsLoading(false);
      setCurrentUser(null);
    }
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">User Directory</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <FaUser />
            <span>Add User</span>
          </Button>
        </div>
        <div className='w-100'>
        <InputField
          id="search"
          name="search"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search users..."
          className="w-64"
        />
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {usersData.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div className="font-medium text-gray-900">{user.username}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{user.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                            }`}
                        />
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }).replace(/,/, '')
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleViewClick(user._id)}
                          className="text-green-600 hover:text-green-800"
                          aria-label={`View ${user.username}`}
                        >
                          <HiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

      {/* Unified Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentUser ? "Edit User" : "Add New User"}
        width="700px"
        showCloseButton={true}
        onProcess={handleFormSubmit}
        processLabel={currentUser ? "Save Changes" : "Add User"}
      >
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Avatar</label>

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
                className="flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 relative"
                style={{ width: '128px', height: '128px' }}
              >
                {formData.avatar ? (
                  <>
                    <img
                      src={formData.avatar}
                      alt="Current Avatar"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg hover:border-blue-100 transition-all duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-xs text-gray-500 group-hover:text-blue-500 mt-1 transition-colors duration-300">
                      Upload Photo
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
          <InputField
            id='username'
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            error={formErrors.username}
            placeholder="Enter username"
          />
          <InputField
            id='email'
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={formErrors.email}
            placeholder="Enter email"
          />
          <InputField
            id='password'
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            error={formErrors.password}
            placeholder={currentUser ? "Leave blank to keep current" : "Enter password"}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
        width="400px"
        showCloseButton={true}
        onProcess={confirmDelete}
        processLabel="Delete"
      >
        <div className="text-center">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete {currentUser?.username}? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default UserTable;