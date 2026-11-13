import React, { useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Users,
  Palette,
  ArrowRight,
  Send,
  MessageCircle,
} from 'lucide-react';

export const ItemDetailModal: React.FC = () => {
  const { detailModalItem, closeDetailModal, openEnquiryModal, openFreeDemoModal, businessConfig } = useStudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDetailModal();
    };
    if (detailModalItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [detailModalItem, closeDetailModal]);

  if (!detailModalItem) return null;

  const handleEnquire = () => {
    const category = detailModalItem.enquiryCategory || 'general';
    const detail = `${detailModalItem.title}`;
    closeDetailModal();
    openEnquiryModal(category, detail);
  };

  const cleanPhone = businessConfig.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Hello Vikas ji / The Art Horizon, I would like to enquire regarding "${detailModalItem.title}". Please share details, schedule, and pricing.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-3xl rounded-sm shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header bar with vibrant artist palette accent */}
        <div className="bg-[#0B1E3F] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D82828] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#F5B700]">
                {detailModalItem.category ? detailModalItem.category.replace('-', ' ') : 'The Art Horizon'}
              </span>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-tight">
                {detailModalItem.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeDetailModal}
            className="text-stone-300 hover:text-white p-1.5 rounded-sm hover:bg-stone-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Visual Showcase */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-sm overflow-hidden bg-stone-900 border border-stone-200">
            <img
              src={detailModalItem.image}
              alt={detailModalItem.title}
              className="w-full h-full object-cover"
            />
            {detailModalItem.level && (
              <div className="absolute top-3 left-3 bg-[#0B1E3F]/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                {detailModalItem.level} Level
              </div>
            )}
          </div>

          {/* Subtitle / Intro */}
          {detailModalItem.subtitle && (
            <p className="font-serif italic text-base sm:text-lg text-[#8C4A2D] leading-relaxed">
              "{detailModalItem.subtitle}"
            </p>
          )}

          {/* Description */}
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            {detailModalItem.description}
          </p>

          {/* Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-stone-100/80 rounded-sm border border-stone-200 text-xs">
            {detailModalItem.ageGroup && (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Age / Audience:
                </span>
                <span className="font-bold text-stone-900">{detailModalItem.ageGroup}</span>
              </div>
            )}
            {detailModalItem.duration && (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Schedule / Duration:
                </span>
                <span className="font-bold text-stone-900">{detailModalItem.duration}</span>
              </div>
            )}
            {detailModalItem.batchSize && (
              <div>
                <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                  Mentorship Ratio:
                </span>
                <span className="font-bold text-stone-900">{detailModalItem.batchSize}</span>
              </div>
            )}
            <div className="col-span-2 sm:col-span-3">
              <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-semibold">
                Investment / Fee Policy:
              </span>
              <span className="font-semibold text-[#8C4A2D]">
                Custom Course Details & Quotes Provided Upon Enquiry
              </span>
            </div>
          </div>

          {/* Mediums Covered */}
          {detailModalItem.mediums && detailModalItem.mediums.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Art Mediums & Materials Used:
              </span>
              <div className="flex flex-wrap gap-2">
                {detailModalItem.mediums.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-stone-800 px-3 py-1 rounded-sm border border-stone-300 font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Highlights / What You Learn */}
          {(detailModalItem.highlights || detailModalItem.features || detailModalItem.whatYouLearn) && (
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                Curriculum Mastery & Inclusions:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-stone-700">
                {(detailModalItem.highlights || detailModalItem.features || detailModalItem.whatYouLearn)!.map(
                  (item, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-sm border border-stone-200">
                      <CheckCircle2 className="w-4 h-4 text-[#D82828] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="p-4 sm:p-6 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center justify-center gap-1.5 py-2.5 px-4 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>Chat on WhatsApp</span>
          </a>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {detailModalItem.type === 'course' && (
              <button
                type="button"
                onClick={() => {
                  closeDetailModal();
                  openFreeDemoModal();
                }}
                className="flex-1 sm:flex-none border border-stone-800 text-stone-900 hover:bg-stone-100 px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Book Free Demo
              </button>
            )}

            <button
              type="button"
              onClick={handleEnquire}
              className="flex-1 sm:flex-none bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Request Details & Pricing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
