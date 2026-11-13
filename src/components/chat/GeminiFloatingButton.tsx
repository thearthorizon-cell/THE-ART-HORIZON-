import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

interface GeminiFloatingButtonProps {
  onClick: () => void;
}

export const GeminiFloatingButton: React.FC<GeminiFloatingButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-5 sm:bottom-28 sm:right-6 z-40 bg-gradient-to-r from-stone-900 via-[#1C1917] to-stone-900 hover:from-stone-800 hover:to-stone-800 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-xl hover:shadow-2xl border border-stone-700/80 transition-all active:scale-95 flex items-center gap-2.5 group"
      aria-label="Ask Art Horizon AI Advisor"
      title="Ask Gemini AI Advisor about Classes, 1-on-1 Sessions & Commissions"
    >
      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#D82828] to-amber-500 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-110 transition-transform">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="hidden sm:flex flex-col text-left leading-none">
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
          AI Art Advisor
        </span>
        <span className="text-xs font-semibold text-white mt-0.5">
          Ask Gemini
        </span>
      </div>
    </button>
  );
};
