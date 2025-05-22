"use client"
import { api } from '@/app/lib/api'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrash } from 'react-icons/fa'
import Button from '@/app/components/common/Button'
import InputField from '@/app/components/common/InputField'
import Dropdown from '@/app/components/common/Dropdown'
import Modal from '@/app/components/common/Model'
import Loader from '@/app/components/loader'
import { useToast } from '@/app/Context/ToastContext'


interface ToastState {
  isVisible: boolean;
  type: "success" | "error" | "info";
  message: string;
}


const ITEMS_PER_PAGE = 10;

function Page() {
  const [productData, setProductData] = useState<any>([])
  const [categories, setCategories] = useState<any[]>([])
  const [units, setUnits] = useState<any[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [ProductToDelete, setProductToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const [formData, setFormData] = useState<any>({
    name: '',
    price: '',
    category_id: '',
    unit_id: ''
  })
  const { showToast } = useToast()

  useEffect(() => {
    GetProduct()
    fetchCategories()
    fetchUnits()
  }, [])

  const GetProduct = async () => {
    try {
      setIsLoading(true)
      const data = await api.getProducts()
      setProductData(data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    const filtered = productData.filter((product: any) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category_id?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.unit_id?.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchQuery, productData])

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const fetchCategories = async () => {
    const data = await api.GetCategories()
    setCategories(data.data)
  }

  const fetchUnits = async () => {
    const data = await api.getUnits()
    setUnits(data.data)
  }


  const handleCreate = async () => {
    try {
      setFormData({ name: '', price: '', category_id: '', unit_id: '' })
      await api.createProduct(formData, showToast)
      GetProduct()
      setIsCreateModalOpen(false)
      setFormData({ name: '', price: '', category_id: '', unit_id: '' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleUpdate = async () => {
    try {
      await api.updateProduct(selectedProduct._id, formData, showToast)
      GetProduct()
      setIsEditModalOpen(false)
      setFormData({ name: '', price: '', category_id: '', unit_id: '' })

    } catch (error) {
      showToast("error", "Failed to save unit");
      console.error(error)
    }
  }

  const handleDelete = async (id: any) => {
    setProductToDelete(id)
    setIsDeleteModalOpen(true)
  }
  const confirmDeleteProduct = async () => {
    await api.deleteProductById(ProductToDelete, showToast)
    setIsDeleteModalOpen(false)
    GetProduct()
  }


  if (isLoading) {
    return <Loader />
  }
  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Create Product Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Create New Product"
          width="600px"
          showCloseButton={true}
          onProcess={handleCreate}
          processLabel="Create"

        >
          <div className="space-y-2">
            <InputField
              id="name"
              name="name"
              label="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <InputField
              id="price"
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
            <p className='ml-3'>
              Category
            </p>
            <Dropdown
              options={categories.map(c => ({ value: c._id, label: c.name }))}
              value={formData.category_id}
              onChange={(val) => setFormData({ ...formData, category_id: val })}
              placeholder="Select Category"
            />
            <p className='ml-3'>
              Unit
            </p>
            <Dropdown
              options={units.map(u => ({ value: u._id, label: u.name }))}
              value={formData.unit_id}
              onChange={(val) => setFormData({ ...formData, unit_id: val })}
              placeholder="Select Unit"
            />
          </div>
        </Modal>

        {/* Edit Product Modal */}
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Product"
          width="700px"
          showCloseButton={true}
          onProcess={handleUpdate}
          processLabel="Update"
        >
          {selectedProduct && (
            <div className="space-y-2">
              <InputField
                id="editName"
                name="name"
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <InputField
                id="editPrice"
                name="price"
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <p className='ml-3'>
                Category
              </p>
              <Dropdown
                options={categories.map(c => ({ value: c._id, label: c.name }))}
                value={formData.category_id}
                onChange={(val) => setFormData({ ...formData, category_id: val })}
                placeholder="Select Category"
              />
              <p className='ml-3'>
                Unit
              </p>
              <Dropdown
                options={units.map(u => ({ value: u._id, label: u.name }))}
                value={formData.unit_id}
                onChange={(val) => setFormData({ ...formData, unit_id: val })}
                placeholder="Select Unit"
              />
            </div>
          )}
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setProductData(null)
          } }
          title="Confirm Delete"
          width="400px"
          showCloseButton={true}
          onProcess={confirmDeleteProduct}
          processLabel={''}        >
          <div className="text-center">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>
          </div>
        </Modal>
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
              <p className="text-gray-600 mt-1">Manage your products and inventory</p>
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
            >
              Add Product
            </Button>
          </div>

          <div className='w-100'>
          <InputField
                id="search"
                name="search"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-64"
              />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {productData?.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{product.category_id?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {product.unit_id?.abbreviation}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm text-gray-900 font-medium">
                        ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs ${product.deleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {product.deleted ? 'Deleted' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="text-green-600 hover:text-green-900 transition-colors p-2 rounded-lg hover:bg-green-50"
                          onClick={() => {
                            setSelectedProduct(product)
                            setFormData({
                              name: product.name,
                              price: product.price.toString(),
                              category_id: product.category_id._id,
                              unit_id: product.unit_id._id
                            })
                            setIsEditModalOpen(true)
                          }}
                        >
                          <FaEdit className="w-5 h-5" />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 transition-colors p-2 rounded-lg hover:bg-red-50"
                          onClick={() => handleDelete(product._id)}
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length > 0 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
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
    </div>
  )
}

export default Page