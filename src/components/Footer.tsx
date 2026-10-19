import React from 'react';
import { SlidersHorizontal, MapPin, Mail, Phone, Heart, Sparkles } from 'lucide-react';
import type { ProductCategory } from '../types';
import { Logo } from './Logo';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory | 'All') => void;
  onOpenInventory: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onOpenInventory }) => {
  const scrollToCatalog = (cat: ProductCategory | 'All') => {
    onSelectCategory(cat);
    const catalog = document.getElementById('catalog-section');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('brand-story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-espresso-950 text-cream-100 pt-16 pb-12 border-t border-espresso-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-espresso-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="group cursor-pointer">
              <Logo size="lg" variant="light" />
            </div>

            <p className="text-xs text-cream-200/80 max-w-sm leading-relaxed font-light">
              Thoughtfully sourced from regenerative shade estates across the Western Ghats and Himalayan valleys. Micro-roasted fresh weekly in Bengaluru, Karnataka.
            </p>

            <div className="space-y-2 text-xs text-cream-300/80 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-ember-400 flex-shrink-0" />
                <span>The Roastery, 14 Indiranagar 100ft Road, Bengaluru 560038</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-ember-400 flex-shrink-0" />
                <span>concierge@emberandleaf.in</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-ember-400 flex-shrink-0" />
                <span>+91 (80) 4920-8300 (Mon–Sat, 9AM–6PM IST)</span>
              </div>
            </div>
          </div>

          {/* Quick Collection Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-cream-50 text-sm tracking-wide">
              The Harvest
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80 font-light">
              <li>
                <button
                  onClick={() => scrollToCatalog('Coffee')}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left"
                >
                  Single-Origin Coffees
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('Tea')}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left"
                >
                  Whole-Leaf Teas
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('Brewing Equipment')}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left"
                >
                  Brewing Equipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('Accessories')}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left"
                >
                  Ceramic &amp; Drinkware
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToCatalog('All')}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left font-semibold text-ember-300"
                >
                  Complete Collection
                </button>
              </li>
            </ul>
          </div>

          {/* Sourcing & Care */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-cream-50 text-sm tracking-wide">
              Sourcing &amp; Ethos
            </h4>
            <ul className="space-y-2 text-xs text-cream-300/80 font-light">
              <li>
                <button
                  onClick={scrollToStory}
                  className="hover:text-cream-50 transition-colors cursor-pointer text-left"
                >
                  Our Philosophy
                </button>
              </li>
              <li>
                <span className="text-cream-300/60 cursor-default">Western Ghats Shade Farms</span>
              </li>
              <li>
                <span className="text-cream-300/60 cursor-default">Darjeeling Biodynamics</span>
              </li>
              <li>
                <span className="text-cream-300/60 cursor-default">Direct Trade Standards</span>
              </li>
              <li>
                <span className="text-cream-300/60 cursor-default">Eco Foil &amp; Biodegradable</span>
              </li>
            </ul>
          </div>

          {/* Management / Demo Controls */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-cream-50 text-sm tracking-wide">
              Store Demonstration
            </h4>
            <p className="text-xs text-cream-300/80 leading-relaxed font-light">
              This is a fully functional web storefront with browser-persisted cart and inventory stock reconciliation.
            </p>

            <button
              onClick={onOpenInventory}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-forest-900 hover:bg-forest-800 text-cream-50 text-xs font-semibold border border-forest-700 transition-all cursor-pointer shadow-sm group"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-ember-400 group-hover:rotate-45 transition-transform" />
              <span>Launch Inventory Workspace</span>
            </button>

            <div className="pt-2 text-[11px] text-cream-400/60 leading-tight">
              Data is stored securely in your browser's localStorage. No external credentials required.
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400/70 gap-4">
          <p>© 2024–2026 EMBER &amp; LEAF Roastery Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with passion for specialty coffee and tea.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
