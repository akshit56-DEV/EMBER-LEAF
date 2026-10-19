import React, { useState, useRef, useMemo } from 'react';
import { ToastProvider } from './context/ToastContext';
import { InventoryProvider, useInventory } from './context/InventoryContext';
import { CartProvider, useCart } from './context/CartContext';
import { ToastContainer } from './components/ToastContainer';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryFilterBar, type SortOption } from './components/CategoryFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InventoryPanel } from './components/InventoryPanel';
import { EditorialSection } from './components/EditorialSection';
import { QualityHighlights } from './components/QualityHighlights';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import type { Product, ProductCategory } from './types';
import { Sparkles, Coffee, RefreshCw } from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const { products } = useInventory();
  const { setIsCartOpen } = useCart();

  // Navigation & Filter states
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Coffee',
    'Tea',
    'Brewing Equipment',
    'Accessories',
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category check
        if (activeCategory !== 'All' && product.category !== activeCategory) {
          return false;
        }

        // Search check (name, description, flavor notes, origin)
        if (searchTerm.trim() !== '') {
          const q = searchTerm.toLowerCase().trim();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesOrigin = product.origin ? product.origin.toLowerCase().includes(q) : false;
          const matchesNotes = product.flavorNotes
            ? product.flavorNotes.some((n) => n.toLowerCase().includes(q))
            : false;
          const matchesRoast = product.roastLevel
            ? product.roastLevel.toLowerCase().includes(q)
            : false;

          if (!matchesName && !matchesDesc && !matchesOrigin && !matchesNotes && !matchesRoast) {
            return false;
          }
        }

        // In-Stock only check
        if (onlyInStock && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'stock':
            return b.stock - a.stock;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'featured':
          default:
            // Put items with badges or best sellers first
            if (a.badge && !b.badge) return -1;
            if (!a.badge && b.badge) return 1;
            return 0;
        }
      });
  }, [products, activeCategory, searchTerm, sortBy, onlyInStock]);

  // Featured curations (e.g. Best Sellers or Limited Harvest)
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.badge === 'Best Seller' || p.badge === 'Limited Harvest').slice(0, 4);
  }, [products]);

  const handleClearFilters = () => {
    setActiveCategory('All');
    setSearchTerm('');
    setSortBy('featured');
    setOnlyInStock(false);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('brand-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusSearch = () => {
    scrollToCatalog();
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-espresso-900 selection:bg-ember-100 selection:text-espresso-950">
      {/* 1. Announcement Bar */}
      <AnnouncementBar onExploreClick={scrollToCatalog} />

      {/* 2. Responsive Header / Navbar */}
      <Navbar
        onOpenInventory={() => setIsInventoryOpen(true)}
        onSelectCategory={setActiveCategory}
        activeCategory={activeCategory}
        onSearchFocus={handleFocusSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* 3. Hero Section */}
      <HeroSection onExploreClick={scrollToCatalog} onStoryClick={scrollToStory} />

      {/* Featured Micro-Lot Highlight Strip (if viewing all and no search query) */}
      {activeCategory === 'All' && searchTerm.trim() === '' && featuredProducts.length > 0 && (
        <section className="py-12 bg-cream-200/40 border-b border-sand-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-ember-500" />
                <h3 className="font-serif text-xl font-bold text-espresso-950">
                  Featured Seasonal Reserves
                </h3>
                <span className="text-xs text-espresso-600 hidden sm:inline">
                  • Hand-cupped by our head roasters
                </span>
              </div>
              <button
                onClick={scrollToCatalog}
                className="text-xs font-semibold text-forest-800 hover:text-forest-950 underline cursor-pointer"
              >
                View all offerings ({products.length})
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`feat-${product.id}`}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Main Product Catalog & Filter Grid */}
      <main id="catalog-section" className="flex-1 py-16 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800">
              Direct-Trade Collection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
              The Harvest &amp; Roastery Catalog
            </h2>
            <p className="text-sm text-espresso-600 font-light leading-relaxed">
              Every bean, leaf, and brewing tool selected for origin purity and sensory elegance.
            </p>
          </div>

          {/* Interactive Filters Bar */}
          <CategoryFilterBar
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onlyInStock={onlyInStock}
            setOnlyInStock={setOnlyInStock}
            totalFilteredCount={filteredProducts.length}
            totalCatalogCount={products.length}
            onClearFilters={handleClearFilters}
            searchInputRef={searchInputRef}
          />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20 px-4 bg-cream-50 rounded-3xl border border-sand-300 max-w-xl mx-auto space-y-4 shadow-subtle">
              <div className="w-14 h-14 rounded-full bg-sand-200 flex items-center justify-center text-espresso-400 mx-auto">
                <Coffee className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-espresso-950">
                  No handcrafted offerings matched your criteria
                </h3>
                <p className="text-xs text-espresso-600 leading-relaxed">
                  We couldn't find items matching "{searchTerm || activeCategory}". Try broadening your search or resetting the active filters.
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-forest-900 text-cream-50 text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 5. Brand Story & Editorial Section */}
      <EditorialSection />

      {/* 6. Sourcing & Quality Highlights */}
      <QualityHighlights />

      {/* 7. Newsletter Section */}
      <NewsletterSection />

      {/* 8. Footer */}
      <Footer
        onSelectCategory={setActiveCategory}
        onOpenInventory={() => setIsInventoryOpen(true)}
      />

      {/* Modal Dialogs & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onExploreCatalog={scrollToCatalog}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onContinueShopping={() => {
          setIsCheckoutOpen(false);
          scrollToCatalog();
        }}
      />

      <InventoryPanel
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <InventoryProvider>
        <CartProvider>
          <StorefrontContent />
        </CartProvider>
      </InventoryProvider>
    </ToastProvider>
  );
};

export default App;
