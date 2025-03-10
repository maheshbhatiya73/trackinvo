"use client";
import { api } from "@/app/lib/api";
import React, { useCallback, useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import InputField from "@/app/components/common/InputField";
import Loader from "@/app/components/loader";
import Modal from "@/app/components/common/Model";
import Button from "@/app/components/common/Button";
import { Toast } from "@/app/components/common/Toast";
import { useToast } from "@/app/Context/ToastContext";

interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
  created_at: string;
}

interface FormData {
  name: string;
  abbreviation: string;
}

interface ToastState {
  isVisible: boolean;
  type: "success" | "error" | "info";
  message: string;
}

function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [unitToDelete, setUnitToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast()
  // Toast state
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    type: "success",
    message: "",
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    abbreviation: "",
  });


  const fetchUnits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getUnits();
      setUnits(response.data);
    } catch (error) {
      console.error("Failed to fetch units:", error);
      setError("Failed to load units. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Handle form submission (Create/Update)
  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.abbreviation.trim()) {
      setError("Both name and abbreviation are required");
      showToast("error", "Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (selectedUnit) {
        await api.updateUnit(selectedUnit._id, formData, showToast);
      } else {
        await api.createUnit(formData.name, formData.abbreviation, showToast);
      }

      await fetchUnits();
      closeModal();
    } catch (error) {
      console.error("Operation failed:", error);
      setError("Failed to save unit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle unit deletion
  const handleDelete = async () => {
    if (!unitToDelete) return;

    try {
      setIsLoading(true);
      setError(null);
      await api.deleteUnitById(unitToDelete, showToast);
      await fetchUnits();
      setIsDeleteModalOpen(false);
      setUnitToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete unit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset and close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUnit(null);
    setFormData({ name: "", abbreviation: "" });
    setError(null);
  };

  // Open edit modal
  const handleEdit = (unit: Unit) => {
    setSelectedUnit(unit);
    setFormData({
      name: unit.name,
      abbreviation: unit.abbreviation,
    });
    setIsModalOpen(true);
  };

  if (isLoading && units.length === 0) {
    return <Loader isLoading={isLoading} />;
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        {/* Toast Component */}
        {toast.isVisible && (
          <Toast
            type={toast.type}
            message={toast.message}
            position="top-right"
            onClose={() => setToast((prev) => ({ ...prev, isVisible: false }))}
            duration={4000}
          />
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={selectedUnit ? "Edit Unit" : "Create New Unit"}
          width="600px"
          showCloseButton={true}
          onProcess={handleSubmit}
          processLabel={selectedUnit ? "Update" : "Create"}
        >
          <div className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <InputField
              id="name"
              name="name"
              label="Unit Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              id="abbreviation"
              name="abbreviation"
              label="Abbreviation"
              value={formData.abbreviation}
              onChange={(e) => setFormData({ ...formData, abbreviation: e.target.value })}
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
              Are you sure you want to delete this unit? This action cannot be undone.
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </Modal>

        {/* Main Content */}
        <div className="rounded-2xl bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Units Management</h2>
              <p className="mt-1 text-gray-600">Manage measurement units</p>
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              icon={<FaPlus className="mr-2" />}
              disabled={isLoading}
            >
              New Unit
            </Button>
          </div>

          {error && units.length === 0 && (
            <div className="p-6 text-center text-red-500">{error}</div>
          )}

          {units.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Unit Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Abbreviation
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
                  {units.map((unit) => (
                    <tr key={unit._id} className="transition-colors hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        {unit.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                        {unit.abbreviation}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(unit.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50 hover:text-green-900 disabled:opacity-50"
                            onClick={() => handleEdit(unit)}
                            disabled={isLoading}
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50 hover:text-red-900 disabled:opacity-50"
                            onClick={() => {
                              setUnitToDelete(unit._id);
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

          {units.length === 0 && !error && (
            <div className="py-12 text-center">
              <p className="text-gray-500">No units found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnitsPage;