"use client";
import { api } from "@/app/lib/api";
import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import InputField from "@/app/components/common/InputField";
import Loader from "@/app/components/loader";
import Modal from "@/app/components/common/Model";
import Button from "@/app/components/common/Button";
import { useToast } from "@/app/Context/ToastContext";


interface Category {
  _id: string;
  name: string;
  description: string;
  deleted: boolean;
  created_at: string;
}

interface FormData {
  name: string;
  description: string;
  deleted: boolean;
}

function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast()
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    deleted: false,
  });

  // Fetch categories with error handling
  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.GetCategories(showToast);
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handle form submission for create/update
  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      if (selectedCategory) {
        await api.EditCategories(selectedCategory._id, formData.name, formData.description, showToast);
      } else {
        await api.CreateCategories(formData.name, formData.description, showToast);
      }
      
      await fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Operation failed:", error);
      setError("Failed to save category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle category deletion
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setIsLoading(true);
      setError(null);
      await api.DeleteCategoryById(categoryToDelete, showToast);
      await fetchCategories();
      setIsDeleteModalOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", description: "", deleted: false });
    setError(null);
  };

  // Open edit modal with category data
  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      deleted: category.deleted,
    });
    setIsModalOpen(true);
  };

  if (isLoading && categories.length === 0) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        {/* Create/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedCategory ? "Edit Category" : "Create New Category"}
          width="600px"
          showCloseButton={true}
          onProcess={handleSubmit}
          processLabel={selectedCategory ? "Update" : "Create"}
        >
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <InputField
              id="name"
              name="name"
              label="Category Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              
            />
            <InputField
              id="description"
              name="description"
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          onProcess={handleDelete}
          processLabel="Delete"
        >
          <div className="text-center">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </Modal>

        {/* Main Content */}
        <div className="rounded-2xl bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Categories Management</h2>
              <p className="mt-1 text-gray-600">Manage product categories and their status</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<FaPlus className="mr-2" />}
              disabled={isLoading}
            >
              New Category
            </Button>
          </div>

          {error && categories.length === 0 && (
            <div className="p-6 text-center text-red-500">{error}</div>
          )}

          {categories.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Category Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {categories.map((category) => (
                    <tr key={category._id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {category.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {category.description}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            category.deleted
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {category.deleted ? "Deleted" : "Active"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(category.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 hover:text-green-900 disabled:opacity-50"
                            onClick={() => handleEdit(category)}
                            disabled={isLoading}
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                            onClick={() => {
                              setCategoryToDelete(category._id);
                              setIsDeleteModalOpen(true);
                            }}
                            disabled={isLoading}
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {categories.length === 0 && !error && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CategoriesPage;