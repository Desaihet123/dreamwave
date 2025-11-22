'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function ProductPage() {
  const { user, loading, isManager } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    uom: '',
    quantity: '',
    warehouseId: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !isManager) {
      router.push('/access-denied');
    }
  }, [loading, isManager, router]);

  useEffect(() => {
    if (isManager) {
      fetchProducts();
      fetchWarehouses();
    }
  }, [isManager]);

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get('/api/warehouse');
      setWarehouses(response.data.warehouses || []);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await axios.get('/api/product');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Failed to fetch products' });
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      if (editingId) {
        await axios.put('/api/product/update', { id: editingId, ...formData });
        setMessage({ type: 'success', text: 'Product updated successfully' });
      } else {
        await axios.post('/api/product/add', formData);
        setMessage({ type: 'success', text: 'Product added successfully' });
      }
      setFormData({ name: '', sku: '', category: '', uom: '' });
      setEditingId(null);
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to save product';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category?.name || '',
      uom: product.uom,
      quantity: '',
      warehouseId: '',
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`/api/product?id=${id}`);
      setMessage({ type: 'success', text: 'Product deleted successfully' });
      fetchProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to delete product';
      setMessage({ type: 'error', text: errorMsg });
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', sku: '', category: '', uom: '', quantity: '', warehouseId: '' });
    setEditingId(null);
    setShowForm(false);
    setMessage({ type: '', text: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#24253A] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isManager) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#24253A] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-400">Create and manage your inventory products</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Product
            </button>
          )}
        </div>

        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-[#402040] border-[#b976ff] text-[#ff297a]'
            }`}
          >
            {message.text}
          </div>
        )}

        {showForm && (
          <div className="bg-[#292b3b] rounded-lg border border-gray-800 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    placeholder="e.g., Steel Rods"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    SKU / Code
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    placeholder="e.g., SR-001"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    placeholder="e.g., Raw Materials"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Unit of Measure
                  </label>
                  <input
                    type="text"
                    name="uom"
                    value={formData.uom}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    placeholder="e.g., kg, pieces, liters"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                    placeholder="e.g., 100"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Warehouse
                  </label>
                  <select
                    name="warehouseId"
                    value={formData.warehouseId}
                    onChange={handleChange}
                    className="w-full bg-[#24253A] border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#b976ff] outline-none"
                  >
                    <option value="">Select warehouse (optional)</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#b976ff] to-[#7864EF] text-white font-bold py-2 rounded-lg hover:opacity-90 transition-all"
                >
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-[#24253A] border border-gray-700 text-gray-300 font-bold py-2 rounded-lg hover:bg-[#2d2f3b] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-[#292b3b] rounded-lg border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Package className="w-6 h-6" />
              Products List
            </h2>
          </div>

          {loadingProducts ? (
            <div className="p-6 text-center text-gray-400">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-2 opacity-50" />
              <p className="text-gray-400">No products found. Start by adding a product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#24253A] border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-3 font-semibold text-gray-300">Name</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">SKU</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">UOM</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Total Stock</th>
                    <th className="px-6 py-3 font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const totalStock = product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) || 0;
                    return (
                      <tr key={product.id} className="border-b border-gray-800 hover:bg-[#24253A] transition-colors">
                        <td className="px-6 py-4">{product.name}</td>
                        <td className="px-6 py-4 font-mono text-[#b976ff]">{product.sku}</td>
                        <td className="px-6 py-4">{product.category?.name || '-'}</td>
                        <td className="px-6 py-4">{product.uom}</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-500 bg-opacity-20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                            {totalStock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-400 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-400 hover:bg-red-500 hover:bg-opacity-20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
