export type ProductCategory = 'Coffee' | 'Tea' | 'Brewing Equipment' | 'Accessories';

export type ProductBadge = 'Best Seller' | 'Limited Harvest' | 'New' | 'Staff Pick' | 'Micro-Lot' | 'Organic';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number; // in INR
  image: string;
  stock: number;
  badge?: string;
  origin?: string;
  roastLevel?: string; // e.g. "Light-Medium Roast", "First Flush Spring", "Precision Gear"
  flavorNotes?: string[];
  brewGuide?: string;
  weightOrSize?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes?: string;
}

export interface OrderConfirmation {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  customer: CustomerDetails;
  createdAt: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
