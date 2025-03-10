"use client";
import React, { useState, useEffect } from "react";
import { useToast } from "@/app/Context/ToastContext";
import { HiPlus, HiTrash, HiX } from "react-icons/hi";
import { api } from "@/app/lib/api";
import Button from "@/app/components/common/Button";
import Dropdown from "@/app/components/common/Dropdown";
import { useRouter } from "next/navigation";

interface Product {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
}

// Define available quotation templates
const quotationTemplates = [
  { id: "template-001", name: "Classic Quotation" },
  { id: "template-002", name: "Modern Quote" },
  { id: "template-003", name: "Professional Estimate" },
  { id: "template-004", name: "Creative Proposal" },
  { id: "template-005", name: "Compact Quotation" },
];

const CreateQuotationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [issueDate, setIssueDate] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [discountType, setDiscountType] = useState<string>("percentage");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string>("");

  useEffect(() => {
    const savedTemplateId = localStorage.getItem("selectedTemplateId");
    if (savedTemplateId) {
      setSelectedTemplateId(savedTemplateId);
      const template = quotationTemplates.find((t) => t.id === savedTemplateId);
      setSelectedTemplateName(template ? template.name : "Unknown Template");
    } else {
      setSelectedTemplateName("No Template Selected");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersData, productsData] = await Promise.all([
          api.getCustomers(),
          api.getProducts(),
        ]);
        setCustomers(customersData.data);
        setProducts(
          productsData?.data.map((p: any) => ({
            product_id: p._id,
            name: p.name,
            price: p.price,
            quantity: 1,
            unit_price: p.price,
            total_amount: p.price,
          }))
        );
      } catch (error: any) {
        showToast("error", error.message || "Failed to load data");
      }
    };
    fetchData();
  }, []);

  const addProduct = (productId: string) => {
    const product = products.find((p) => p.product_id === productId);
    if (product && !selectedProducts.find((p) => p.product_id === productId)) {
      setSelectedProducts([...selectedProducts, { ...product }]);
    }
  };

  const updateProduct = (productId: string, field: string, value: number) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.product_id === productId) {
          const updated = { ...p, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            updated.total_amount = updated.quantity * updated.unit_price;
          }
          return updated;
        }
        return p;
      })
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.product_id !== productId));
  };

  const calculateTotal = () => {
    const subtotal = selectedProducts.reduce((sum, p) => sum + p.total_amount, 0);
    const discount =
      discountType === "percentage" ? subtotal * (discountAmount / 100) : discountAmount;
    return subtotal - discount;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedCustomer) newErrors.customer = "Customer is required";
    if (!referenceNumber) newErrors.reference = "Reference number is required";
    if (!issueDate) newErrors.issueDate = "Issue date is required";
    if (!expiryDate) newErrors.expiryDate = "Expiry date is required";
    if (selectedProducts.length === 0) newErrors.products = "At least one product required";
    if (!selectedTemplateId) newErrors.template = "Please select a quotation template";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const quotationData = {
      customer_id: selectedCustomer,
      issue_date: new Date(issueDate).toISOString(),
      expiry_date: new Date(expiryDate).toISOString(),
      reference_number: referenceNumber,
      products: selectedProducts.map((p) => ({
        product_id: p.product_id,
        quantity: p.quantity,
        unit_price: p.unit_price,
        total_amount: p.total_amount,
      })),
      discount_type: discountType,
      discount_amount: discountAmount,
      note: notes,
      quotation_template_id: selectedTemplateId, // Use template ID from localStorage
      total_amount: calculateTotal(),
    };

    try {
      setIsLoading(true);
      await api.createQuotation(quotationData); // Assuming an API endpoint for quotations
      showToast("success", "Quotation created successfully!");
      setSelectedCustomer("");
      setIssueDate("");
      setExpiryDate("");
      setReferenceNumber("");
      setSelectedProducts([]);
      setDiscountType("percentage");
      setDiscountAmount(0);
      setNotes("");
      setErrors({});
    } catch (error) {
      showToast("error", "Failed to create quotation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeTemplate = () => {
    router.push("/dashboard/templates");
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Create New Quotation</h1>
            <Button
              onClick={handleSubmit}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Quotation"
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <Dropdown
                  options={customers.map((c) => ({ value: c._id, label: c.name }))}
                  value={selectedCustomer}
                  name="customer"
                  onChange={(value) => setSelectedCustomer(value)}
                  placeholder="Select Customer"
                />
                {errors.customer && (
                  <p className="mt-1 text-sm text-red-600">{errors.customer}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Issue Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.issueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.issueDate}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                  )}
                </div>
              </div>

              {/* Display Selected Template and Change Button */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quotation Template</label>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-4 py-3 w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-700">
                    {selectedTemplateName}
                  </span>
                  <Button
                    variant="primary"
                    size="medium"
                    iconPosition="left"
                    onClick={handleChangeTemplate}
                  >
                    Change
                  </Button>
                </div>
                {errors.template && (
                  <p className="mt-1 text-sm text-red-600">{errors.template}</p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reference Number</label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="QUOT-001"
                />
                {errors.reference && (
                  <p className="mt-1 text-sm text-red-600">{errors.reference}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                  placeholder="Valid for 30 days..."
                />
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-8">
            <div className="border-b border-gray-200 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Products/Services</h3>
            </div>

            <div className="mb-4 relative">
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedProducts.map((product) => (
                  <span
                    key={product.product_id}
                    className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-sm"
                  >
                    {product.name}
                    <button
                      onClick={() => removeProduct(product.product_id)}
                      className="ml-2 p-1 hover:text-purple-500 rounded-full"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowProductDropdown(true);
                  }}
                  onFocus={() => setShowProductDropdown(true)}
                  placeholder="Search and add products..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />

                {showProductDropdown && (
                  <div className="absolute z-10 mt-2 w-full bg-white shadow-lg rounded-lg border border-gray-200 max-h-60 overflow-auto">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.product_id}
                        onClick={() => {
                          addProduct(product.product_id);
                          setSearchQuery("");
                          setShowProductDropdown(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm text-gray-700"
                      >
                        {product.name} - ${product.price.toFixed(2)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.products && (
                <p className="mt-1 text-sm text-red-600">{errors.products}</p>
              )}
            </div>

            <div className="space-y-4">
              {selectedProducts.map((product) => (
                <div
                  key={product.product_id}
                  className="group grid grid-cols-12 gap-4 items-center p-4 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="col-span-5">
                    <p className="font-medium text-gray-900">{product.name}</p>
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.product_id, "quantity", parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      step="0.01"
                      value={product.unit_price}
                      onChange={(e) => updateProduct(product.product_id, "unit_price", parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="col-span-2 text-right font-medium text-purple-600">
                    ${product.total_amount.toFixed(2)}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeProduct(product.product_id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded-full"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Section */}
          <div className="bg-gray-900 p-6 rounded-xl">
            <div className="space-y-4 text-white">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal:</span>
                <span className="font-medium">
                  ${selectedProducts.reduce((sum, p) => sum + p.total_amount, 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Discount:</span>
                <span className="text-red-400">
                  {discountType === "percentage" ? `${discountAmount}%` : `-$${discountAmount.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-purple-400">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuotationPage;