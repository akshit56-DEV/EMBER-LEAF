import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  onExploreClick?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onExploreClick }) => {
  return (
    <aside
      className="bg-forest-900 text-cream-100 text-xs py-2 px-4 text-center border-b border-forest-800 transition-colors"
      aria-label="Promotion announcement"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-medium tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-ember-500" aria-hidden="true" />
          <span>Complimentary express delivery across India on orders over ₹1,500</span>
        </span>
        <span className="hidden sm:inline text-forest-200/50">•</span>
        <span className="hidden sm:inline text-cream-200/80">
          Freshly roasted to order in artisanal micro-lots
        </span>
        {onExploreClick && (
          <button
            onClick={onExploreClick}
            className="inline-flex items-center gap-1 text-ember-200 hover:text-cream-50 underline font-medium ml-1 transition-colors cursor-pointer"
          >
            <span>Shop Harvest</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </aside>
  );
};
