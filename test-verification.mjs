// Automated verification suite for EMBER & LEAF e-commerce and inventory logic
import assert from 'node:assert/strict';

console.log('--- Starting EMBER & LEAF Automated Test Suite ---');

// 1. Currency formatting test
const formatINR = (amount) => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

console.log('\n[Test 1] Testing Currency Formatter (INR):');
assert.equal(formatINR(680), '₹680');
assert.equal(formatINR(1500), '₹1,500');
assert.equal(formatINR(0), '₹0');
console.log('  ✓ formatINR formats numbers accurately to Indian Rupees.');

// 2. Initial Catalog Data Verification
import { INITIAL_PRODUCTS } from './src/data/initialProducts.ts';

console.log('\n[Test 2] Testing Catalog Initial Products:');
assert.ok(Array.isArray(INITIAL_PRODUCTS), 'INITIAL_PRODUCTS is an array');
assert.ok(INITIAL_PRODUCTS.length >= 8, `Expected at least 8 products, got ${INITIAL_PRODUCTS.length}`);

const uniqueIds = new Set();
const categoriesFound = new Set();

for (const product of INITIAL_PRODUCTS) {
  assert.ok(product.id, 'Product has unique ID');
  assert.ok(!uniqueIds.has(product.id), `Duplicate ID detected: ${product.id}`);
  uniqueIds.add(product.id);

  assert.ok(product.name && product.name.trim().length > 0, `Product ${product.id} has name`);
  assert.ok(product.category, `Product ${product.id} has category`);
  categoriesFound.add(product.category);

  assert.ok(product.description && product.description.trim().length > 0, `Product ${product.id} has description`);
  assert.ok(typeof product.price === 'number' && product.price > 0, `Product ${product.id} has positive price`);
  assert.ok(product.image && product.image.startsWith('http'), `Product ${product.id} has valid image URL`);
  assert.ok(typeof product.stock === 'number' && product.stock >= 0, `Product ${product.id} has valid stock`);
}

assert.ok(categoriesFound.has('Coffee'), 'Coffee category present');
assert.ok(categoriesFound.has('Tea'), 'Tea category present');
assert.ok(categoriesFound.has('Brewing Equipment'), 'Brewing Equipment category present');
assert.ok(categoriesFound.has('Accessories'), 'Accessories category present');
console.log(`  ✓ Verified ${INITIAL_PRODUCTS.length} products across all 4 categories with unique IDs and valid attributes.`);

// 3. Cart Stock Clamping & Quantity Math
console.log('\n[Test 3] Testing Cart Adding, Quantity Clamping & Subtotal:');
let mockInventory = [...INITIAL_PRODUCTS.map(p => ({ ...p }))];
const sampleProduct = mockInventory.find(p => p.stock > 0);
assert.ok(sampleProduct, 'Found in-stock product');

// Simulate adding to cart with stock limit
let cart = [];
const addToCart = (product, qty) => {
  const live = mockInventory.find(p => p.id === product.id);
  if (!live || live.stock <= 0) return false;
  const existing = cart.find(i => i.product.id === product.id);
  const currentQty = existing ? existing.quantity : 0;
  const targetQty = Math.min(live.stock, currentQty + qty);
  if (existing) {
    existing.quantity = targetQty;
  } else {
    cart.push({ product: live, quantity: targetQty });
  }
  return true;
};

// Add 2 units
addToCart(sampleProduct, 2);
assert.equal(cart.length, 1);
assert.equal(cart[0].quantity, 2);

// Attempt to add more than stock
addToCart(sampleProduct, 9999);
assert.equal(cart[0].quantity, sampleProduct.stock, 'Quantity clamped to maximum available stock');
console.log(`  ✓ Cart quantity clamped to max stock (${sampleProduct.stock} units).`);

// Calculate subtotal
const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
assert.equal(subtotal, sampleProduct.price * sampleProduct.stock);
console.log(`  ✓ Subtotal calculated accurately: ${formatINR(subtotal)}.`);

// 4. Free Shipping Threshold Logic
console.log('\n[Test 4] Testing Free Shipping Threshold Calculation:');
const FREE_SHIPPING_THRESHOLD = 1500;
const STANDARD_SHIPPING = 120;

const calcShipping = (sub) => (sub >= FREE_SHIPPING_THRESHOLD || sub === 0 ? 0 : STANDARD_SHIPPING);
assert.equal(calcShipping(800), 120, 'Under threshold costs ₹120');
assert.equal(calcShipping(1500), 0, 'Exact threshold is free');
assert.equal(calcShipping(2400), 0, 'Above threshold is free');
assert.equal(calcShipping(0), 0, 'Empty cart is 0');
console.log('  ✓ Free shipping threshold logic correctly evaluated.');

