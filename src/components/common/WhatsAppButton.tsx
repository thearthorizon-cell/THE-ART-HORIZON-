import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { MessageCircle, X, Send, Sparkles, Phone, ArrowUpRight } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { businessConfig, openEnquiryModal } = useStudio();
  const [isOpen, setIsOpen] = useState(false);

  const cleanPhone = businessConfig.phone.replace(/[^0-9]/g, '');

  const quickMessages = [
    {
      title: 'Art Classes in Indore',
      subtitle: 'Kids, Teens & Adult drawing batches',
      text: 'Hello Vikas ji / The Art Horizon, I would like to know the current batch timings and admission details for Art Classes in Indore.',
    },
    {
      title: 'International Online Classes',
      subtitle: 'US, UK, UAE live Zoom sessions',
      text: 'Hello The Art Horizon team, I am interested in your International Online Art Classes via Zoom. Please share time zones and course details.',
    },
    {
      title: 'Portrait Commission Quote',
      subtitle: 'Charcoal, Graphite or Colour Pencil',
      text: 'Hello Vikas ji, I would like to commission a custom portrait. Please guide me on reference photo requirements and pricing details.',
    },
    {
      title: 'Wall Mural / Commercial Project',
      subtitle: 'Murals, Grand Rangoli, Hotel installations',
      text: 'Hello The Art Horizon, I would like to discuss a commercial art project (Wall Mural / Rangoli / Corporate project).',
    },
  ];

  const getWhatsAppUrl = (msg: string) => `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Expanded quick choice drawer */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white border border-[#E7DFD5] shadow-2xl rounded-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#1C1917] text-white p-4 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base font-bold">Chat with The Art Horizon</h4>
                <p className="text-[11px] text-stone-300">Vikas Gothi & Studio Mentors</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1 rounded-sm"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-[#FAF8F5] border-b border-stone-200 text-xs text-stone-600">
            Select a topic for immediate guidance, or tap below to open a direct chat:
          </div>

          <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
            {quickMessages.map((item, idx) => (
              <a
                key={idx}
                href={getWhatsAppUrl(item.text)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full text-left p-2.5 rounded border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-xs text-stone-900 group-hover:text-emerald-900">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-stone-500">{item.subtitle}</div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-emerald-700 shrink-0 mt-0.5" />
              </a>
            ))}
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
            <a
              href={`tel:${cleanPhone}`}
              className="text-xs text-stone-700 hover:text-[#B85D38] flex items-center gap-1 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-[#B85D38]" />
              <span>Call: {businessConfig.phone}</span>
            </a>

            <a
              href={getWhatsAppUrl(businessConfig.whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-sm font-medium flex items-center gap-1.5 transition-colors"
            >
              <span>Direct Chat</span>
              <Send className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-lg hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
          title="Chat on WhatsApp with The Art Horizon"
          aria-label="WhatsApp Chat"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
};
