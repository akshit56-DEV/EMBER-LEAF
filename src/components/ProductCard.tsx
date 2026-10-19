import React, { useState } from 'react';
import type { Product } from '../types';
import { formatINR, DEFAULT_CATEGORY_FALLBACKS } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Eye, AlertTriangle, Sparkles, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart } = useCart();
  const [imageSrc, setImageSrc] = useState(product.image);
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    setIsAdding(true);
    addToCart(product, 1);

    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const handleImageError = () => {
    // Fallback to curated category image if external link is broken
    const fallback = DEFAULT_CATEGORY_FALLBACKS[product.category] || DEFAULT_CATEGORY_FALLBACKS.Coffee;
    if (imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <article
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col bg-cream-50 rounded-2xl border border-sand-300/80 shadow-subtle hover:shadow-card hover:border-sand-400 transition-all duration-300 overflow-hidden cursor-pointer"
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(product);
        }
      }}
      aria-label={`View details for ${product.name}`}
    >
      {/* Top Image & Floating Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-sand-200">
        <img
          src={imageSrc}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-70' : ''
          }`}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-forest-900 text-cream-50 shadow-sm border border-forest-800">
              <Sparkles className="w-3 h-3 text-ember-400" />
              <span>{product.badge}</span>
            </span>
          )}

          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-900/95 text-red-100 shadow-sm border border-red-800">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide bg-amber-900/90 text-amber-100 shadow-sm border border-amber-700/80">
              <AlertTriangle className="w-3 h-3 text-amber-300" />
              <span>Only {product.stock} left</span>
            </span>
          ) : null}
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-50/95 text-espresso-900 text-xs font-semibold shadow-md border border-sand-300">
            <Eye className="w-3.5 h-3.5 text-forest-700" />
            <span>Quick View</span>
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-5 justify-between">
        <div className="space-y-2">
          {/* Category & Origin */}
          <div className="flex items-center justify-between text-xs text-espresso-600 font-medium">
            <span className="text-forest-700 font-semibold tracking-wide uppercase text-[11px]">
              {product.category}
            </span>
            {product.weightOrSize && (
              <span className="text-espresso-500 text-[11px] bg-sand-200/80 px-2 py-0.5 rounded">
                {product.weightOrSize}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-espresso-950 group-hover:text-forest-900 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-espresso-700 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Flavor Notes tags */}
          {product.flavorNotes && product.flavorNotes.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {product.flavorNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-sand-200/70 text-espresso-800 border border-sand-300/60"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action Button Footer */}
        <div className="pt-5 mt-4 border-t border-sand-200 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-espresso-500 block">
              Price (incl. taxes)
            </span>
            <span className="font-serif text-xl font-bold text-espresso-950">
              {formatINR(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isAdding}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-sm ${
              isOutOfStock
                ? 'bg-sand-200 text-espresso-400 cursor-not-allowed border border-sand-300'
                : isAdding
                ? 'bg-forest-700 text-cream-50 scale-95'
                : 'bg-forest-900 text-cream-50 hover:bg-forest-800 active:scale-95'
            }`}
            aria-label={isOutOfStock ? `${product.name} is out of stock` : `Add ${product.name} to cart`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