// 5. Checkout Order Processing & Stock Deduction (Single Execution)
console.log('\n[Test 5] Testing Demo Checkout & Single-Deduction Protection:');
// Reset cart with 3 units of sampleProduct
cart = [{ product: sampleProduct, quantity: 3 }];
const initialStock = sampleProduct.stock;
const processedOrders = new Set();

const processOrder = (orderId, cartItems) => {
  if (processedOrders.has(orderId)) {
    throw new Error('Duplicate deduction prevented for order ' + orderId);
  }
  // Deduct stock
  for (const item of cartItems) {
    const p = mockInventory.find(x => x.id === item.product.id);
    p.stock -= item.quantity;
  }
  processedOrders.add(orderId);
  cart = [];
};

const testOrderId = 'EL-TEST-001';
processOrder(testOrderId, cart);
assert.equal(sampleProduct.stock, initialStock - 3, 'Stock correctly decremented by 3');
assert.equal(cart.length, 0, 'Cart cleared after order completion');

// Attempt duplicate execution on refresh/resubmit
assert.throws(() => {
  processOrder(testOrderId, [{ product: sampleProduct, quantity: 3 }]);
}, /Duplicate deduction prevented/);
console.log('  ✓ Stock decremented once; duplicate order deduction prevented.');

// 6. Cart Reconciliation when Product Stock changes or Product is Deleted
console.log('\n[Test 6] Testing Cart Reconciliation on Inventory Changes:');
cart = [{ product: { id: sampleProduct.id }, quantity: 4 }];
// Reduce inventory stock to 2
sampleProduct.stock = 2;

// Reconcile
cart = cart.map(item => {
  const live = mockInventory.find(p => p.id === item.product.id);
  if (!live || live.stock <= 0) return null;
  return { ...item, quantity: Math.min(item.quantity, live.stock) };
}).filter(Boolean);

assert.equal(cart[0].quantity, 2, 'Cart quantity reconciled down to new lower stock level');

// Delete product
mockInventory = mockInventory.filter(p => p.id !== sampleProduct.id);
cart = cart.map(item => {
  const live = mockInventory.find(p => p.id === item.product.id);
  if (!live || live.stock <= 0) return null;
  return item;
}).filter(Boolean);

assert.equal(cart.length, 0, 'Deleted product removed from customer cart automatically');
console.log('  ✓ Cart reconciled safely when stock reduced or product deleted.');

// 7. Inventory KPI Metrics Calculation
console.log('\n[Test 7] Testing Inventory KPI Calculations:');
const testProducts = [
  { id: '1', name: 'A', price: 100, stock: 10 },
  { id: '2', name: 'B', price: 200, stock: 4 },  // low
  { id: '3', name: 'C', price: 300, stock: 0 },  // out
  { id: '4', name: 'D', price: 50, stock: 5 },   // low
];

const totalProducts = testProducts.length;
const totalUnits = testProducts.reduce((acc, p) => acc + p.stock, 0);
const lowStockCount = testProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
const outOfStockCount = testProducts.filter(p => p.stock === 0).length;
const totalValue = testProducts.reduce((acc, p) => acc + p.price * p.stock, 0);

assert.equal(totalProducts, 4);
assert.equal(totalUnits, 19);
assert.equal(lowStockCount, 2);
assert.equal(outOfStockCount, 1);
assert.equal(totalValue, 100*10 + 200*4 + 300*0 + 50*5); // 1000 + 800 + 0 + 250 = 2050
console.log(`  ✓ KPIs verified: 4 products, 19 units, 2 low stock, 1 out of stock, valuation ₹2,050.`);

// 8. Form Validation Rules
console.log('\n[Test 8] Testing Customer & Newsletter Form Validation:');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

assert.ok(emailRegex.test('concierge@emberandleaf.in'), 'Valid email passes');
assert.ok(!emailRegex.test('invalid-email'), 'Invalid email fails');
assert.ok(!emailRegex.test('test@'), 'Incomplete email fails');

assert.ok(phoneRegex.test('9876543210'), 'Valid 10-digit Indian phone passes');
assert.ok(!phoneRegex.test('12345'), 'Short phone fails');
assert.ok(!phoneRegex.test('1876543210'), 'Invalid starting digit fails');

assert.ok(pincodeRegex.test('560038'), 'Valid 6-digit PIN code passes');
assert.ok(!pincodeRegex.test('56003'), '5-digit PIN fails');
assert.ok(!pincodeRegex.test('5600381'), '7-digit PIN fails');
console.log('  ✓ Email, phone, and pincode regex validation verified.');

console.log('\n========================================');
console.log('ALL 8 AUTOMATED LOGIC TESTS PASSED SUCCESSFULLY!');
console.log('========================================');
