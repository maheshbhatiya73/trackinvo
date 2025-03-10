"use client";
import Button from '@/app/components/common/Button';
import InputField from '@/app/components/common/InputField';
import Modal from '@/app/components/common/Model';
import Loader from '@/app/components/loader';
import { useToast } from '@/app/Context/ToastContext';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { HiEye, HiPencil, HiTrash } from 'react-icons/hi';

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CustomerTable = () => {
  const [customersData, setCustomersData] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  const router = useRouter();
  const { showToast } = useToast();

  const initialFormData: FormData = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormData);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const data = await api.getCustomers();
        setCustomersData(data.data);
      } catch (err) {
        console.error('Failed to fetch customers:', err);
        showToast('error', 'Failed to load customers');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, [showToast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = { ...initialFormData };
    let isValid = true;

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleFormSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      if (currentCustomer) {
        await api.updateCustomer(
          currentCustomer._id,
          formData,
          showToast
        );
      } else {
        await api.createCustomer(
          formData,
          showToast
        );
      }

      const updatedCustomers = await api.getCustomers();
      setCustomersData(updatedCustomers.customers);
      closeModal();
    } catch (error) {
      console.error(`Failed to ${currentCustomer ? 'update' : 'create'} customer:`, error);
      showToast('error', `Failed to ${currentCustomer ? 'update' : 'create'} customer`);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentCustomer(null);
    setFormData(initialFormData);
    setFormErrors(initialFormData);
  };


  const handleDeleteClick = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleEditClick = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!currentCustomer) return;
    try {
      setIsLoading(true);
      await api.deleteCustomerById(currentCustomer._id, showToast);
      const updatedCustomers = await api.getCustomers();
      setCustomersData(updatedCustomers.customers);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete customer:', error);
      showToast('error', 'Failed to delete customer');
    } finally {
      setIsLoading(false);
      setCurrentCustomer(null);
    }
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Customer Directory</h2>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <span>Add Customer</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customersData?.map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.address}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditClick(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <HiPencil className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(customer)}
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
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentCustomer ? "Edit Customer" : "Add New Customer"}
        width="700px"
        showCloseButton={true}
        onProcess={handleFormSubmit}
        processLabel={currentCustomer ? "Save Changes" : "Add Customer"}
      >
        <div className="space-y-4">
          <InputField
            id='name'
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={formErrors.name}
            placeholder="Enter full name"
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
            id='phone'
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            error={formErrors.phone}
            placeholder="Enter phone number"
          />
          <InputField
            id='address'
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
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
            Are you sure you want to delete {currentCustomer?.name}? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerTable;