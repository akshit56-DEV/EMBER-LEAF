import React from 'react';
import type { ProductCategory } from '../types';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'stock' | 'name';

interface CategoryFilterBarProps {
  categories: (ProductCategory | 'All')[];
  activeCategory: ProductCategory | 'All';
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  onlyInStock: boolean;
  setOnlyInStock: (val: boolean) => void;
  totalFilteredCount: number;
  totalCatalogCount: number;
  onClearFilters: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  onlyInStock,
  setOnlyInStock,
  totalFilteredCount,
  totalCatalogCount,
  onClearFilters,
  searchInputRef,
}) => {
  const hasActiveFilters =
    activeCategory !== 'All' || searchTerm.trim() !== '' || onlyInStock || sortBy !== 'featured';

  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none" role="tablist">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-forest-900 text-cream-50 shadow-sm border border-forest-800'
                    : 'bg-cream-50 text-espresso-800 hover:bg-cream-200 border border-sand-300'
                }`}
              >
                {cat === 'All' ? 'All Handcrafted Offerings' : cat}
              </button>
            );
          })}
        </div>

        {/* In-Stock Only Toggle */}
        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-espresso-800 bg-cream-50 px-3 py-1.5 rounded-full border border-sand-300 select-none hover:bg-cream-200/60 transition-colors">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-forest-800 focus:ring-forest-700 h-3.5 w-3.5 cursor-pointer accent-forest-800"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Search, Sort, and Summary Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-espresso-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by roast, origin, tasting notes, gear..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl text-xs sm:text-sm bg-cream-50 border border-sand-300 text-espresso-950 placeholder:text-espresso-400 focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-400 hover:text-espresso-800 p-0.5 rounded cursor-pointer"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Controls & Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-espresso-600 font-medium hidden md:inline">Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-cream-50 border border-sand-300 text-espresso-800 text-xs sm:text-sm font-medium py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-700/30 focus:border-forest-700 cursor-pointer shadow-subtle"
                aria-label="Sort products by"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stock">Stock Availability</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-espresso-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Matches Count & Clear Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-espresso-700">
              Showing <span className="text-forest-800 font-bold">{totalFilteredCount}</span> of {totalCatalogCount}
            </span>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="text-xs font-semibold text-ember-600 hover:text-ember-700 underline cursor-pointer ml-1 transition-colors"
                title="Reset all search queries and filters"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[11px] font-semibold text-espresso-500 uppercase tracking-wider">
            Active filters:
          </span>
          {activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-forest-100 text-forest-900 border border-forest-200">
              Category: <strong>{activeCategory}</strong>
              <button
                onClick={() => onSelectCategory('All')}
                className="hover:text-forest-950 p-0.5"
                aria-label={`Remove category filter ${activeCategory}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-sand-200 text-espresso-900 border border-sand-300">
              Query: <strong>"{searchTerm}"</strong>
              <button
                onClick={() => setSearchTerm('')}
                className="hover:text-espresso-950 p-0.5"
                aria-label="Remove search filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {onlyInStock && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
              In Stock Only
              <button
                onClick={() => setOnlyInStock(false)}
                className="hover:text-emerald-950 p-0.5"
                aria-label="Remove in-stock only filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {sortBy !== 'featured' && (
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-sand-200 text-espresso-900 border border-sand-300">
              Sorted by: <strong>{sortBy}</strong>
              <button
                onClick={() => setSortBy('featured')}
                className="hover:text-espresso-950 p-0.5"
                aria-label="Reset sorting"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
