import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { CustomerDetails, OrderConfirmation } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import { X, CheckCircle2, ShieldAlert, Sparkles, ShoppingBag, ArrowRight, PackageCheck, Printer } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onContinueShopping,
}) => {
  const {
    cartItems,
    subtotal,
    shippingFee,
    totalAmount,
    processDemoOrder,
    lastConfirmedOrder,
    setLastConfirmedOrder,
  } = useCart();

  const [formData, setFormData] = useState<CustomerDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerDetails, string>> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 letters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = formData.phone.replace(/[\s-]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number (e.g. 9876543210).';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      newErrors.address = 'Please provide your complete shipping street address.';
    }

    if (!formData.city.trim() || formData.city.trim().length < 2) {
      newErrors.city = 'Please specify your delivery city.';
    }

    const pincodeRegex = /^\d{6}$/;
    if (!formData.pincode.trim() || !pincodeRegex.test(formData.pincode.trim())) {
      newErrors.pincode = 'Please enter a valid 6-digit postal PIN code.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate small network delay for realism
    setTimeout(() => {
      const order = processDemoOrder(formData);
      setIsSubmitting(false);
      if (!order) {
        // Stock error or empty cart handled in context
      }
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCloseAndReset = () => {
    setLastConfirmedOrder(null);
    onClose();
    onContinueShopping();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-espresso-950/75 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-cream-50 w-full max-w-3xl rounded-3xl border border-sand-300 shadow-modal overflow-hidden animate-in zoom-in-95 duration-200 my-8"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-sand-200 bg-cream-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center font-serif font-bold text-lg">
              E&amp;L
            </div>
            <div>
              <h2 id="checkout-modal-title" className="font-serif text-xl font-bold text-espresso-950">
                {lastConfirmedOrder ? 'Demo Order Confirmed' : 'Artisanal Demo Checkout'}
              </h2>
              <span className="text-xs text-espresso-600 font-medium">
                EMBER &amp; LEAF Specialty Roastery • Bengaluru
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-espresso-600 hover:text-espresso-950 hover:bg-cream-200 transition-colors cursor-pointer"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="bg-amber-100/90 border-b border-amber-200 px-5 py-3 flex items-start gap-3 text-xs text-amber-950">
          <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Interactive Demonstration:</strong> No real payment or credit card is processed.
            Confirming this order will securely deduct stock once from your live browser inventory.
          </div>
        </div>

        {/* Modal Body: Either Confirmation Receipt OR Checkout Form */}
        {lastConfirmedOrder ? (
          /* Confirmation Receipt Screen */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-espresso-950">
                Brewing Your Harvest!
              </h3>
              <p className="text-xs sm:text-sm text-espresso-600 max-w-md mx-auto">
                Thank you, <strong>{lastConfirmedOrder.customer.fullName}</strong>. Your artisanal order has been recorded in this browser session.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 text-forest-900 font-mono text-xs font-bold border border-forest-200">
                <span>Order Reference:</span>
                <span className="tracking-wider">{lastConfirmedOrder.orderId}</span>
              </div>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-cream-100 rounded-2xl border border-sand-300 p-5 space-y-4">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-sand-200">
                <span className="text-espresso-500 font-medium">
                  Placed on {formatDate(lastConfirmedOrder.createdAt)}
                </span>
                <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Confirmed (Demo Paid)
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-espresso-500 block">
                  Items in this Roast Batch:
                </span>
                {lastConfirmedOrder.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between items-center text-xs text-espresso-800">
                    <span className="font-medium">
                      {quantity} × {product.name} {product.weightOrSize && `(${product.weightOrSize})`}
                    </span>
                    <span className="font-serif font-bold text-espresso-950">
                      {formatINR(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-3 border-t border-sand-200 space-y-1.5 text-xs text-espresso-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(lastConfirmedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span>
                    {lastConfirmedOrder.shippingFee === 0 ? 'Complimentary' : formatINR(lastConfirmedOrder.shippingFee)}
                  </span>
                </div>
                <div className="pt-2 border-t border-sand-300 flex justify-between text-sm font-bold text-espresso-950">
                  <span className="font-serif">Total Amount</span>
                  <span className="font-serif text-base text-forest-900">
                    {formatINR(lastConfirmedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="pt-3 border-t border-sand-200 text-xs text-espresso-700 space-y-1">
                <span className="font-semibold text-espresso-900 block">Dispatch Destination:</span>
                <p>
                  {lastConfirmedOrder.customer.address}, {lastConfirmedOrder.customer.city} —{' '}
                  {lastConfirmedOrder.customer.pincode}
                </p>
                <p>
                  Contact: {lastConfirmedOrder.customer.phone} • {lastConfirmedOrder.customer.email}
                </p>
                {lastConfirmedOrder.customer.notes && (
                  <p className="italic text-espresso-500">
                    Brewing Note: "{lastConfirmedOrder.customer.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleCloseAndReset}
                className="flex-1 py-3 px-6 rounded-full bg-forest-900 text-cream-50 font-semibold text-xs sm:text-sm hover:bg-forest-800 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Continue Browsing Catalog</span>
                <ArrowRight className="w-4 h-4 text-ember-400" />
              </button>
              <button
                onClick={handlePrint}
                className="py-3 px-5 rounded-full bg-cream-50 text-espresso-800 font-semibold text-xs sm:text-sm hover:bg-cream-200 border border-sand-300 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Customer Form & Order Summary */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Customer Form Fields */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="font-serif text-base font-bold text-espresso-950 pb-1 border-b border-sand-200">
                  1. Dispatch &amp; Contact Details
                </h3>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ananya Sharma"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                      errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                    } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                  />
                  {errors.fullName && (
                    <span className="text-[11px] text-red-600 font-medium mt-1 block">
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ananya@example.com"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                        errors.email ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                      } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                    />
                    {errors.email && (
                      <span className="text-[11px] text-red-600 font-medium mt-1 block">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      Phone Number <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="9876543210"
                      maxLength={10}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                        errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                      } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                    />
                    {errors.phone && (
                      <span className="text-[11px] text-red-600 font-medium mt-1 block">
                        {errors.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 mb-1">
                    Street Address &amp; Apartment <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat 402, Green Glen Layout, Bellandur"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                      errors.address ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                    } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                  />
                  {errors.address && (
                    <span className="text-[11px] text-red-600 font-medium mt-1 block">
                      {errors.address}
                    </span>
                  )}
                </div>

                {/* City & PIN Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Bengaluru"
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                        errors.city ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                      } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                    />
                    {errors.city && (
                      <span className="text-[11px] text-red-600 font-medium mt-1 block">
                        {errors.city}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso-800 mb-1">
                      PIN Code (6 digits) <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="560103"
                      maxLength={6}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border ${
                        errors.pincode ? 'border-red-500 focus:ring-red-200' : 'border-sand-300 focus:border-forest-700'
                      } focus:outline-none focus:ring-2 focus:ring-forest-700/20`}
                    />
                    {errors.pincode && (
                      <span className="text-[11px] text-red-600 font-medium mt-1 block">
                        {errors.pincode}
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Brew Notes */}
                <div>
                  <label className="block text-xs font-semibold text-espresso-800 mb-1">
                    Special Roasting / Grind Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Coarse grind for French Press / Leave gift note"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-cream-50 border border-sand-300 focus:border-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Column: Order Summary Preview */}
              <div className="md:col-span-5 space-y-4">
                <h3 className="font-serif text-base font-bold text-espresso-950 pb-1 border-b border-sand-200">
                  2. Order Summary
                </h3>

                <div className="bg-cream-100 rounded-2xl border border-sand-300 p-4 space-y-3">
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {cartItems.map(({ product, quantity }) => (
                      <div key={product.id} className="flex justify-between items-center text-xs">
                        <div className="truncate mr-2">
                          <span className="font-medium text-espresso-950 block truncate">
                            {product.name}
                          </span>
                          <span className="text-espresso-500 text-[11px]">Qty: {quantity}</span>
                        </div>
                        <span className="font-serif font-bold text-espresso-900 flex-shrink-0">
                          {formatINR(product.price * quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-sand-200 space-y-1.5 text-xs text-espresso-700">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-espresso-950 font-semibold">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-emerald-700 font-bold uppercase text-[11px]">
                            FREE
                          </span>
                        ) : (
                          formatINR(shippingFee)
                        )}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-sand-300 flex justify-between text-sm font-bold text-espresso-950">
                      <span className="font-serif">Total</span>
                      <span className="font-serif text-base text-forest-900">
                        {formatINR(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Demo Payment Method Pill */}
                <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-xs text-forest-900 flex items-start gap-2.5">
                  <PackageCheck className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Simulated Cash on Delivery / Demo Card</span>
                    <p className="text-[11px] text-forest-800">
                      Zero credentials requested. Inventory will be decremented upon clicking submit.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-sand-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-espresso-700 hover:bg-cream-200 transition-colors cursor-pointer"
              >
                Back to Bag
              </button>
              <button
                type="submit"
                disabled={isSubmitting || cartItems.length === 0}
                className="px-7 py-3 rounded-full bg-forest-900 text-cream-50 font-semibold text-xs sm:text-sm hover:bg-forest-800 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <span>Processing Demo Order...</span>
                ) : (
                  <>
                    <span>Confirm Demo Order • {formatINR(totalAmount)}</span>
                    <ArrowRight className="w-4 h-4 text-ember-400" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
