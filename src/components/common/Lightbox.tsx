import React, { useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, User, Palette, Maximize2, Sparkles, MessageSquare } from 'lucide-react';

export const Lightbox: React.FC = () => {
  const { lightboxItem, closeLightbox, openEnquiryModal } = useStudio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    if (lightboxItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxItem, closeLightbox]);

  if (!lightboxItem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-in fade-in duration-200">
      {/* Close button */}
      <button
        onClick={closeLightbox}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-stone-400 hover:text-white bg-stone-900/80 p-2.5 rounded-full border border-stone-700 z-50 transition-colors"
        aria-label="Close Lightbox"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="relative max-w-5xl w-full bg-[#1A1816] border border-stone-800 rounded-sm overflow-hidden flex flex-col lg:flex-row shadow-2xl max-h-[90vh]">
        {/* Artwork Image Container */}
        <div className="lg:w-3/5 bg-stone-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
          <img
            src={lightboxItem.image}
            alt={lightboxItem.title}
            className="max-h-[60vh] lg:max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl"
          />
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-[10px] text-stone-400 px-2.5 py-1 rounded border border-stone-800 flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-[#E8926F]" />
            <span>High-Fidelity Artwork Showcase</span>
          </div>
        </div>

        {/* Artwork Details Panel */}
        <div className="lg:w-2/5 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto border-t lg:border-t-0 lg:border-l border-stone-800 text-stone-200">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#E8926F] font-semibold bg-[#B85D38]/15 px-2 py-0.5 rounded border border-[#B85D38]/30">
                {lightboxItem.category.replace('-', ' ')}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-2">
                {lightboxItem.title}
              </h3>
            </div>

            <div className="space-y-2 text-xs text-stone-400 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-[#E8926F]" />
                <span className="text-stone-300 font-medium">{lightboxItem.medium}</span>
              </div>
              {lightboxItem.dimensions && (
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Dimensions:</span>
                  <span className="text-stone-300">{lightboxItem.dimensions}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-[#E8926F]" />
                <span className="text-stone-500">Artist:</span>
                <span className="text-stone-200 font-semibold">{lightboxItem.artist}</span>
              </div>
            </div>

            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              {lightboxItem.description}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-800 space-y-2.5">
            <button
              onClick={() => {
                closeLightbox();
                openEnquiryModal('portrait-commissions', `Commission / Enquiry regarding "${lightboxItem.title}"`);
              }}
              className="w-full bg-[#B85D38] hover:bg-[#A04F2E] text-white py-2.5 px-4 rounded-sm text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Commission Similar Artwork / Request Price</span>
            </button>

            <button
              onClick={closeLightbox}
              className="w-full text-stone-500 hover:text-stone-300 py-1.5 text-xs text-center"
            >
              Close Window
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
