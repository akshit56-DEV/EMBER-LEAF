import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { useToast } from './ToastContext';

interface InventoryContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  deductStockForOrder: (orderItems: { productId: string; quantity: number }[]) => boolean;
  resetToDefaults: () => void;
  // Metrics
  totalProducts: number;
  totalUnitsInStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalStockValue: number;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>(() => {
    return loadFromStorage<Product[]>(STORAGE_KEYS.INVENTORY, INITIAL_PRODUCTS);
  });

  // Sync to localStorage whenever products change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.INVENTORY, products);
  }, [products]);

  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const id = `el-custom-${Date.now()}`;
    const newProduct: Product = {
      ...newProductData,
      id,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" added to inventory catalog.`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        return item;
      })
    );
    showToast('Product details updated successfully.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
    if (target) {
      showToast(`Removed "${target.name}" from inventory.`, 'info');
    }
  };

  const updateStock = (id: string, newStock: number) => {
    const safeStock = Math.max(0, Math.floor(newStock));
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, stock: safeStock };
        }
        return item;
      })
    );
    showToast(`Stock level adjusted to ${safeStock} units.`, 'info');
  };

  /**
   * Safely deducts inventory for a confirmed checkout order
   */
  const deductStockForOrder = (orderItems: { productId: string; quantity: number }[]): boolean => {
    setProducts((prev) => {
      return prev.map((product) => {
        const orderItem = orderItems.find((item) => item.productId === product.id);
        if (orderItem) {
          const newStock = Math.max(0, product.stock - orderItem.quantity);
          return {
            ...product,
            stock: newStock,
          };
        }
        return product;
      });
    });
    return true;
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    saveToStorage(STORAGE_KEYS.INVENTORY, INITIAL_PRODUCTS);
    showToast('Inventory reset to default demonstration catalog.', 'info');
  };

  // Metrics
  const totalProducts = products.length;
  const totalUnitsInStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const totalStockValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  return (
    <InventoryContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        deductStockForOrder,
        resetToDefaults,
        totalProducts,
        totalUnitsInStock,
        lowStockCount,
        outOfStockCount,
        totalStockValue,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
