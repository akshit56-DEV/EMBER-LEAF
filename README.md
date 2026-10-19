# EMBER & LEAF — Artisanal Coffee & Tea

> **“Thoughtfully sourced. Beautifully brewed.”**

An interactive, production-ready specialty coffee, artisanal tea, and precision brewing e-commerce storefront with an integrated small-business inventory management workspace. Built with modern React, TypeScript, Vite, and Tailwind CSS.

---

## ☕ Key Features

### 1. Storefront & Editorial Experience
- **Hero & Sourcing Story:** Warm cream backgrounds, rich espresso typography, deep forest green accents, and storytelling exploring high-elevation shade-grown estates across the Western Ghats and Darjeeling.
- **Dynamic Catalog:** 12 sample products spanning Single-Origin Coffees, Whole-Leaf Teas, Traditional & Modern Brewing Equipment, and Ceramic Drinkware.
- **Search & Multi-Faceted Filtering:** Instant search by name, origin, or flavor notes, combined with category pills, in-stock toggle, and price/stock sorting.
- **Sensory Details Modal:** Cupping notes, elevation details, roast profiles, and recommended brewing protocols (water ratios, temperature, grind settings).
- **Graceful Fallbacks:** Guaranteed zero broken images with resilient category fallbacks and image load error handlers.

### 2. Shopping Bag & Demo Checkout
- **Real-Time Stock Enforcement:** Cart increments respect live inventory levels and prevent selecting more units than physically in stock.
- **Free Shipping Progress Tracker:** Visual progress bar toward complimentary express delivery across India on orders over ₹1,500.
- **Interactive Demo Checkout:** Complete customer details form with field validation (Name, Email, 10-digit Indian Mobile, Street Address, City, 6-digit PIN code).
- **Single-Deduction Order Processing:** Deducts stock from live inventory once per confirmed order and stores order references to prevent duplicate deductions on page refresh.
- **Safe Cart Reconciliation:** Automatically recalculates or cleans cart items if catalog items are edited, low-stocked, or deleted.

### 3. Small-Business Inventory Management Panel
- **Accessible Admin Workspace:** Opened directly from the header (`Inventory` button).
- **Live KPI Analytics:** Instant visibility into:
  - Total Catalog SKUs
  - Total Units in Stock
  - Low-Stock Items (≤ 5 units with amber alerts)
  - Out-of-Stock Items (0 units with red alerts)
  - Total Inventory Valuation (INR ₹)
- **Full CRUD Capabilities:**
  - **Create:** Add new items with instant image previews, category tags, tasting notes, and stock levels.
  - **Read & Filter:** Filter by stock health status (All, Healthy, Low Stock, Out of Stock) or category.
  - **Update:** Edit any product attribute or use quick `+` / `-` stock counters.
  - **Delete:** Protected deletion with confirmation modal and automatic customer cart reconciliation.
  - **Reset:** One-click reset to default demonstration catalog.
- **Client-Side Persistence:** Automatically stores inventory state and cart in browser `localStorage`.

---

## 🛠️ Technology Stack

- **Framework:** [Vite](https://vite.dev/)
- **UI Library:** [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with custom brand design tokens
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Playfair Display (Serif) & Plus Jakarta Sans
- **Storage:** Browser `localStorage` with safe schema parsing

---

## 🚀 Local Development

### Prerequisites
- Node.js (v18 or newer recommended, tested on Node v24)
- npm (tested on npm 11)

### Installation & Run

1. Clone or navigate to the project directory:
   ```bash
   cd "e:\EMBER ANTI"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build production bundle:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

## 🌐 Deploying to GitHub & Vercel

### Step 1: Push to GitHub

1. Initialize Git in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Ember & Leaf specialty storefront & inventory management"
   ```

2. Create a new repository on [GitHub](https://github.com/new).

3. Set your remote origin and push:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New... > Project**.
2. Import the GitHub repository created above.
3. Verify the deployment settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build` (runs `tsc --noEmit && vite build`)
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **Deploy**. Vercel will install dependencies, compile TypeScript, run the Vite build, and provide a live production URL with global CDN delivery.

---

## 🔒 Demonstration Note

This is a demonstration web application. All data is persisted in the local browser via `localStorage`. No actual payments are collected, and no external emails are sent.
