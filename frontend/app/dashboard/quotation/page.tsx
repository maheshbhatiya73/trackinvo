"use client";
import Button from "@/app/components/common/Button";
import Modal from "@/app/components/common/Model";
import Loader from "@/app/components/loader";
import { useToast } from "@/app/Context/ToastContext";
import { api } from "@/app/lib/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HiDotsVertical, HiEye, HiPencil, HiTrash, HiCurrencyDollar, HiDocumentAdd } from "react-icons/hi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";

interface Customer {
  name: string;
  email: string;
}

interface Product {
  name: string;
  quantity: number;
  price: number;
}

interface Quotation {
  _id: string;
  reference_number: string;
  customer_id: Customer;
  issue_date: string;
  expiry_date: string;
  total_amount: number;
  products: Product[];
  note?: string;
  quotation_template_id?: string; // For template selection
}

const QuotationTable = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    reference_number: "",
    issue_date: "",
    expiry_date: "",
    total_amount: 0,
  });
  const router = useRouter();

  const fetchQuotations = async () => {
    try {
      setIsLoading(true);
      const data = await api.GetQuotations(); // Assuming an API endpoint for quotations
      setQuotations(data.data);
    } catch (err) {
      console.error("Failed to fetch quotations:", err);
      showToast("error", "Failed to load quotations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentQuotation) {
      setFormData({
        reference_number: currentQuotation.reference_number,
        issue_date: currentQuotation.issue_date.split("T")[0],
        expiry_date: currentQuotation.expiry_date.split("T")[0],
        total_amount: currentQuotation.total_amount,
      });
    }
  }, [currentQuotation]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const getStatusBadge = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    if (expiry < today) return "Expired";
    return "Active";
  };

  const statusColors: { [key: string]: string } = {
    Active: "bg-green-100 text-green-800",
    Expired: "bg-red-100 text-red-800",
  };

  const confirmDelete = async () => {
    if (!currentQuotation) return;
    try {
      setIsLoading(true);
      await api.deleteQuotation(currentQuotation._id, showToast); // Assuming an API endpoint for deleting quotations
      await fetchQuotations();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete quotation:", error);
    } finally {
      setIsLoading(false);
      setCurrentQuotation(null);
    }
  };

  const handleViewClick = (quotation: Quotation) => {
    router.push(`/dashboard/quotation/view?id=${quotation._id}`);
  };

  const handleEditClick = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (quotation: Quotation) => {
    setCurrentQuotation(quotation);
    setIsDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!currentQuotation) return;
    try {
      setIsLoading(true);
      await api.updateQuotation(currentQuotation._id, formData, showToast); // Assuming an API endpoint for updating quotations
      await fetchQuotations();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update quotation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loader isLoading={isLoading} />;

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
          <Button
            onClick={() => router.push("/dashboard/quotations/add")}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            <HiDocumentAdd className="w-5 h-5" />
            <span>Create Quotation</span>
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Quotation ID", "Customer", "Issue Date", "Expiry Date", "Total", "Status", "Action"].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {quotations.map((quotation) => (
                  <tr key={quotation._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{quotation.reference_number}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{quotation.customer_id.name}</span>
                        <span className="text-sm text-gray-500">{quotation.customer_id.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(quotation.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(quotation.expiry_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div className="flex items-center gap-2">
                        <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                        {quotation.total_amount.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[getStatusBadge(quotation.expiry_date)]
                        }`}
                      >
                        {getStatusBadge(quotation.expiry_date)}
                      </span>
                    </td>
                    <td className="px-6 py-4 relative">
                      <Dropdown>
                        <DropdownTrigger>
                          <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                            <HiDotsVertical className="w-5 h-5" />
                          </button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Quotation Actions"
                          className="w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                        >
                          <DropdownItem
                            key="view"
                            startContent={<HiEye className="w-4 h-4" />}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleViewClick(quotation)}
                          >
                            View
                          </DropdownItem>
                          <DropdownItem
                            key="edit"
                            startContent={<HiPencil className="w-4 h-4" />}
                            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleEditClick(quotation)}
                          >
                            Edit
                          </DropdownItem>
                          <DropdownItem
                            key="delete"
                            startContent={<HiTrash className="w-4 h-4" />}
                            className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => handleDeleteClick(quotation)}
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
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
              Are you sure you want to delete quotation {currentQuotation?.reference_number}? This action
              cannot be undone.
            </p>
          </div>
        </Modal>

        {/* Edit Quotation Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Quotation"
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
                placeholder="Reference Number"
                value={formData.reference_number}
                onChange={handleFormChange}
                required
                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 hover:border-sky-400 outline-none"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="date"
                  name="issue_date"
                  placeholder="Issue Date"
                  value={formData.issue_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 hover:border-sky-400 outline-none appearance-none"
                />
              </div>

              <div className="relative">
                <input
                  type="date"
                  name="expiry_date"
                  placeholder="Expiry Date"
                  value={formData.expiry_date}
                  onChange={handleFormChange}
                  required
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-300 hover:border-sky-400 outline-none appearance-none"
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QuotationTable;