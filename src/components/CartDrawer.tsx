import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
  onExploreCatalog: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout, onExploreCatalog }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItemsCount,
    subtotal,
    shippingFee,
    totalAmount,
    freeShippingThreshold,
    freeShippingRemaining,
  } = useCart();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCartOpen(false);
    };
    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-espresso-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart Drawer"
      onClick={() => setIsCartOpen(false)}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-screen max-w-md bg-cream-50 border-l border-sand-300 shadow-modal flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-sand-200 bg-cream-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-forest-900 text-cream-50 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-ember-400" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-espresso-950">Your Tasting Bag</h2>
                <span className="text-xs text-espresso-600 font-medium">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-espresso-500 hover:text-red-700 underline font-medium cursor-pointer transition-colors"
                >
                  Clear Bag
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full text-espresso-600 hover:text-espresso-950 hover:bg-cream-200 transition-colors cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cartItems.length > 0 && (
            <div className="px-5 py-3 bg-forest-50/80 border-b border-forest-100">
              <div className="flex items-center justify-between text-xs text-forest-950 mb-1.5 font-medium">
                {freeShippingRemaining === 0 ? (
                  <span className="flex items-center gap-1.5 font-bold text-forest-800">
                    <Sparkles className="w-3.5 h-3.5 text-ember-500" />
                    You unlocked Complimentary Express Delivery!
                  </span>
                ) : (
                  <span>
                    Add <strong>{formatINR(freeShippingRemaining)}</strong> more for free delivery
                  </span>
                )}
                <span className="font-bold text-[11px] text-forest-700">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-forest-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-700 transition-all duration-500 rounded-full"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Item List / Empty State */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sand-200 flex items-center justify-center text-espresso-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-espresso-950">Your bag is empty</h3>
                  <p className="text-xs text-espresso-600 max-w-xs leading-relaxed">
                    Discover freshly roasted single-origins, seasonal whole-leaf teas, and precision brewing gear.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onExploreCatalog();
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest-900 text-cream-50 text-xs font-semibold hover:bg-forest-800 transition-all cursor-pointer shadow-sm"
                >
                  <span>Explore Harvest Offerings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cartItems.map(({ product, quantity }) => {
                  const maxStock = product.stock;
                  const isMaxStockReached = quantity >= maxStock;

                  return (
                    <div
                      key={product.id}
                      className="flex gap-3.5 p-3 rounded-2xl bg-cream-100/90 border border-sand-200 transition-all hover:border-sand-300"
                    >
                      {/* Image Thumbnail */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-sand-200 flex-shrink-0"
                      />

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-serif text-sm font-bold text-espresso-950 truncate">
                              {product.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="text-espresso-400 hover:text-red-600 p-1 transition-colors cursor-pointer"
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[11px] text-espresso-600 font-medium block">
                            {formatINR(product.price)} each {product.weightOrSize && `• ${product.weightOrSize}`}
                          </span>
                        </div>

                        {/* Quantity and Line Total */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center bg-cream-50 rounded-full border border-sand-300 px-1 py-0.5 shadow-inner">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-espresso-700 hover:bg-cream-200 transition-colors cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs text-espresso-950">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              disabled={isMaxStockReached}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-espresso-700 hover:bg-cream-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="font-serif font-bold text-sm text-espresso-950">
                              {formatINR(product.price * quantity)}
                            </span>
                            {isMaxStockReached && (
                              <span className="block text-[10px] text-amber-700 font-medium">
                                Max available: {maxStock}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-sand-200 bg-cream-100 space-y-4">
              <div className="space-y-1.5 text-xs text-espresso-700 font-medium">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-espresso-950 font-semibold">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                        FREE
                      </span>
                    ) : (
                      formatINR(shippingFee)
                    )}
                  </span>
                </div>
                <div className="pt-2 border-t border-sand-300/80 flex justify-between text-sm font-bold text-espresso-950">
                  <span className="font-serif text-base">Estimated Total</span>
                  <span className="font-serif text-lg text-forest-900">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-full bg-forest-900 text-cream-50 font-semibold text-sm hover:bg-forest-800 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-4 h-4 text-ember-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>Simulated demo checkout • No real payment or cards required</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
