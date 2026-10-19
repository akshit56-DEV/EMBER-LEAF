import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      setError('Please provide your email address to subscribe.');
      return;
    }

    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address (e.g. coffee.lover@domain.com).');
      return;
    }

    setError('');
    setIsSuccess(true);
  };

  const handleReset = () => {
    setEmail('');
    setIsSuccess(false);
    setError('');
  };

  return (
    <section className="py-20 bg-forest-900 text-cream-100 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-forest-800/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-ember-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-700 text-xs font-semibold tracking-wider uppercase text-ember-300">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Ember &amp; Leaf Tasting Journal</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
          Receive seasonal harvest notes &amp; private micro-lot drops.
        </h2>

        <p className="text-sm sm:text-base text-cream-200/80 max-w-xl mx-auto font-light leading-relaxed">
          Join our intimate circle of coffee and tea connoisseurs. We dispatch cupping reports, pour-over brew guides, and first access to rare estate microlots.
        </p>

        {isSuccess ? (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-forest-800/90 border border-forest-700 shadow-xl space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-cream-50">
              Welcome to the Tasting Circle!
            </h3>
            <p className="text-xs text-cream-200/90 leading-relaxed">
              We've logged your address <strong>{email}</strong> into this browser session's VIP tasting list.
            </p>
            <div className="p-2.5 rounded-xl bg-forest-900/80 text-[11px] text-ember-300 border border-forest-700 text-center">
              <strong>Demonstration Mode:</strong> No actual marketing emails or spam will be sent.
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-cream-300 hover:text-cream-50 underline font-medium cursor-pointer pt-1"
            >
              Subscribe with another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3 text-left">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email address..."
                  className={`w-full pl-10 pr-4 py-3 rounded-full text-xs sm:text-sm bg-forest-800/90 border ${
                    error ? 'border-red-400' : 'border-forest-700 focus:border-ember-400'
                  } text-cream-50 placeholder:text-cream-300/50 focus:outline-none focus:ring-2 focus:ring-ember-500/30 transition-all`}
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-ember-500 hover:bg-ember-600 text-cream-50 text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-300 font-medium pl-3 animate-in fade-in">{error}</p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-cream-300/70 text-center pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-ember-400" />
              <span>Zero spam. Handcrafted dispatches only. Simulated demo subscription.</span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
