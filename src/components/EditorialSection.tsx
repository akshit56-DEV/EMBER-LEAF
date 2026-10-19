import React from 'react';
import { Compass, Sun, Mountain, Coffee } from 'lucide-react';

export const EditorialSection: React.FC = () => {
  return (
    <section id="brand-story" className="py-20 bg-sand-100/70 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Atmospheric Estate Image with Vignette & Caption */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-card border-4 border-cream-50 aspect-[4/5] bg-sand-200">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop"
                alt="Shade-grown coffee plantation in Chikmagalur hills"
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-cream-50 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-ember-400">
                  Baba Budan Giri Range • 1,400m
                </span>
                <p className="font-serif text-sm italic text-cream-100/90 leading-snug">
                  "Where wild pepper vines climb old-growth shade trees above hand-harvested Arabica cherries."
                </p>
              </div>
            </div>

            {/* Floating Roaster Note */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-forest-900 text-cream-50 p-5 rounded-2xl shadow-xl border border-forest-800 max-w-xs">
              <span className="text-[10px] font-bold tracking-widest uppercase text-ember-400 block mb-1">
                Direct Trade Ethos
              </span>
              <p className="font-serif text-xs text-cream-100 leading-relaxed">
                We pay 45% above Fair Trade minimums directly to multi-generational family growers.
              </p>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="lg:col-span-7 space-y-6 lg:pl-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-50 border border-sand-300 text-forest-800 text-xs font-semibold tracking-wider uppercase">
              <Compass className="w-3.5 h-3.5 text-forest-700" />
              <span>Our Origin Story</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-espresso-950 leading-tight">
              Soil, shadow, and the patience of small batches.
            </h2>

            <p className="text-sm sm:text-base text-espresso-700 leading-relaxed font-light">
              EMBER &amp; LEAF was born from an unwavering belief: exceptional coffee and tea are not manufactured—they are nurtured by altitude, mist, and careful human hands.
            </p>

            <p className="text-sm sm:text-base text-espresso-700 leading-relaxed font-light">
              From the sea-breeze conditioned warehouses of the Malabar Coast to the biodynamic vernal equinox harvest in Darjeeling, our roasters and blenders never rush the process. We roast each micro-lot on a customized drum roaster in Bengaluru, dialing in airflow and temperature curves to accentuate every natural sugar and floral volatile.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200">
                <Mountain className="w-5 h-5 text-forest-700 mb-2" />
                <h4 className="font-serif font-bold text-espresso-950 text-sm mb-1">High Elevation</h4>
                <p className="text-xs text-espresso-600">Grown at 1,100m to 2,100m for dense, complex beans.</p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200">
                <Sun className="w-5 h-5 text-ember-600 mb-2" />
                <h4 className="font-serif font-bold text-espresso-950 text-sm mb-1">Native Canopy</h4>
                <p className="text-xs text-espresso-600">100% shade-grown under fig, jackfruit, and silver oak.</p>
              </div>

              <div className="p-4 rounded-2xl bg-cream-50 border border-sand-200">
                <Coffee className="w-5 h-5 text-forest-700 mb-2" />
                <h4 className="font-serif font-bold text-espresso-950 text-sm mb-1">Roasted Fresh</h4>
                <p className="text-xs text-espresso-600">Roasted in weekly micro-batches and shipped within 24 hours.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
