"use client";
import Button from '@/app/components/common/Button';
import Modal from '@/app/components/common/Model';
import Loader from '@/app/components/loader';
import { useToast } from '@/app/Context/ToastContext';
import { api } from '@/app/lib/api';
import { useRouter } from 'next/navigation';
import InputField from '@/app/components/common/InputField';
import React, { useEffect, useState } from 'react';
import { HiDotsVertical, HiEye, HiPencil, HiTrash, HiCurrencyDollar, HiRefresh, HiDocumentAdd } from 'react-icons/hi';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, cn, Input } from "@heroui/react";
import InDropdown from '@/app/components/common/Dropdown';
import ClassicInvoice from '@/app/templates/ClassicInvoice';
import ModernBill from '@/app/templates/ModernBill';
import ProfessionalStatement from '@/app/templates/ProfessionalStatement';
import CompactInvoice from '@/app/templates/CompactInvoice';
import CreativeReceipt from "@/app/templates/CreativeReceipt";

interface Customer {
  name: string;
  email: string;
}

interface Product {
  name: string;
  quantity: number;
  price: number;}

interface Invoice {
  _id: string;
  reference_number: string;
  customer_id: Customer;
  issue_date: string;
  due_date: string;
  total_amount: number;
  products: Product[];
  note?: string;
  recurring?: any; 
  cycle?: string;  
  invoice_template_id?: string;
}

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    reference_number: '',
    issue_date: '',
    due_date: '',
    total_amount: 0,
    recurring: false,
    cycle: 'monthly'
  });
  const router = useRouter();

  const invoiceTemplates = [
    { id: "template-001", name: "Classic Invoice", component: ClassicInvoice },
    { id: "template-002", name: "Modern Bill", component: ModernBill },
    { id: "template-003", name: "Professional Statement", component: ProfessionalStatement },
    { id: "template-004", name: "Creative Receipt", component: CreativeReceipt },
    { id: "template-005", name: "Compact Invoice", component: CompactInvoice },
  ];

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const data = await api.GetInvoices();
      setInvoices(data.data);
    } catch (err) {
      console.error('Failed to fetch invoices:', err);
      showToast('error', 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (currentInvoice) {
      setFormData({
        reference_number: currentInvoice.reference_number,
        issue_date: currentInvoice.issue_date.split('T')[0],
        due_date: currentInvoice.due_date.split('T')[0],
        total_amount: currentInvoice.total_amount,
        recurring: currentInvoice.recurring,
        cycle: currentInvoice.cycle || 'monthly'
      });
    }
  }, [currentInvoice]);

  const handleFormChange = (e: any) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };


  useEffect(() => {
    fetchInvoices();
  }, []);

  const getStatusBadge = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    if (due < today) return 'Overdue';
    return due.getDate() === today.getDate() ? 'Pending' : 'Paid';
  };

  const statusColors: { [key: string]: string } = {
    Paid: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Overdue: 'bg-red-100 text-red-800',
  };


  const confirmDelete = async () => {
    if (!currentInvoice) return;
    try {
      setIsLoading(true);
      await api.deleteInvoice(currentInvoice._id, showToast);
      await fetchInvoices();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete invoice:', error);
    } finally {
      setIsLoading(false);
      setCurrentInvoice(null);
    }
  };


  const handleViewClick = (invoice: Invoice) => {
    router.push(`/dashboard/invoices/view?id=${invoice._id}`);
  };

  const handleEditClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (invoice: Invoice) => {
    setCurrentInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentInvoice) return;
    try {
      setIsLoading(true);
      await api.updateInvoice(currentInvoice._id, formData, showToast);
      await fetchInvoices();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update invoice:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Management</h2>
          <Button
            onClick={() => router.push('/dashboard/invoices/add')}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <HiDocumentAdd className="w-5 h-5" />
            <span>Create Invoice</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {['Invoice ID', 'Customer', "Recurring cycle", 'Issue Date', 'Due Date', 'Total', 'Status', 'action'].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {invoice.reference_number}
                        </span>
                        {invoice.recurring && (
                          <HiRefresh
                            className="w-4 h-4 text-blue-500"
                            title="Recurring Invoice"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {invoice.customer_id?.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {invoice.customer_id?.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {invoice.cycle || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                        {invoice.total_amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                        ${statusColors[getStatusBadge(invoice.due_date)]}`}>
                        {getStatusBadge(invoice.due_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <td className="px-6 py-4 relative">
                        <Dropdown>
                          <DropdownTrigger>
                            <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                              <HiDotsVertical className="w-5 h-5" />
                            </button>
                          </DropdownTrigger>
                          <DropdownMenu
                            aria-label="Invoice Actions"
                            className="w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                          >
                            <DropdownItem
                              key="view"
                              startContent={<HiEye className="w-4 h-4" />}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleViewClick(invoice)}
                            >
                              View
                            </DropdownItem>
                            <DropdownItem
                              key="edit"
                              startContent={<HiPencil className="w-4 h-4" />}
                              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleEditClick(invoice)}
                            >
                              Edit
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              startContent={<HiTrash className="w-4 h-4" />}
                              className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => handleDeleteClick(invoice)}
                            >
                              Delete
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>

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
              Are you sure you want to delete invoice {currentInvoice?.reference_number}?
              This action cannot be undone.
            </p>
          </div>
        </Modal>

        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Invoice"
          width="600px"
          showCloseButton={true}
          onProcess={handleSaveEdit}
          processLabel="Save Changes"
        >
          <div className="space-y-4 p-2">
            {/* Reference Number */}
            <div className="relative">
              <input
                name="reference_number"
                placeholder='reference number'
                value={formData.reference_number}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg 
        focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 
        hover:border-sky-400 outline-none"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  name="issue_date"
                  placeholder='issue date'
                  value={formData.issue_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 
          hover:border-sky-400 outline-none appearance-none"
                />
              </div>

              <div className="relative">
                <input
                  type="date"
                  name="due_date"
                  placeholder='due date'
                  value={formData.due_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 
          hover:border-sky-400 outline-none appearance-none"
                />
              </div>
            </div>


          </div>

          <div className="flex items-center gap-2 ml-4">
            <input
              type="checkbox"
              id="recurring"
              name="recurring"
              checked={formData.recurring}
              onChange={handleFormChange}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="recurring" className="text-sm text-gray-700">
              Recurring Invoice
            </label>
          </div>

          {formData.recurring && (
            <InDropdown
              options={[
                { value: 'month', label: 'Monthly' },
                { value: 'quarter', label: 'Quarterly' },
                { value: 'year', label: 'Annually' }
              ]}
              value={formData.cycle}
              name="cycle"
              onChange={handleFormChange}
              className="w-full"
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default InvoiceTable;