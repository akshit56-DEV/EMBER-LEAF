import React, { useState, useEffect } from 'react';
import { useInventory } from '../context/InventoryContext';
import type { Product, ProductCategory } from '../types';
import { formatINR, DEFAULT_CATEGORY_FALLBACKS } from '../utils/formatters';
import {
  X,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Package,
  Layers,
  TrendingUp,
  AlertCircle,
  Download,
  ArrowUpDown,
  Sparkles,
  Info,
} from 'lucide-react';

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type SortColumn = 'name' | 'category' | 'price' | 'stock' | 'status';

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

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortColumn>('stock');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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

  // Sorting handler
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filtered and sorted products list
  const filteredProducts = products
    .filter((p) => {
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
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortColumn === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortColumn === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortColumn === 'price') {
        comparison = a.price - b.price;
      } else if (sortColumn === 'stock') {
        comparison = a.stock - b.stock;
      } else if (sortColumn === 'status') {
        comparison = a.stock - b.stock;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
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

  // Export inventory to CSV
  const handleExportCSV = () => {
    const headers = ['SKU ID', 'Product Name', 'Category', 'Price (INR)', 'Units in Stock', 'Stock Value (INR)', 'Stock Health'];
    const rows = products.map((p) => {
      const health = p.stock <= 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'Healthy';
      return [
        `"${p.id}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.category}"`,
        p.price,
        p.stock,
        p.price * p.stock,
        `"${health}"`,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ember-leaf-inventory-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-cream-50 hover:bg-cream-200 border border-sand-300 text-espresso-800 transition-colors cursor-pointer shadow-subtle"
              title="Download CSV report of current inventory"
            >
              <Download className="w-3.5 h-3.5 text-forest-700" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={resetToDefaults}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-cream-50 hover:bg-cream-200 border border-sand-300 text-espresso-800 transition-colors cursor-pointer shadow-subtle"
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

        {/* Demo Persistence Notice */}
        <div className="bg-sand-100 border-b border-sand-200 px-6 py-2 flex items-center justify-between text-xs text-espresso-700 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-forest-800 flex-shrink-0" />
            <span>
              <strong>Live Browser Persistence:</strong> All catalog updates and stock adjustments are saved to local browser storage and synchronize immediately with the storefront.
            </span>
          </div>
          <span className="text-[11px] font-mono text-espresso-500">Auto-saved to localStorage</span>
        </div>

        {/* Interactive KPI Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 sm:p-6 bg-cream-100/60 border-b border-sand-200">
          {/* Total Products (Clickable to reset filter) */}
          <div
            onClick={() => {
              setStockStatusFilter('All');
              setCategoryFilter('All');
              setSearchTerm('');
            }}
            className="bg-cream-50 p-3.5 rounded-xl border border-sand-200 shadow-subtle hover:border-sand-300 cursor-pointer transition-all group"
            title="Click to view all items"
          >
            <div className="flex items-center justify-between text-espresso-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-forest-900">
                Catalog SKUs
              </span>
              <Layers className="w-4 h-4 text-forest-700" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-serif font-bold text-espresso-950">{totalProducts}</span>
              <span className="text-[10px] text-forest-800 font-medium group-hover:underline">View all</span>
            </div>
          </div>

          {/* Total Units */}
          <div className="bg-cream-50 p-3.5 rounded-xl border border-sand-200 shadow-subtle">
            <div className="flex items-center justify-between text-espresso-500 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">Total Units</span>
              <Package className="w-4 h-4 text-forest-700" />
            </div>
            <span className="text-2xl font-serif font-bold text-espresso-950">{totalUnitsInStock}</span>
          </div>

          {/* Low Stock Alert (Clickable filter) */}
          <div
            onClick={() => setStockStatusFilter((prev) => (prev === 'low' ? 'All' : 'low'))}
            className={`p-3.5 rounded-xl border shadow-subtle cursor-pointer transition-all ${
              lowStockCount > 0
                ? 'bg-amber-50/90 border-amber-300 text-amber-950 hover:bg-amber-100/80'
                : 'bg-cream-50 border-sand-200 text-espresso-700 hover:border-sand-300'
            } ${stockStatusFilter === 'low' ? 'ring-2 ring-amber-500 shadow-md' : ''}`}
            title="Click to toggle filter for low stock items (≤ 5 units)"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Low Stock Alert
              </span>
              <AlertTriangle className={`w-4 h-4 ${lowStockCount > 0 ? 'text-amber-600' : 'text-espresso-400'}`} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-serif font-bold ${lowStockCount > 0 ? 'text-amber-900' : 'text-espresso-950'}`}>
                {lowStockCount}
              </span>
              <span className="text-[10px] font-medium text-espresso-500">
                {lowStockCount > 0 ? '≤ 5 units left' : 'All healthy'}
              </span>
            </div>
          </div>

          {/* Out of Stock (Clickable filter - NO INVALID RED CARD WHEN 0) */}
          <div
            onClick={() => setStockStatusFilter((prev) => (prev === 'out' ? 'All' : 'out'))}
            className={`p-3.5 rounded-xl border shadow-subtle cursor-pointer transition-all ${
              outOfStockCount > 0
                ? 'bg-rose-50 border-rose-300 text-rose-950 hover:bg-rose-100/80'
                : 'bg-cream-50 border-sand-200 text-espresso-700 hover:border-sand-300'
            } ${stockStatusFilter === 'out' ? 'ring-2 ring-rose-500 shadow-md' : ''}`}
            title="Click to toggle filter for out of stock items"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider">
                Out of Stock
              </span>
              {outOfStockCount > 0 ? (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div className="flex items-baseline justify-between">
              <span className={`text-2xl font-serif font-bold ${outOfStockCount > 0 ? 'text-rose-900' : 'text-espresso-950'}`}>
                {outOfStockCount}
              </span>
              <span className="text-[10px] font-medium text-espresso-500">
                {outOfStockCount > 0 ? 'Needs restock' : 'None out of stock'}
              </span>
            </div>
          </div>

          {/* Total Stock Valuation */}
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

          {/* Filters & Count */}
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
              <option value="in">In Stock (&gt; 5)</option>
              <option value="low">Low Stock (≤ 5)</option>
              <option value="out">Out of Stock (0 units)</option>
            </select>

            {(stockStatusFilter !== 'All' || categoryFilter !== 'All' || searchTerm) && (
              <button
                onClick={() => {
                  setStockStatusFilter('All');
                  setCategoryFilter('All');
                  setSearchTerm('');
                }}
                className="text-xs text-ember-600 hover:text-ember-700 underline font-semibold cursor-pointer ml-1"
              >
                Clear Filters
              </button>
            )}

            <span className="text-xs text-espresso-500 font-medium ml-1">
              {filteredProducts.length} items
            </span>
          </div>
        </div>

        {/* Products Table (Responsive with direct stock editing) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Package className="w-12 h-12 text-espresso-300 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-espresso-900">No matching products found</h3>
              <p className="text-xs text-espresso-600 max-w-sm mx-auto">
                Try adjusting your search query or filter settings, or add a new handcrafted product to your inventory.
              </p>
              <button
                onClick={() => {
                  setStockStatusFilter('All');
                  setCategoryFilter('All');
                  setSearchTerm('');
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold bg-forest-900 text-cream-50 hover:bg-forest-800 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-sand-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-sand-100/90 border-b border-sand-200 text-espresso-600 font-bold uppercase tracking-wider text-[10px]">
                    <th
                      className="py-3 px-4 cursor-pointer hover:text-espresso-950 select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Item &amp; Details</span>
                        <ArrowUpDown className="w-3 h-3 text-espresso-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-espresso-950 select-none"
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        <ArrowUpDown className="w-3 h-3 text-espresso-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-espresso-950 select-none"
                      onClick={() => handleSort('price')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Price</span>
                        <ArrowUpDown className="w-3 h-3 text-espresso-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-espresso-950 select-none min-w-[150px]"
                      onClick={() => handleSort('stock')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Stock Units</span>
                        <ArrowUpDown className="w-3 h-3 text-espresso-400" />
                      </div>
                    </th>
                    <th
                      className="py-3 px-3 cursor-pointer hover:text-espresso-950 select-none"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <ArrowUpDown className="w-3 h-3 text-espresso-400" />
                      </div>
                    </th>
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

                        {/* Stock Adjustment Controls with DIRECT NUMERIC EDIT & MIN 0 */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            {/* Decrement Button (DISABLED IF STOCK IS 0 to prevent negative stock) */}
                            <button
                              onClick={() => updateStock(p.id, Math.max(0, p.stock - 1))}
                              disabled={p.stock <= 0}
                              className="w-6 h-6 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold transition-colors cursor-pointer"
                              title={p.stock <= 0 ? 'Stock cannot be negative' : 'Decrease stock by 1'}
                            >
                              -
                            </button>

                            {/* Direct Numeric Input */}
                            <input
                              type="number"
                              min={0}
                              value={p.stock}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val)) {
                                  updateStock(p.id, Math.max(0, val));
                                }
                              }}
                              className="w-14 text-center font-bold text-espresso-950 font-mono py-1 px-1 bg-cream-100 rounded border border-sand-300 focus:outline-none focus:ring-1 focus:ring-forest-700"
                              title="Directly edit stock units (cannot be negative)"
                            />

                            {/* Increment Button */}
                            <button
                              onClick={() => updateStock(p.id, p.stock + 1)}
                              className="w-6 h-6 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 flex items-center justify-center font-bold transition-colors cursor-pointer"
                              title="Increase stock by 1"
                            >
                              +
                            </button>

                            {/* Quick Restock (+5) button if low or out of stock */}
                            {(isOut || isLow) && (
                              <button
                                onClick={() => updateStock(p.id, p.stock + 5)}
                                className="ml-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300 transition-colors cursor-pointer"
                                title="Quick restock +5 units"
                              >
                                +5
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Status Indicator Badge */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
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
    price: editingProduct?.price || 650,
    image: editingProduct?.image || DEFAULT_CATEGORY_FALLBACKS.Coffee,
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

  // Synchronize when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        description: editingProduct.description,
        price: editingProduct.price,
        image: editingProduct.image,
        stock: editingProduct.stock,
        badge: editingProduct.badge || '',
        origin: editingProduct.origin || '',
        roastLevel: editingProduct.roastLevel || '',
        flavorNotes: editingProduct.flavorNotes || [],
        brewGuide: editingProduct.brewGuide || '',
        weightOrSize: editingProduct.weightOrSize || '',
      });
      setFlavorNotesInput(editingProduct.flavorNotes ? editingProduct.flavorNotes.join(', ') : '');
    } else {
      setFormData({
        name: '',
        category: 'Coffee',
        description: '',
        price: 650,
        image: DEFAULT_CATEGORY_FALLBACKS.Coffee,
        stock: 10,
        badge: '',
        origin: '',
        roastLevel: '',
        flavorNotes: [],
        brewGuide: '',
        weightOrSize: '',
      });
      setFlavorNotesInput('');
    }
  }, [editingProduct]);

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
      errs.stock = 'Stock must be 0 or a positive number (cannot be negative).';
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
      stock: Math.max(0, Math.floor(formData.stock)),
      flavorNotes: notesArray,
    });
  };

  const handleApplyPresetImage = (category: ProductCategory) => {
    const url = DEFAULT_CATEGORY_FALLBACKS[category];
    if (url) {
      setFormData((prev) => ({ ...prev, image: url, category }));
    }
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
            className="p-1 rounded-full text-espresso-500 hover:text-espresso-900 cursor-pointer"
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
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  setFormData({ ...formData, category: cat });
                }}
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
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setFormData({ ...formData, stock: isNaN(val) ? 0 : Math.max(0, val) });
                }}
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

          {/* Image URL & Instant Category Preset Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-espresso-800">
                Image URL <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-espresso-500">Pick image preset:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPresetImage('Coffee')}
                  className="px-2 py-0.5 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 cursor-pointer"
                >
                  Coffee
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetImage('Tea')}
                  className="px-2 py-0.5 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 cursor-pointer"
                >
                  Tea
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetImage('Brewing Equipment')}
                  className="px-2 py-0.5 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 cursor-pointer"
                >
                  Gear
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetImage('Accessories')}
                  className="px-2 py-0.5 rounded bg-sand-200 hover:bg-sand-300 text-espresso-800 cursor-pointer"
                >
                  Ceramic
                </button>
              </div>
            </div>
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
                  className="w-10 h-10 rounded-lg object-cover bg-sand-200 border border-sand-300 flex-shrink-0"
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
              className="px-4 py-2 rounded-full font-semibold text-espresso-700 hover:bg-cream-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-forest-900 text-cream-50 font-semibold hover:bg-forest-800 shadow-sm cursor-pointer"
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
            className="flex-1 py-2.5 rounded-full font-semibold text-xs text-espresso-700 bg-cream-200 hover:bg-sand-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full font-semibold text-xs text-red-50 bg-red-700 hover:bg-red-800 shadow-sm transition-colors cursor-pointer"
          >
            Yes, Delete Item
          </button>
        </div>
      </div>
    </div>
  );
};
