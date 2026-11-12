import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { TESTIMONIALS_DATA, GOOGLE_REVIEWS_SUMMARY } from '../data/testimonialsData';
import { GoogleIcon } from '../components/common/GoogleReviewsBadge';
import {
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Send,
  Star,
  ThumbsUp,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserCheck,
  Building,
} from 'lucide-react';

export const TestimonialsPage: React.FC = () => {
  const { openWriteReviewModal, openFreeDemoModal } = useStudio();
  const [activeFilter, setActiveFilter] = useState<'all' | '5-star' | 'online' | 'adults' | 'commissions'>('all');

  const filteredReviews = TESTIMONIALS_DATA.filter((item) => {
    if (activeFilter === '5-star') return (item.rating || 5) === 5;
    if (activeFilter === 'online') return item.courseOrService.toLowerCase().includes('online') || item.location.includes('USA') || item.location.includes('United States') || item.location.includes('Dubai');
    if (activeFilter === 'adults') return item.courseOrService.toLowerCase().includes('adult');
    if (activeFilter === 'commissions') return item.courseOrService.toLowerCase().includes('commission') || item.courseOrService.toLowerCase().includes('mural');
    return true;
  });

  return (
    <div className="space-y-16 py-10 pb-24 bg-white">
      {/* 1. Header Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <GoogleIcon className="w-4 h-4" />
          <span>Verified Google Customer Reviews</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          What Parents & Students Say on Google
        </h1>

        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
          Real feedback from families in Indore, across India, and international students in the USA, UK, and UAE learning with master artist <strong className="text-stone-900">Vikas Gothi</strong>.
        </p>
      </section>

      {/* 2. Google Rating Summary Card (CORE FEATURE) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-stone-900 via-[#1C1917] to-stone-900 text-white rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Overall Score */}
            <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3 border-b lg:border-b-0 lg:border-r border-stone-800 pb-6 lg:pb-0 lg:pr-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md">
                  <GoogleIcon className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-amber-400 block">
                    Google Business Rating
                  </span>
                  <span className="text-xs text-stone-400 font-medium">Verified Reviews</span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="font-serif text-6xl sm:text-7xl font-black text-white">
                  {GOOGLE_REVIEWS_SUMMARY.averageRating}
                </span>
                <div className="space-y-1">
                  <div className="flex items-center text-amber-400 text-xl">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-300 block font-medium">
                    Out of 5.0 Stars
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                Based on <strong className="text-white font-bold">{GOOGLE_REVIEWS_SUMMARY.totalReviews}+ verified Google reviews</strong> from students, parents, and art collectors worldwide.
              </p>
            </div>

            {/* Middle: Star Breakdown Bars */}
            <div className="lg:col-span-4 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Rating Breakdown
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-stone-300">5 Star</span>
                <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '96%' }} />
                </div>
                <span className="w-10 text-right text-stone-400 font-mono">96%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-stone-300">4 Star</span>
                <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400/80 rounded-full" style={{ width: '4%' }} />
                </div>
                <span className="w-10 text-right text-stone-400 font-mono">4%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-stone-300">3 Star</span>
                <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-700 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="w-10 text-right text-stone-500 font-mono">0%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-stone-300">2 Star</span>
                <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-700 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="w-10 text-right text-stone-500 font-mono">0%</span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="w-12 font-semibold text-stone-300">1 Star</span>
                <div className="flex-1 h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full bg-stone-700 rounded-full" style={{ width: '0%' }} />
                </div>
                <span className="w-10 text-right text-stone-500 font-mono">0%</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-3 flex flex-col gap-3">
              <button
                onClick={openWriteReviewModal}
                className="w-full bg-gradient-to-r from-amber-400 to-[#D82828] hover:opacity-95 text-stone-950 font-bold px-5 py-3.5 rounded-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Star className="w-4 h-4 fill-stone-950" />
                <span>Write a Google Review</span>
              </button>

              <a
                href={GOOGLE_REVIEWS_SUMMARY.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-3 rounded-full text-xs flex items-center justify-center gap-2 border border-white/20 transition-all text-center"
              >
                <GoogleIcon className="w-3.5 h-3.5" />
                <span>View on Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
              </a>

              <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Genuine Student Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {[
            { id: 'all', label: `🌟 All Google Reviews (${TESTIMONIALS_DATA.length})` },
            { id: '5-star', label: '★★★★★ 5-Star Only' },
            { id: 'online', label: '💻 International Online & Zoom' },
            { id: 'adults', label: '🎨 Adult Atelier & Painting' },
            { id: 'commissions', label: '🖼️ Portraits & Wall Murals' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                activeFilter === tab.id
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. Google Review Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredReviews.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200/90 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Reviewer Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full ${item.avatarColor || 'bg-stone-800'} text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0`}
                    >
                      {item.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900 text-sm sm:text-base leading-tight">
                          {item.author}
                        </h4>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                      </div>
                      <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{item.role}</span>
                        <span>•</span>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center shadow-2xs">
                      <GoogleIcon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1">{item.date || 'Verified'}</span>
                  </div>
                </div>

                {/* Stars and Service Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
                  <div className="flex items-center text-amber-400">
                    {[...Array(item.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#D82828] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
                    {item.courseOrService}
                  </span>
                </div>

                {/* Review Quote Text */}
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  "{item.quote}"
                </p>

                {/* Official Owner Reply (Google Business Signature) */}
                {item.ownerReply && (
                  <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-1.5 text-xs text-stone-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-stone-900 text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Response from {item.ownerReply.author}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-medium">
                        {item.ownerReply.date}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] sm:text-xs leading-relaxed italic">
                      "{item.ownerReply.text}"
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span className="flex items-center gap-1.5 text-stone-600">
                  <ThumbsUp className="w-3.5 h-3.5 text-stone-400" />
                  <span>Helpful review</span>
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  {item.reviewerBadge || 'Verified Review'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Google Review Callout Banner */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300 rounded-3xl p-8 sm:p-10 text-center space-y-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <GoogleIcon className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Have You Learned or Commissioned Art with Vikas Gothi?
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto leading-relaxed">
            Your review helps young artists, parents, and art lovers discover high-quality fine art mentorship. It takes less than a minute to share your star rating!
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openWriteReviewModal}
              className="bg-stone-900 hover:bg-stone-800 text-white px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Write a Review on Google</span>
            </button>
            <a
              href={GOOGLE_REVIEWS_SUMMARY.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 px-6 py-3 rounded-full text-xs font-semibold flex items-center gap-1.5"
            >
              <span>Search on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
