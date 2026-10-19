import React from 'react';
import { ArrowDown, Flame, Leaf, Award, ShieldCheck } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onStoryClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick, onStoryClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-200/50 to-cream-100 pt-8 pb-16 lg:pt-16 lg:pb-24 border-b border-sand-200">
      {/* Decorative subtle botanical shapes in background */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-ember-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Brand Kicker */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand-200/80 border border-sand-300 text-espresso-800 text-xs font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-forest-700" />
              <span>Small-Batch Roastery &amp; Tea Atelier</span>
            </div>

            {/* Primary Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-espresso-950 leading-[1.12]">
              Thoughtfully sourced.{' '}
              <span className="italic font-normal text-forest-800 block sm:inline">
                Beautifully brewed.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-espresso-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              We travel directly to shade-grown estates across the Western Ghats and Himalayan valleys, roasting micro-lots in Bengaluru to honor every floral, fruity, and chocolate note in your cup.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-forest-900 text-cream-50 font-semibold text-sm hover:bg-forest-800 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <span>Explore The Collection</span>
                <ArrowDown className="w-4 h-4 text-ember-400 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={onStoryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-cream-50 text-espresso-800 font-semibold text-sm hover:bg-cream-200/90 border border-sand-300 transition-all cursor-pointer"
              >
                <span>Our Roasting Ethos</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-sand-300/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Flame className="w-4 h-4 text-ember-600" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-espresso-900">Artisan Roasted</h4>
                  <p className="text-[11px] text-espresso-600">Fresh weekly batches</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Leaf className="w-4 h-4 text-forest-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-espresso-900">Direct Farm Trade</h4>
                  <p className="text-[11px] text-espresso-600">100% Single Origin</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <Award className="w-4 h-4 text-forest-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-espresso-900">Specialty Grade</h4>
                  <p className="text-[11px] text-espresso-600">SCA score 84+ cups</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-espresso-900">Eco-Packaged</h4>
                  <p className="text-[11px] text-espresso-600">Nitrogen-flushed foil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Photography Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main feature image container with double framing */}
              <div className="relative rounded-2xl overflow-hidden shadow-card border-4 border-cream-50 bg-sand-200 aspect-[4/5] group">
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop"
                  alt="Artisanal pour-over coffee brewing in ceramic dripper"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                  onError={(e) => {
                    // Graceful fallback
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />

                {/* Floating harvest pill */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-cream-50/95 backdrop-blur-md border border-sand-300 shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider uppercase text-ember-600 block">
                      Current Seasonal Feature
                    </span>
                    <h3 className="font-serif font-bold text-espresso-900 text-sm">
                      Kalledevarapura Washed Arabica
                    </h3>
                    <p className="text-xs text-espresso-600">Jasmine, Meyer Lemon &amp; Wild Honey</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-forest-800">₹720</span>
                    <span className="block text-[10px] text-espresso-400">250g Whole Bean</span>
                  </div>
                </div>
              </div>

              {/* Offset decorative secondary card */}
              <div className="hidden sm:block absolute -top-5 -left-6 bg-forest-900 text-cream-50 p-4 rounded-xl shadow-xl border border-forest-800 max-w-[190px]">
                <div className="flex items-center gap-1.5 text-ember-400 mb-1">
                  <Leaf className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Spring Harvest</span>
                </div>
                <p className="text-xs text-cream-100 font-serif leading-snug">
                  Makaibari 1st Flush Darjeeling now in stock.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
