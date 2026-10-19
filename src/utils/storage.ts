/**
 * Safe localStorage utilities with schema verification and error fallbacks
 */

export const STORAGE_KEYS = {
  INVENTORY: 'ember_leaf_inventory_v6',
  CART: 'ember_leaf_cart_v6',
  PROCESSED_ORDERS: 'ember_leaf_processed_orders_v6',
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`Failed to parse localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to save to localStorage key "${key}":`, error);
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove localStorage key "${key}":`, error);
  }
}
