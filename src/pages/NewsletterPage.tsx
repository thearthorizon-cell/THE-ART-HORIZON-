import React, { useMemo, useState } from 'react';
import { useStudio } from '../context/StudioContext';
import { AnnouncementCategory, AnnouncementItem } from '../types';
import {
  Megaphone,
  Calendar,
  ArrowRight,
  Mail,
  CheckCircle2,
  X,
  ExternalLink,
  Search,
  Sparkles,
  Tag,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const ANNOUNCEMENT_CATEGORIES: Array<'All' | AnnouncementCategory> = [
  'All',
  'Announcement',
  'Workshop',
  'New Course',
  'Event',
  'Competition',
  'Student Achievement',
  'Academy Update',
  'Promotion',
];

export const NewsletterPage: React.FC = () => {
  const { cmsState, subscribeNewsletter, navigateTo, openFreeDemoModal } = useStudio();
  const { announcements, siteContent } = cmsState;

  const [selectedCategory, setSelectedCategory] = useState<'All' | AnnouncementCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailAnnouncement, setDetailAnnouncement] = useState<AnnouncementItem | null>(null);

  // Newsletter Subscription Form
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subConsent, setSubConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subFeedback, setSubFeedback] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  const filteredAnnouncements = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...announcements]
      .sort((a, b) => (b.publishedAt || b.createdAt).localeCompare(a.publishedAt || a.createdAt))
      .filter((item) => {
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.fullDescription.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      });
  }, [announcements, selectedCategory, searchQuery]);

  const formatReadableDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parsed = new Date(dateStr);
      if (isNaN(parsed.getTime())) return dateStr;
      return parsed.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleCtaNavigation = (ctaUrl?: string) => {
    if (!ctaUrl) return;
    if (ctaUrl.startsWith('#/')) {
      const clean = ctaUrl.replace('#/', '');
      const [page, section] = clean.split('/');
      navigateTo(page as any, section);
      setDetailAnnouncement(null);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubFeedback(null);

    const trimmedEmail = subEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setSubFeedback({
        type: 'error',
        text: 'Please enter a valid email address (for example, parent@example.com).',
      });
      return;
    }

    if (!subConsent) {
      setSubFeedback({
        type: 'error',
        text: 'Please tick the consent box to receive academy newsletters and updates.',
      });
      return;
    }

    setIsSubmitting(true);
    const result = await subscribeNewsletter({
      email: trimmedEmail,
      name: subName.trim() || undefined,
      consent: subConsent,
      source: 'newsletter-page',
    });
    setIsSubmitting(false);

    if (result.success) {
      setSubFeedback({
        type: result.alreadySubscribed ? 'info' : 'success',
        text: result.message,
      });
      if (!result.alreadySubscribed) {
        setSubName('');
        setSubEmail('');
        setSubConsent(false);
      }
    } else {
      setSubFeedback({
        type: 'error',
        text: result.error || result.message || 'Could not subscribe at this moment.',
      });
    }
  };

  return (
    <div className="space-y-16 py-12 pb-24 bg-[#FAF8F5]">
      {/* Page Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0B1E3F] via-[#17284A] to-[#1C1917] text-white rounded-3xl p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Megaphone className="w-3.5 h-3.5" />
              <span>The Art Horizon Bulletin</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-white">
              {siteContent.newsletterHeading}
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {siteContent.newsletterSubheading}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="#newsletter-subscribe-box"
                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>Subscribe to Newsletter</span>
              </a>
              <button
                onClick={() => openFreeDemoModal()}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs sm:text-sm px-6 py-3 rounded-full transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Book a Free Demo Class</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {ANNOUNCEMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-72 shrink-0">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workshops, courses, updates..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#D82828] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Announcements Cards Grid */}
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">No Announcements Found</h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              There are no published announcements matching your current filter. Try switching to All categories or subscribe below to receive updates as soon as they are posted.
            </p>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-[#D82828] hover:underline"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredAnnouncements.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    onClick={() => setDetailAnnouncement(item)}
                    className="relative aspect-[16/10] bg-stone-900 overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.featuredImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="bg-stone-950/85 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-amber-400" />
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 font-medium tabular-nums">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#B85D38]" />
                        {formatReadableDate(item.publishedAt)}
                      </span>
                      {item.expiresAt && (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          Through {formatReadableDate(item.expiresAt)}
                        </span>
                      )}
                    </div>

                    <h2
                      onClick={() => setDetailAnnouncement(item)}
                      className="font-serif text-xl font-bold text-stone-900 group-hover:text-[#D82828] transition-colors cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                      {item.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 mt-2 pt-4">
                  <button
                    onClick={() => setDetailAnnouncement(item)}
                    className="text-xs font-bold text-stone-900 hover:text-[#D82828] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Read Full Update</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {item.ctaLabel && item.ctaUrl &&
                    (item.ctaUrl.startsWith('http://') || item.ctaUrl.startsWith('https://') ? (
                      <a
                        href={item.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#B85D38] hover:bg-[#9E4E2D] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{item.ctaLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleCtaNavigation(item.ctaUrl)}
                        className="bg-[#B85D38] hover:bg-[#9E4E2D] text-white text-xs font-bold px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{item.ctaLabel}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Newsletter Email Subscription Form */}
      <section id="newsletter-subscribe-box" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white border border-stone-200 rounded-3xl p-7 sm:p-10 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-stone-100 pb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#D82828]/10 text-[#D82828] flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B85D38]">
                Newsletter Dispatch
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Receive Workshop & Batch Announcements by Email
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Join families and artists receiving curated updates on upcoming workshops, international course batches, exhibitions, and student honors.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4">
            {subFeedback && (
              <div
                className={`p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 ${
                  subFeedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : subFeedback.type === 'info'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{subFeedback.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  placeholder="e.g. Ananya Verma"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 text-sm bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:border-[#D82828] focus:bg-white"
                />
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-stone-600 cursor-pointer select-none bg-stone-50 p-3.5 rounded-xl border border-stone-200">
              <input
                type="checkbox"
                checked={subConsent}
                onChange={(e) => setSubConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#D82828] rounded"
              />
              <span>
                I agree to receive official academy newsletters, upcoming workshop schedules, and event announcements from The Art Horizon. Your email address is stored privately and never shared publicly.
              </span>
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Subscriber list is strictly private and admin-protected.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white px-7 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{isSubmitting ? 'Subscribing...' : 'Subscribe Now'}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Dedicated Announcement Detail Modal */}
      {detailAnnouncement && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
          onClick={() => setDetailAnnouncement(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-stone-900">
              <img
                src={detailAnnouncement.featuredImage}
                alt={detailAnnouncement.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setDetailAnnouncement(null)}
                className="absolute top-4 right-4 bg-stone-950/80 hover:bg-stone-950 text-white p-2 rounded-full transition-colors"
                aria-label="Close announcement detail"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="absolute bottom-4 left-4 bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {detailAnnouncement.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500 font-medium tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#B85D38]" />
                  Published {formatReadableDate(detailAnnouncement.publishedAt)}
                </span>
                {detailAnnouncement.expiresAt && (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5" />
                    Valid through {formatReadableDate(detailAnnouncement.expiresAt)}
                  </span>
                )}
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-snug">
                {detailAnnouncement.title}
              </h2>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {detailAnnouncement.fullDescription}
              </p>

              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => setDetailAnnouncement(null)}
                  className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-4 py-2 rounded-full border border-stone-200"
                >
                  Close Window
                </button>

                <div className="flex flex-wrap items-center gap-2.5">
                  {detailAnnouncement.ctaLabel && detailAnnouncement.ctaUrl &&
                    (detailAnnouncement.ctaUrl.startsWith('http://') || detailAnnouncement.ctaUrl.startsWith('https://') ? (
                      <a
                        href={detailAnnouncement.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#D82828] hover:bg-[#B81E1E] text-white px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>{detailAnnouncement.ctaLabel}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <button
                        onClick={() => handleCtaNavigation(detailAnnouncement.ctaUrl)}
                        className="bg-[#D82828] hover:bg-[#B81E1E] text-white px-6 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-sm"
                      >
                        <span>{detailAnnouncement.ctaLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  <button
                    onClick={() => {
                      setDetailAnnouncement(null);
                      openFreeDemoModal();
                    }}
                    className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-full text-xs font-bold transition-colors"
                  >
                    Book Free Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
