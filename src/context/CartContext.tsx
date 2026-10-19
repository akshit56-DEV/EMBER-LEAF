import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { CartItem, Product, CustomerDetails, OrderConfirmation } from '../types';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { useInventory } from './InventoryContext';
import { useToast } from './ToastContext';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  lastConfirmedOrder: OrderConfirmation | null;
  setLastConfirmedOrder: (order: OrderConfirmation | null) => void;
  processDemoOrder: (customer: CustomerDetails) => OrderConfirmation | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 1500; // Free shipping over ₹1,500
const STANDARD_SHIPPING_FEE = 120; // ₹120 standard courier

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products, deductStockForOrder } = useInventory();
  const { showToast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    return loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<OrderConfirmation | null>(null);

  // Sync cart to storage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  // Reconcile cart items whenever inventory products change (e.g., stock reduced or product deleted)
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    setCartItems((prevItems) => {
      let changed = false;
      const updated: CartItem[] = [];

      for (const item of prevItems) {
        const liveProduct = products.find((p) => p.id === item.product.id);

        if (!liveProduct) {
          // Product deleted from inventory
          changed = true;
          continue;
        }

        if (liveProduct.stock <= 0) {
          // Out of stock now
          changed = true;
          continue;
        }

        if (item.quantity > liveProduct.stock) {
          // Clamped down to available stock
          changed = true;
          updated.push({
            product: liveProduct,
            quantity: liveProduct.stock,
          });
        } else {
          // Keep item, but refresh product metadata (e.g. price or name change)
          if (
            liveProduct.price !== item.product.price ||
            liveProduct.name !== item.product.name ||
            liveProduct.stock !== item.product.stock
          ) {
            changed = true;
            updated.push({
              product: liveProduct,
              quantity: item.quantity,
            });
          } else {
            updated.push(item);
          }
        }
      }

      return changed ? updated : prevItems;
    });
  }, [products]);

  const addToCart = (product: Product, quantityToAdd = 1): boolean => {
    // Check latest stock from inventory
    const liveProduct = products.find((p) => p.id === product.id) || product;

    if (liveProduct.stock <= 0) {
      showToast(`"${liveProduct.name}" is currently out of stock.`, 'warning');
      return false;
    }

    let success = true;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === liveProduct.id);
      const currentQtyInCart = existing ? existing.quantity : 0;
      const targetQty = currentQtyInCart + quantityToAdd;

      if (targetQty > liveProduct.stock) {
        const allowedQty = liveProduct.stock;
        showToast(
          `Stock limit reached: only ${liveProduct.stock} units available. Cart updated to max.`,
          'warning'
        );
        if (existing) {
          return prevItems.map((item) =>
            item.product.id === liveProduct.id ? { ...item, quantity: allowedQty } : item
          );
        } else {
          return [...prevItems, { product: liveProduct, quantity: allowedQty }];
        }
      }

      showToast(`Added ${quantityToAdd} × "${liveProduct.name}" to cart.`, 'success');

      if (existing) {
        return prevItems.map((item) =>
          item.product.id === liveProduct.id
            ? { ...item, quantity: targetQty, product: liveProduct }
            : item
        );
      } else {
        return [...prevItems, { product: liveProduct, quantity: quantityToAdd }];
      }
    });

    return success;
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeFromCart(productId);
      return;
    }

    const liveProduct = products.find((p) => p.id === productId);
    if (!liveProduct) {
      removeFromCart(productId);
      return;
    }

    const maxStock = liveProduct.stock;
    const clampedQty = Math.min(newQty, maxStock);

    if (newQty > maxStock) {
      showToast(`Maximum available stock is ${maxStock} units.`, 'warning');
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          return { ...item, quantity: clampedQty, product: liveProduct };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    const itemToRemove = cartItems.find((item) => item.product.id === productId);
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (itemToRemove) {
      showToast(`Removed "${itemToRemove.product.name}" from cart.`, 'info');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  /**
   * Completes a demo checkout order:
   * - Deducts stock from inventory once
   * - Prevents duplicate deductions using storage tracking
   * - Clears the active cart
   */
  const processDemoOrder = (customer: CustomerDetails): OrderConfirmation | null => {
    if (cartItems.length === 0) {
      showToast('Cannot complete order: your cart is empty.', 'error');
      return null;
    }

    // Double check stock availability
    for (const item of cartItems) {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (!liveProduct || liveProduct.stock < item.quantity) {
        showToast(
          `Insufficient stock for "${item.product.name}". Please update your cart before checkout.`,
          'error'
        );
        return null;
      }
    }

    // Generate unique order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `EL-${Date.now().toString().slice(-6)}-${randomSuffix}`;

    // Check processed orders registry to prevent duplicate deduction
    const processedOrders = loadFromStorage<string[]>(STORAGE_KEYS.PROCESSED_ORDERS, []);
    if (processedOrders.includes(orderId)) {
      showToast('Order was already processed.', 'warning');
      return null;
    }

    // Deduct stock in inventory
    const orderItemsForDeduction = cartItems.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    deductStockForOrder(orderItemsForDeduction);

    // Save order ID to processed list
    saveToStorage(STORAGE_KEYS.PROCESSED_ORDERS, [...processedOrders, orderId]);

    const orderConfirmation: OrderConfirmation = {
      orderId,
      items: [...cartItems],
      subtotal,
      shippingFee,
      total: totalAmount,
      customer,
      createdAt: new Date().toISOString(),
    };

    setLastConfirmedOrder(orderConfirmation);
    clearCart();
    setIsCartOpen(false);

    showToast(`Order #${orderId} confirmed successfully!`, 'success');
    return orderConfirmation;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItemsCount,
        subtotal,
        shippingFee,
        totalAmount,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingRemaining,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        processDemoOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
