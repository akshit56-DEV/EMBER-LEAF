import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  variant?: 'dark' | 'light'; // dark text for light bg, light text for dark bg
}

export const BrandEmblem: React.FC<{ sizeClass?: string }> = ({ sizeClass = 'w-10 h-10' }) => {
  return (
    <div
      className={`relative rounded-xl overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 border border-forest-700/80 bg-gradient-to-br from-forest-800 via-forest-900 to-espresso-950 ${sizeClass}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[82%] h-[82%]"
      >
        {/* Subtle Outer Delicate Ring */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="#C86D3B"
          strokeWidth="1.5"
          strokeOpacity="0.6"
          strokeDasharray="2 3"
        />

        {/* Inner Solid Frame */}
        <circle cx="50" cy="50" r="42" stroke="#FAF6F0" strokeWidth="1" strokeOpacity="0.25" />

        {/* --- LEFT: Organic Tea Leaf --- */}
        <path
          d="M50 18C44 24 30 35 29 53C28 65 37 77 50 82C43 73 39 63 41 51C43 38 48 26 50 18Z"
          fill="url(#leafGradient)"
        />
        {/* Leaf Veins */}
        <path
          d="M45 42C39 46 36 51 36 51"
          stroke="#FAF6F0"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />
        <path
          d="M43 56C37 60 35 66 35 66"
          stroke="#FAF6F0"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeOpacity="0.6"
        />

        {/* --- RIGHT: Roasted Coffee Bean --- */}
        <path
          d="M50 18C52 26 57 38 59 51C61 63 57 73 50 82C63 77 72 65 71 53C70 35 56 24 50 18Z"
          fill="url(#beanGradient)"
        />
        {/* Coffee Bean Characteristic S-curve Creep / Crevice */}
        <path
          d="M50 22C47 34 54 44 49 58C45 68 51 75 50 80"
          stroke="#C86D3B"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M50 25C48 35 53 43 49 56C46 65 51 72 50 77"
          stroke="#FAF6F0"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.8"
        />

        {/* --- TOP: Glowing Ember Spark --- */}
        <path
          d="M50 8L51.8 14.2L58 16L51.8 17.8L50 24L48.2 17.8L42 16L48.2 14.2L50 8Z"
          fill="#E58249"
        />
        <circle cx="50" cy="16" r="1.5" fill="#FAF6F0" />

        {/* Gradients */}
        <defs>
          <linearGradient id="leafGradient" x1="29" y1="20" x2="50" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F5ECE1" />
            <stop offset="0.6" stopColor="#D5C5AC" />
            <stop offset="1" stopColor="#8F7865" />
          </linearGradient>
          <linearGradient id="beanGradient" x1="50" y1="20" x2="71" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#D98A55" />
            <stop offset="0.5" stopColor="#A45524" />
            <stop offset="1" stopColor="#5E2C0F" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  variant = 'dark',
}) => {
  const sizeClassMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Botanical Emblem */}
      <BrandEmblem sizeClass={sizeClassMap[size]} />

      {/* Wordmark */}
      {showWordmark && (
        <div className="flex flex-col text-left">
          <span
            className={`font-serif text-lg sm:text-xl font-bold tracking-wider leading-none transition-colors ${
              isLight ? 'text-cream-50 group-hover:text-ember-300' : 'text-espresso-950 group-hover:text-forest-900'
            }`}
          >
            EMBER <span className="font-sans text-xs font-medium text-ember-500 mx-0.5">&amp;</span> LEAF
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-medium tracking-[0.2em] uppercase mt-1 ${
              isLight ? 'text-cream-300/70' : 'text-espresso-600/80'
            }`}
          >
            Artisanal Coffee &amp; Tea
          </span>
        </div>
      )}
    </div>
  );
};
