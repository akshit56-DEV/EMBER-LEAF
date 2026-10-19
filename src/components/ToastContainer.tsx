import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        let bgStyle = 'bg-espresso-900 text-cream-50 border-espresso-700';
        let Icon = Info;
        let iconColor = 'text-ember-500';

        if (toast.type === 'success') {
          bgStyle = 'bg-forest-900 text-cream-50 border-forest-700';
          Icon = CheckCircle2;
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-amber-950 text-amber-100 border-amber-800';
          Icon = AlertCircle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-red-950 text-red-100 border-red-800';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-modal transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-300 ${bgStyle}`}
            role="status"
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} aria-hidden="true" />
            <p className="text-sm font-medium leading-relaxed flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-cream-200/60 hover:text-cream-50 transition-colors p-1 -mr-1 -mt-1 rounded"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
