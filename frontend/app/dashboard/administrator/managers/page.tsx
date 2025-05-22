"use client";

import Button from '@/app/components/common/Button';
import Dropdown from '@/app/components/common/Dropdown';
import InputField from '@/app/components/common/InputField';
import Modal from '@/app/components/common/Model';
import Loader from '@/app/components/loader';
import { useToast } from '@/app/Context/ToastContext';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';


const ManagersTable = () => {
  const [managersData, setManagersData] = useState<any[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<string | null>(null);
  const [selectedManager, setSelectedManager] = useState<any>(null); // New state for editing
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const managersPerPage = 10;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<any>({
    name: '',
    email: '',
    password: '',
    role: 'Operations',
    status: 'active',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        setIsLoading(true);
        const data = await api.getManagers();
        setManagersData(data.managers || data); // Adjust based on your API response structure
        setFilteredManagers(data.managers || data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchManagers();
  }, []);

  useEffect(() => {
    let filtered = [...managersData];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(manager => manager.status === statusFilter);
    }

    setFilteredManagers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, statusFilter, managersData]);

  const indexOfLastManager = currentPage * managersPerPage;
  const indexOfFirstManager = indexOfLastManager - managersPerPage;
  const currentManagers = filteredManagers.slice(indexOfFirstManager, indexOfLastManager);
  const totalPages = Math.ceil(filteredManagers.length / managersPerPage);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const CreateManager = async () => {
    try {
      let errors = { name: '', email: '', password: '' };
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.email) errors.email = 'Email is required';
      if (!formData.password) errors.password = 'Password is required';
      setFormErrors(errors);

      if (Object.values(errors).some((error) => error)) return;


      setIsLoading(true);
      await api.CreateManager(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.status,
        avatarFile,
        showToast
      );
      const updatedManagers = await api.getManagers(showToast);
      setManagersData(updatedManagers);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'Operations', status: 'active' });
    } catch (error) {
      console.error(error);
      setFormErrors((prev) => ({ ...prev, email: 'Failed to create manager' }));
    } finally {
      setIsLoading(false);
    }
  };

  // New function to handle delete icon click
  const handleDeleteClick = (id: string) => {
    setManagerToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // New function to confirm deletion
  const confirmDeleteManager = async () => {
    if (!managerToDelete) return;

    try {
      setIsLoading(true);
      await api.DeleteManager(managerToDelete, showToast); // Assuming api.deleteManager(id) exists
      const updatedManagers = await api.getManagers(); // Refresh the managers list
      setManagersData(updatedManagers);
      setIsDeleteModalOpen(false);
      setManagerToDelete(null);
    } catch (error) {
      console.error('Failed to delete manager:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const EditManager = async () => {
    try {
      let errors = { name: '', email: '', password: '' };
      if (!formData.name) errors.name = 'Name is required';
      if (!formData.email) errors.email = 'Email is required';

      setFormErrors(errors)

      if (Object.values(errors).some((error) => error)) return;

      setIsLoading(true);
      await api.EditManager(
        selectedManager._id,
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.status,
        selectedManager.lastLogin,
        avatarFile,
        showToast
      );
      const updatedManagers = await api.getManagers();
      setManagersData(updatedManagers);
      setIsEditModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'Operations', status: 'active' });
      setSelectedManager(null);
    } catch (error) {
      console.error(error);
      setFormErrors((prev) => ({ ...prev, email: 'Failed to update manager' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (manager: any) => {
    setSelectedManager(manager);
    setFormData({
      name: manager.name,
      email: manager.email,
      password: '',
      role: manager.role,
      status: manager.status,

    });
    setIsEditModalOpen(true);
  };

  const handleViewClick = (id: string) => {
    router.push(`/dashboard/administrator/managers/${id}`); // Navigate to manager profile with ID
  };

  if (isLoading) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Manager Directory</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex-row cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-blue-700 items-center space-x-2"
          >
            <FaUser />
            <span>Add</span>
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex space-x-4">
              <InputField
                id="name"
                name="name"
                type="text"
                placeholder="search manager's name"
              />
              <Dropdown
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                ]}
                placeholder="Select a status"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Manager</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentManagers.map((manager: any) => (
                  <tr key={manager._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={manager.avatar}
                          alt={manager.name}
                          className="w-10 h-10 rounded-full object-cover mr-4"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{manager.name}</div>
                          <div className="text-gray-500 text-sm">{manager.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{manager.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${manager.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${manager.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}
                        ></span>
                        {manager.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {manager.lastLogin
                        ? new Date(manager.lastLogin).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                        : 'Never'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button onClick={() => handleViewClick(manager._id)} className="text-green-600 cursor-pointer hover:text-green-800">
                          <HiEye className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleEditClick(manager)} className="text-blue-600 cursor-pointer hover:text-blue-800">
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteClick(manager._id)} className="text-red-600 cursor-pointer hover:text-red-800">
                          <HiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredManagers.length > 0 && (
              <div className="flex justify-between items-center p-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstManager + 1} to {Math.min(indexOfLastManager, filteredManagers.length)} of {filteredManagers.length} managers
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Manager Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormData({ name: '', email: '', password: '', role: 'Operations', status: 'active' });
          setFormErrors({ name: '', email: '', password: '' });
          setAvatarFile(null);
        }}
        title="Add New Manager"
        width="700px"
        showCloseButton={true}
        onProcess={CreateManager}
        processLabel={''}      >
        <div className="space-y-2">
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
            id="name"
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter manager's name"
            error={formErrors.name}
          />
          <InputField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter manager's email"
            error={formErrors.email}
          />
          <InputField
            id="password"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter manager's password"
            error={formErrors.password}
          />
          <Dropdown
            options={[
              { value: 'Operations', label: 'Operations' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Support', label: 'Support' },
            ]}
            value={formData.role}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}
            placeholder="Select a role"
          />
          <Dropdown
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={formData.status}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, status: value }))}
            placeholder="Select a status"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setFormData({ name: '', email: '', password: '', role: 'Operations', status: 'active' });
          setFormErrors({ name: '', email: '', password: '' });
          setSelectedManager(null);
        }}
        title="Edit Manager"
        width="700px"
        showCloseButton={true}
        onProcess={EditManager} 
        processLabel={''}      >
        <div className="space-y-2">
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
                {selectedManager ? (
                  <>
                    <img
                      src={selectedManager.avatar}
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
            id="name"
            label="Full Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter manager's name"
            error={formErrors.name}
          />
          <InputField
            id="email"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter manager's email"
            error={formErrors.email}
          />
          <Dropdown
            options={[
              { value: 'Operations', label: 'Operations' },
              { value: 'Admin', label: 'Admin' },
              { value: 'Support', label: 'Support' },
            ]}
            value={formData.role}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}
            placeholder="Select a role"
          />
          <Dropdown
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            value={formData.status}
            onChange={(value) => setFormData((prev: any) => ({ ...prev, status: value }))}
            placeholder="Select a status"
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setManagerToDelete(null);
        }}
        title="Confirm Delete"
        width="400px"
        showCloseButton={true}
        onProcess={confirmDeleteManager} // Call delete API on confirmation
        processLabel={''}      >
        <div className="text-center">
          <p className="text-gray-700 mb-2">
            Are you sure you want to delete this manager? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ManagersTable;