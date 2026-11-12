import React from 'react';
import { Star } from 'lucide-react';
import { GOOGLE_REVIEWS_SUMMARY } from '../../data/testimonialsData';

// Authentic Google "G" Multi-color SVG icon
export const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

interface GoogleReviewsBadgeProps {
  variant?: 'pill' | 'card' | 'compact' | 'hero';
  onClick?: () => void;
  className?: string;
}

export const GoogleReviewsBadge: React.FC<GoogleReviewsBadgeProps> = ({
  variant = 'pill',
  onClick,
  className = '',
}) => {
  const { averageRating, totalReviews } = GOOGLE_REVIEWS_SUMMARY;

  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-1.5 text-xs text-stone-200 hover:text-white cursor-pointer transition-colors ${className}`}
        title="Verified Google Reviews"
      >
        <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
        <span className="font-bold text-amber-300">{averageRating}</span>
        <div className="flex items-center text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <span className="text-[11px] text-stone-300 font-medium">({totalReviews} Google Reviews)</span>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-3 bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-sm hover:shadow-md px-4 py-2 rounded-2xl cursor-pointer transition-all hover:border-amber-300 group ${className}`}
      >
        <div className="w-8 h-8 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0">
          <GoogleIcon className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-900 text-sm">{averageRating}</span>
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
              Verified
            </span>
          </div>
          <div className="text-[11px] text-stone-500 font-medium mt-0.5">
            Based on <strong className="text-stone-800">{totalReviews}+ reviews</strong> on Google Maps
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        onClick={onClick}
        className={`bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-md transition-all ${className}`}
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
            <GoogleIcon className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-900 leading-none">
                {averageRating}
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="text-[11px] text-stone-500 font-medium">Google Customer Rating</div>
              </div>
            </div>
            <p className="text-xs text-stone-600 mt-1">
              Over <strong>{totalReviews} verified student, parent & collector reviews</strong> on Google Business.
            </p>
          </div>
        </div>

        <button
          onClick={onClick}
          className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-2"
        >
          <GoogleIcon className="w-3.5 h-3.5" />
          <span>Write a Google Review</span>
        </button>
      </div>
    );
  }

  // Default pill variant
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-white border border-stone-200/90 shadow-2xs px-3.5 py-1.5 rounded-full cursor-pointer hover:border-[#D82828] transition-all text-xs ${className}`}
    >
      <GoogleIcon className="w-3.5 h-3.5 shrink-0" />
      <span className="font-bold text-stone-900">{averageRating}</span>
      <div className="flex items-center text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <span className="text-[11px] text-stone-500 font-medium">({totalReviews}+ Google Reviews)</span>
    </div>
  );
};
