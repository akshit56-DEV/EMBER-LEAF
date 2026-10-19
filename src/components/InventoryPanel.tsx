import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import type { Product, ProductCategory } from '../types';
import { formatINR, DEFAULT_CATEGORY_FALLBACKS } from '../utils/formatters';
import {
  X,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Package,
  Layers,
  TrendingUp,
  AlertCircle,
  Eye,
  Info,
} from 'lucide-react';

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InventoryPanel: React.FC<InventoryPanelProps> = ({ isOpen, onClose }) => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    resetToDefaults,
    totalProducts,
    totalUnitsInStock,
    lowStockCount,
    outOfStockCount,
    totalStockValue,
  } = useInventory();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'All'>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'low' | 'out' | 'in'>('All');

  // Modals inside inventory
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isFormOpen && !deletingProductId) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFormOpen, deletingProductId, onClose]);

  if (!isOpen) return null;

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    // Search
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query) ||
      (p.origin && p.origin.toLowerCase().includes(query));

    // Category
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;

    // Stock Status
    let matchesStock = true;
    if (stockStatusFilter === 'low') {
      matchesStock = p.stock > 0 && p.stock <= 5;
    } else if (stockStatusFilter === 'out') {
      matchesStock = p.stock <= 0;
    } else if (stockStatusFilter === 'in') {
      matchesStock = p.stock > 5;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingProductId) {
      deleteProduct(deletingProductId);
      setDeletingProductId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/80 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inventory-panel-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-cream-50 w-full max-w-6xl rounded-3xl border border-sand-300 shadow-modal overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* Top Header */}
        <div className="p-5 sm:p-6 border-b border-sand-200 bg-cream-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center">
              <Package className="w-5 h-5 text-ember-400" />
            </div>
            <div>
              <h2 id="inventory-panel-title" className="font-serif text-xl sm:text-2xl font-bold text-espresso-950">
                Inventory &amp; Stock Management
              </h2>
              <span className="text-xs text-espresso-600 font-medium">
                Real-time small-business catalog and stock control workspace
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-cream-50 hover:bg-cream-200 border border-sand-300 text-espresso-800 transition-colors cursor-pointer"
              title="Reset inventory to original demonstration items"
            >
              <RotateCcw className="w-3.5 h-3.5 text-forest-700" />
              <span className="hidden sm:inline">Reset Demo Data</span>
            </button>
            <button
              onClick={handleOpenAddForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-forest-900 text-cream-50 hover:bg-forest-800 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-ember-400" />
              <span>Add Product</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-espresso-600 hover:text-espresso-950 hover:bg-cream-200 transition-colors cursor-pointer ml-1"
              aria-label="Close inventory panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demo Persistence Disclaimer */}
        <div className="bg-sand-200/60 border-b border-sand-300 px-6 py-2 flex items-center justify-between text-xs text-espresso-700 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-forest-800 flex-shrink-0" />
            <span>
              <strong>Local Browser Demonstration:</strong> Stock adjustments and product changes are saved in your browser's localStorage and update the storefront and active carts instantly.
            </span>
          </div>
          <span className="text-[11px] font-mono text-espresso-600">Storage Key: ember_leaf_inventory</span>
        </div>

        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 sm:p-6 bg-cream-100/60 border-b border-sand-200">
          {/* Total Products */}
          <div className="bg-cream-50 p-3.5 rounded-xl border border-sand-200 shadow-subtle">
            <div className="flex items-center justify-between text-espresso-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Catalog SKUs</span>
              <Layers className="w-4 h-4 text-forest-700" />
            </div>
            <span className="text-2xl font-serif font-bold text-espresso-950">{totalProducts}</span>
          </div>

          {/* Total Units */}
          <div className="bg-cream-50 p-3.5 rounded-xl border border-sand-200 shadow-subtle">
            <div className="flex items-center justify-between text-espresso-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Units</span>
              <Package className="w-4 h-4 text-forest-700" />
            </div>
            <span className="text-2xl font-serif font-bold text-espresso-950">{totalUnitsInStock}</span>
          </div>

          {/* Low Stock (<= 5) */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-subtle">
            <div className="flex items-center justify-between text-amber-900 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Low Stock (≤5)</span>
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-serif font-bold text-amber-900">{lowStockCount}</span>
          </div>

          {/* Out of Stock (0) */}
          <div className="bg-red-50/70 p-3.5 rounded-xl border border-red-200 shadow-subtle">
            <div className="flex items-center justify-between text-red-900 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Out of Stock (0)</span>
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-2xl font-serif font-bold text-red-900">{outOfStockCount}</span>
          </div>

          {/* Total Value */}
          <div className="bg-cream-50 p-3.5 rounded-xl border border-sand-200 shadow-subtle col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-espresso-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Stock Valuation</span>
              <TrendingUp className="w-4 h-4 text-forest-700" />
            </div>
            <span className="text-xl sm:text-2xl font-serif font-bold text-forest-900">
              {formatINR(totalStockValue)}
            </span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-6 border-b border-sand-200 bg-cream-50 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-espresso-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search product name, SKU or origin..."
              className="w-full pl-9 pr-8 py-2 rounded-xl text-xs sm:text-sm bg-cream-100 border border-sand-300 focus:outline-none focus:ring-2 focus:ring-forest-700/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | 'All')}
              className="bg-cream-100 border border-sand-300 text-espresso-800 text-xs font-medium py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Coffee">Coffee</option>
              <option value="Tea">Tea</option>
              <option value="Brewing Equipment">Brewing Equipment</option>
              <option value="Accessories">Accessories</option>
            </select>

            {/* Stock Status Filter */}
            <select
              value={stockStatusFilter}
              onChange={(e) => setStockStatusFilter(e.target.value as 'All' | 'low' | 'out' | 'in')}
              className="bg-cream-100 border border-sand-300 text-espresso-800 text-xs font-medium py-2 px-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/20 cursor-pointer"
            >
              <option value="All">All Stock Levels</option>
              <option value="in">In Stock (&gt;5)</option>
              <option value="low">Low Stock (≤5)</option>
              <option value="out">Out of Stock (0)</option>
            </select>

            <span className="text-xs text-espresso-500 font-medium ml-1">
              {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* Products Table (Responsive) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-espresso-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-espresso-900">No matching products found</h3>
              <p className="text-xs text-espresso-600 max-w-sm mx-auto">
                Try adjusting your search query or filter settings, or add a new handcrafted product to your inventory.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-sand-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-sand-100/90 border-b border-sand-200 text-espresso-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Item &amp; Details</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Price</th>
                    <th className="py-3 px-3">Stock Units</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200 bg-cream-50">
                  {filteredProducts.map((p) => {
                    const isOut = p.stock <= 0;
                    const isLow = p.stock > 0 && p.stock <= 5;

                    return (
                      <tr key={p.id} className="hover:bg-cream-100/80 transition-colors">
                        {/* Item Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              onError={(e) => {
                                const fallback =
                                  DEFAULT_CATEGORY_FALLBACKS[p.category] ||
                                  DEFAULT_CATEGORY_FALLBACKS.Coffee;
                                if (e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                              className="w-12 h-12 rounded-lg object-cover bg-sand-200 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-espresso-950 block truncate max-w-xs sm:max-w-sm">
                                {p.name}
                              </span>
                              <span className="font-mono text-[10px] text-espresso-400 block">
                                SKU: {p.id}
                              </span>
                              {p.badge && (
                                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-sand-200 text-espresso-800">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-3 font-medium text-espresso-700 whitespace-nowrap">
                          {p.category}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-3 font-serif font-bold text-espresso-950 whitespace-nowrap">
                          {formatINR(p.price)}
                        </td>

                        {/* Stock Adjustment Controls */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))}
                              className="w-6 h-6 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                              title="Decrease stock by 1"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold text-espresso-950 font-mono">
                              {p.stock}
                            </span>
                            <button
                              onClick={() => updateStock(p.id, p.stock + 1)}
                              className="w-6 h-6 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                              title="Increase stock by 1"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        {/* Status Indicator Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-800 border border-red-200">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Low Stock ({p.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Healthy ({p.stock})
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditForm(p)}
                              className="p-1.5 rounded-lg text-espresso-700 hover:text-forest-900 hover:bg-sand-200 transition-colors cursor-pointer"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingProductId(p.id)}
                              className="p-1.5 rounded-lg text-espresso-700 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete product"
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

      {/* Product Form Modal (Add / Edit) */}
      {isFormOpen && (
        <ProductFormModal
          editingProduct={editingProduct}
          onClose={() => setIsFormOpen(false)}
          onSave={(data) => {
            if (editingProduct) {
              updateProduct(editingProduct.id, data);
            } else {
              addProduct(data);
            }
            setIsFormOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <DeleteConfirmationModal
          productId={deletingProductId}
          productName={products.find((p) => p.id === deletingProductId)?.name || 'this item'}
          onCancel={() => setDeletingProductId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component: Product Add/Edit Form Modal
// -------------------------------------------------------------

interface ProductFormModalProps {
  editingProduct: Product | null;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id'>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({
  editingProduct,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: editingProduct?.name || '',
    category: editingProduct?.category || 'Coffee',
    description: editingProduct?.description || '',
    price: editingProduct?.price || 500,
    image: editingProduct?.image || '',
    stock: editingProduct?.stock ?? 10,
    badge: editingProduct?.badge || '',
    origin: editingProduct?.origin || '',
    roastLevel: editingProduct?.roastLevel || '',
    flavorNotes: editingProduct?.flavorNotes || [],
    brewGuide: editingProduct?.brewGuide || '',
    weightOrSize: editingProduct?.weightOrSize || '',
  });

  const [flavorNotesInput, setFlavorNotesInput] = useState(
    editingProduct?.flavorNotes ? editingProduct.flavorNotes.join(', ') : ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Product name is required (minimum 2 characters).';
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      errs.description = 'Please provide a descriptive explanation (min 5 characters).';
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      errs.price = 'Price must be greater than ₹0.';
    }

    if (isNaN(formData.stock) || formData.stock < 0) {
      errs.stock = 'Stock must be 0 or a positive number.';
    }

    if (!formData.image.trim()) {
      errs.image = 'Image URL is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Parse flavor notes from comma-separated string
    const notesArray = flavorNotesInput
      .split(',')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);

    onSave({
      ...formData,
      flavorNotes: notesArray,
    });
  };

  return (
    <div
      className="fixed inset-0 z-60 bg-espresso-950/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-cream-50 w-full max-w-2xl rounded-3xl border border-sand-300 shadow-modal overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-sand-200 bg-cream-100 flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-espresso-950">
            {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Handcrafted Item'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-espresso-500 hover:text-espresso-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Chikmagalur Honey Arabica"
                className={`w-full px-3 py-2 rounded-xl bg-cream-100 border ${
                  errors.name ? 'border-red-500' : 'border-sand-300'
                } focus:outline-none focus:border-forest-700`}
              />
              {errors.name && <p className="text-[10px] text-red-600 mt-0.5">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Category <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ProductCategory })
                }
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none focus:border-forest-700 cursor-pointer"
              >
                <option value="Coffee">Coffee</option>
                <option value="Tea">Tea</option>
                <option value="Brewing Equipment">Brewing Equipment</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-espresso-800 mb-1">
              Description <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Sensory narrative, roast profile, harvest story..."
              className={`w-full px-3 py-2 rounded-xl bg-cream-100 border ${
                errors.description ? 'border-red-500' : 'border-sand-300'
              } focus:outline-none focus:border-forest-700`}
            />
            {errors.description && (
              <p className="text-[10px] text-red-600 mt-0.5">{errors.description}</p>
            )}
          </div>

          {/* Price, Stock, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Price (INR ₹) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl bg-cream-100 border ${
                  errors.price ? 'border-red-500' : 'border-sand-300'
                } focus:outline-none focus:border-forest-700`}
              />
              {errors.price && <p className="text-[10px] text-red-600 mt-0.5">{errors.price}</p>}
            </div>

            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Stock Quantity (Units) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className={`w-full px-3 py-2 rounded-xl bg-cream-100 border ${
                  errors.stock ? 'border-red-500' : 'border-sand-300'
                } focus:outline-none focus:border-forest-700`}
              />
              {errors.stock && <p className="text-[10px] text-red-600 mt-0.5">{errors.stock}</p>}
            </div>

            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Badge / Tag (Optional)
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Best Seller / New"
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none focus:border-forest-700"
              />
            </div>
          </div>

          {/* Image URL & Live Preview */}
          <div>
            <label className="block font-semibold text-espresso-800 mb-1">
              Image URL <span className="text-red-600">*</span>
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className={`flex-1 px-3 py-2 rounded-xl bg-cream-100 border ${
                  errors.image ? 'border-red-500' : 'border-sand-300'
                } focus:outline-none focus:border-forest-700`}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_CATEGORY_FALLBACKS[formData.category];
                  }}
                  className="w-10 h-10 rounded-lg object-cover bg-sand-200 border border-sand-300"
                />
              )}
            </div>
            {errors.image && <p className="text-[10px] text-red-600 mt-0.5">{errors.image}</p>}
          </div>

          {/* Origin & Roast Profile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Origin &amp; Elevation
              </label>
              <input
                type="text"
                value={formData.origin || ''}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                placeholder="e.g. Baba Budan Giri (1,400m)"
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Roast Level / Tea Flush
              </label>
              <input
                type="text"
                value={formData.roastLevel || ''}
                onChange={(e) => setFormData({ ...formData, roastLevel: e.target.value })}
                placeholder="e.g. Light-Medium Roast / Spring Flush"
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Tasting Notes & Weight/Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Tasting Notes (comma-separated)
              </label>
              <input
                type="text"
                value={flavorNotesInput}
                onChange={(e) => setFlavorNotesInput(e.target.value)}
                placeholder="e.g. Orange Blossom, Honey, Cocoa"
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-espresso-800 mb-1">
                Weight or Size Option
              </label>
              <input
                type="text"
                value={formData.weightOrSize || ''}
                onChange={(e) => setFormData({ ...formData, weightOrSize: e.target.value })}
                placeholder="e.g. 250g Whole Bean / 100g Loose Leaf"
                className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Brew Protocol */}
          <div>
            <label className="block font-semibold text-espresso-800 mb-1">
              Recommended Brew Guide
            </label>
            <input
              type="text"
              value={formData.brewGuide || ''}
              onChange={(e) => setFormData({ ...formData, brewGuide: e.target.value })}
              placeholder="e.g. 15g coffee to 240g water at 91°C via Pour-over"
              className="w-full px-3 py-2 rounded-xl bg-cream-100 border border-sand-300 focus:outline-none"
            />
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full font-semibold text-espresso-700 hover:bg-cream-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-forest-900 text-cream-50 font-semibold hover:bg-forest-800 shadow-sm"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// Sub-component: Delete Confirmation Dialog
// -------------------------------------------------------------

interface DeleteConfirmationModalProps {
  productId: string;
  productName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  productName,
  onCancel,
  onConfirm,
}) => {
  return (
    <div
      className="fixed inset-0 z-70 bg-espresso-950/80 backdrop-blur-sm p-4 flex items-center justify-center animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-cream-50 w-full max-w-md rounded-3xl border border-sand-300 shadow-modal p-6 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <Trash2 className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-serif text-lg font-bold text-espresso-950">Confirm Deletion</h3>
          <p className="text-xs text-espresso-600 leading-relaxed">
            Are you sure you want to permanently remove <strong>"{productName}"</strong> from the catalog?
          </p>
          <p className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-left">
            <strong>Note:</strong> If this item is currently in a customer's active shopping cart, it will be automatically reconciled and removed upon deletion.
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-full font-semibold text-xs text-espresso-700 bg-cream-200 hover:bg-sand-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full font-semibold text-xs text-red-50 bg-red-700 hover:bg-red-800 shadow-sm transition-colors"
          >
            Yes, Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};
