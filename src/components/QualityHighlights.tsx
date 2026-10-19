import React from 'react';
import { Award, Leaf, Flame, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

export const QualityHighlights: React.FC = () => {
  const highlights = [
    {
      icon: HeartHandshake,
      title: 'Direct Farm Partnerships',
      description:
        'We visit our grower partners in person every harvest season, cutting out intermediaries and ensuring transparent, equitable compensation.',
      tag: '100% Traceable',
    },
    {
      icon: Flame,
      title: 'Artisan Micro-Roasting',
      description:
        'Roasted in calibrated 15kg drum batches in Bengaluru. Every roast profile is cupped and verified against Specialty Coffee Association (SCA) quality protocols.',
      tag: 'Small Batch',
    },
    {
      icon: Leaf,
      title: 'Hand-Plucked Whole Leaf Teas',
      description:
        'Zero fannings or dust. Only tender two-leaves-and-a-bud orthodox flushes sourced from historic biodynamic gardens across Darjeeling, Assam, and the Nilgiris.',
      tag: 'Estate Grade',
    },
    {
      icon: ShieldCheck,
      title: 'Freshness Guaranteed Packaging',
      description:
        'Sealed with nitrogen-flush valves in 100% biodegradable kraft pouches to protect delicate volatile aromas from oxygen, moisture, and ultraviolet light.',
      tag: 'Eco Shield',
    },
  ];

  return (
    <section id="brew-highlights" className="py-20 bg-cream-50 border-b border-sand-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-ember-500" />
            <span>The Four Pillars of Craft</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-espresso-950">
            Uncompromising standards from tree to cup.
          </h2>

          <p className="text-sm sm:text-base text-espresso-600 font-light leading-relaxed">
            Every bean and leaf we curate is governed by meticulous quality criteria, ecological responsibility, and a deep reverence for the craft of brewing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-cream-100/70 p-6 rounded-2xl border border-sand-300/80 shadow-subtle hover:shadow-card hover:border-sand-400 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-forest-900 text-cream-50 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-ember-400" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800 bg-forest-100 px-2 py-0.5 rounded-full border border-forest-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-espresso-950 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-espresso-700 leading-relaxed font-light">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-sand-200 text-[11px] text-espresso-500 font-medium">
                  Pillar 0{index + 1} of Craft
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
