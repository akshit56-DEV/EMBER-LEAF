import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { formatINR, DEFAULT_CATEGORY_FALLBACKS } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { X, ShoppingBag, Plus, Minus, AlertTriangle, Coffee, Sparkles, Check, Compass, Flame } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, cartItems } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageSrc, setImageSrc] = useState(product?.image || '');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setImageSrc(product.image);
      setIsAdded(false);
    }
  }, [product]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxAvailable = product.stock;

  // Check how many are already in cart
  const itemInCart = cartItems.find((item) => item.product.id === product.id);
  const alreadyInCart = itemInCart ? itemInCart.quantity : 0;
  const remainingCanAdd = Math.max(0, maxAvailable - alreadyInCart);

  const handleIncrement = () => {
    if (quantity < remainingCanAdd) {
      setQuantity((q) => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const handleAddToCart = () => {
    if (isOutOfStock || remainingCanAdd <= 0) return;
    const ok = addToCart(product, quantity);
    if (ok) {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }
  };

  const handleImageError = () => {
    const fallback = DEFAULT_CATEGORY_FALLBACKS[product.category] || DEFAULT_CATEGORY_FALLBACKS.Coffee;
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-espresso-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-cream-50 w-full max-w-4xl rounded-3xl border border-sand-300 shadow-modal overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-cream-100/90 text-espresso-700 hover:text-espresso-950 hover:bg-cream-200 transition-colors shadow-sm cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-sand-200 min-h-[260px] md:min-h-full">
          <img
            src={imageSrc}
            alt={product.name}
            onError={handleImageError}
            className={`w-full h-full object-cover object-center ${
              isOutOfStock ? 'grayscale opacity-75' : ''
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/40 via-transparent to-transparent md:hidden" />

          {/* Badges on image */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-900 text-cream-50 shadow border border-forest-800">
                <Sparkles className="w-3.5 h-3.5 text-ember-400" />
                <span>{product.badge}</span>
              </span>
            )}
            {isOutOfStock ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-900 text-red-100 shadow border border-red-800">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-amber-900/90 text-amber-100 shadow border border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                <span>Only {product.stock} units in stock</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[85vh]">
          <div className="space-y-5">
            {/* Category & Weight */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-forest-800">
                {product.category}
              </span>
              {product.weightOrSize && (
                <span className="text-xs font-medium text-espresso-600 bg-sand-200/90 px-2.5 py-0.5 rounded-full">
                  {product.weightOrSize}
                </span>
              )}
            </div>

            {/* Title */}
            <h2 id="modal-product-title" className="font-serif text-2xl sm:text-3xl font-bold text-espresso-950 leading-tight">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-espresso-950">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-espresso-500 font-medium">Inclusive of all taxes</span>
            </div>

            {/* Description */}
            <p className="text-sm text-espresso-800 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Origin & Roast info if present */}
            {(product.origin || product.roastLevel) && (
              <div className="p-3.5 rounded-xl bg-sand-100 border border-sand-300/80 space-y-2 text-xs">
                {product.origin && (
                  <div className="flex items-start gap-2 text-espresso-800">
                    <Compass className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-espresso-950">Origin:</strong> {product.origin}
                    </span>
                  </div>
                )}
                {product.roastLevel && (
                  <div className="flex items-start gap-2 text-espresso-800">
                    <Flame className="w-4 h-4 text-ember-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-semibold text-espresso-950">Profile:</strong> {product.roastLevel}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Flavor Notes */}
            {product.flavorNotes && product.flavorNotes.length > 0 && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-espresso-500 block mb-2">
                  Tasting &amp; Sensory Notes
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.flavorNotes.map((note, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-sand-200 text-espresso-900 border border-sand-300"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Brew Guide */}
            {product.brewGuide && (
              <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-200 text-xs text-forest-950">
                <span className="font-bold flex items-center gap-1.5 text-forest-900 mb-1">
                  <Coffee className="w-3.5 h-3.5 text-forest-700" />
                  Recommended Brew Protocol
                </span>
                <p className="text-forest-900/90 leading-relaxed">{product.brewGuide}</p>
              </div>
            )}

            {/* Already in cart notice */}
            {alreadyInCart > 0 && (
              <p className="text-xs text-forest-800 font-medium">
                You currently have <strong>{alreadyInCart}</strong> of this item in your cart.
              </p>
            )}
          </div>

          {/* Bottom Actions: Quantity Selector & Add Button */}
          <div className="pt-6 mt-6 border-t border-sand-200 space-y-3">
            <div className="flex items-center gap-4">
              {/* Quantity controls */}
              <div className="flex items-center bg-sand-200 rounded-full border border-sand-300 p-1">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-espresso-800 hover:bg-cream-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-espresso-950" aria-live="polite">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= remainingCanAdd || isOutOfStock}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-espresso-800 hover:bg-cream-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock || remainingCanAdd <= 0}
                className={`flex-1 py-3 px-6 rounded-full font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isOutOfStock || remainingCanAdd <= 0
                    ? 'bg-sand-300 text-espresso-400 cursor-not-allowed border border-sand-400'
                    : isAdded
                    ? 'bg-forest-800 text-cream-50'
                    : 'bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-98'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : isOutOfStock ? (
                  <span>Item Out of Stock</span>
                ) : remainingCanAdd <= 0 ? (
                  <span>Max Stock Reached in Cart</span>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add {quantity} to Cart • {formatINR(product.price * quantity)}</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-espresso-500">
              Hand-packaged in biodegradable airtight pouch. Roasted weekly in small batches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
