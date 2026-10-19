import React, { useState } from 'react';
import { ShoppingBag, Search, SlidersHorizontal, Menu, X, Coffee, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useInventory } from '../context/InventoryContext';
import type { ProductCategory } from '../types';

interface NavbarProps {
  onOpenInventory: () => void;
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  activeCategory: ProductCategory | 'All';
  onSearchFocus: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInventory,
  onSelectCategory,
  activeCategory,
  onSearchFocus,
  searchTerm,
  setSearchTerm,
}) => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { lowStockCount, outOfStockCount, totalProducts } = useInventory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Coffee',
    'Tea',
    'Brewing Equipment',
    'Accessories',
  ];

  const handleCategoryClick = (cat: ProductCategory | 'All') => {
    onSelectCategory(cat);
    setMobileMenuOpen(false);
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-sand-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-espresso-800 hover:text-espresso-950 hover:bg-cream-200/60 rounded-lg transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo & Treatment */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              aria-label="EMBER & LEAF home"
            >
              {/* Monogram emblem */}
              <div className="w-10 h-10 rounded-xl bg-forest-900 flex items-center justify-center text-cream-100 shadow-sm transition-transform group-hover:scale-105 border border-forest-800">
                <span className="font-serif font-bold text-lg tracking-wider text-ember-500">
                  E<span className="text-cream-100 font-sans text-xs -ml-0.5">&amp;</span>L
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-espresso-900 group-hover:text-forest-900 transition-colors">
                  EMBER &amp; LEAF
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium tracking-widest uppercase text-espresso-600/80 -mt-0.5">
                  Artisanal Coffee &amp; Tea • Est. 2024
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main navigation">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-forest-900 text-cream-50 shadow-sm'
                      : 'text-espresso-700 hover:text-espresso-950 hover:bg-cream-200/70'
                  }`}
                >
                  {cat === 'All' ? 'All Offerings' : cat}
                </button>
              );
            })}
            <button
              onClick={() => scrollToSection('brand-story')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide text-espresso-700 hover:text-espresso-950 hover:bg-cream-200/70 transition-all cursor-pointer"
            >
              Our Story
            </button>
          </nav>

          {/* Right Header Controls: Search, Inventory Admin, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Inline search or expandable search */}
            <div className="relative">
              {isSearchVisible ? (
                <div className="flex items-center bg-cream-50 border border-sand-300 rounded-full px-3 py-1.5 shadow-inner transition-all w-48 sm:w-64">
                  <Search className="w-4 h-4 text-espresso-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search coffees, teas, gear..."
                    className="w-full bg-transparent text-xs text-espresso-900 placeholder:text-espresso-400 focus:outline-none"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-espresso-400 hover:text-espresso-800 p-0.5"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsSearchVisible(false)}
                    className="ml-1 text-espresso-400 hover:text-espresso-800 p-0.5"
                    aria-label="Close search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsSearchVisible(true);
                    onSearchFocus();
                  }}
                  className="p-2.5 text-espresso-700 hover:text-espresso-950 hover:bg-cream-200/60 rounded-full transition-colors cursor-pointer"
                  aria-label="Search products"
                  title="Search catalog"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Inventory Management Button */}
            <button
              onClick={onOpenInventory}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-cream-200/80 hover:bg-sand-200 border border-sand-300 text-espresso-800 hover:text-espresso-950 transition-all cursor-pointer shadow-subtle group"
              aria-label="Open Inventory Management Workspace"
              title="Open Stock & Inventory Panel"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700 group-hover:rotate-45 transition-transform" />
              <span className="hidden md:inline">Inventory</span>
              <span className="px-1.5 py-0.2 text-[10px] bg-forest-900 text-cream-50 font-bold rounded-full">
                {totalProducts}
              </span>
              {(lowStockCount > 0 || outOfStockCount > 0) && (
                <span
                  className="w-2 h-2 rounded-full bg-amber-500 animate-pulse absolute -top-0.5 -right-0.5"
                  title={`${lowStockCount} low stock, ${outOfStockCount} out of stock`}
                />
              )}
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-forest-900 text-cream-50 hover:bg-forest-800 transition-all cursor-pointer shadow-sm group focus:outline-none focus:ring-2 focus:ring-forest-700 focus:ring-offset-2 focus:ring-offset-cream-100"
              aria-label={`Shopping cart with ${totalItemsCount} items`}
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-ember-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-cream-100 animate-in zoom-in duration-200">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-sand-200 bg-cream-50 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-espresso-400">
              Categories
            </p>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-forest-900 text-cream-50 font-semibold'
                    : 'text-espresso-800 hover:bg-cream-200'
                }`}
              >
                {cat === 'All' ? 'All Handcrafted Offerings' : cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-sand-200 space-y-1">
            <button
              onClick={() => scrollToSection('brand-story')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-espresso-800 hover:bg-cream-200"
            >
              Our Philosophy &amp; Sourcing
            </button>
            <button
              onClick={() => scrollToSection('brew-highlights')}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-espresso-800 hover:bg-cream-200"
            >
              The 4 Pillars of Craft
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInventory();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium bg-sand-100 text-forest-900"
            >
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-forest-700" />
                <span>Inventory Management Panel</span>
              </span>
              <span className="text-xs bg-forest-900 text-cream-50 px-2 py-0.5 rounded-full font-bold">
                {totalProducts} SKUs
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
