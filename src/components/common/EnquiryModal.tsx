import React, { useState, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { EnquiryCategory } from '../../types';
import {
  X,
  Send,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Globe,
  MessageSquare,
  Sparkles,
  Info,
  Calendar,
} from 'lucide-react';

export const EnquiryModal: React.FC = () => {
  const {
    isEnquiryModalOpen,
    closeEnquiryModal,
    activeEnquiryCategory,
    activeEnquiryDetail,
    addEnquiry,
    businessConfig,
  } = useStudio();

  const [category, setCategory] = useState<EnquiryCategory>(activeEnquiryCategory || 'local-classes');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryOrCity, setCountryOrCity] = useState('');
  const [serviceDetail, setServiceDetail] = useState(activeEnquiryDetail || '');
  const [timeSlotPreference, setTimeSlotPreference] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activeEnquiryCategory) {
      setCategory(activeEnquiryCategory);
    }
    if (activeEnquiryDetail) {
      setServiceDetail(activeEnquiryDetail);
    }
  }, [activeEnquiryCategory, activeEnquiryDetail, isEnquiryModalOpen]);

  if (!isEnquiryModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please provide your name and contact phone number.');
      return;
    }

    addEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: category,
      serviceDetail: serviceDetail.trim() || undefined,
      countryOrCity: countryOrCity.trim() || undefined,
      timeSlotPreference: timeSlotPreference.trim() || undefined,
      message: message.trim(),
    });

    setIsSubmitted(true);
    setErrorMsg('');
  };

  const handleWhatsAppSend = () => {
    const text = `*New Website Enquiry - The Art Horizon*
*Name:* ${name || 'Prospective Student/Client'}
*Category:* ${category.replace('-', ' ').toUpperCase()}
*Service:* ${serviceDetail || 'Course / Service details'}
*Phone:* ${phone || 'Not provided'}
*Email:* ${email || 'Not provided'}
*Location:* ${countryOrCity || 'Not provided'}
*Preference:* ${timeSlotPreference || 'Flexible'}
*Message:* ${message || 'I would like to request course details, batch availability, and fee structure.'}`;

    const url = `https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setCountryOrCity('');
    setServiceDetail('');
    setTimeSlotPreference('');
    setMessage('');
    setErrorMsg('');
    closeEnquiryModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#1C1917] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-[#E8926F] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Art Horizon • Admissions & Services</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5 text-stone-100">
              Request Details & Consultation
            </h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-stone-400 hover:text-white p-1.5 rounded-sm hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pricing Policy Notice */}
        <div className="bg-[#F3EDE4] border-b border-[#E7DFD5] px-6 py-2.5 text-xs text-stone-700 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#B85D38] shrink-0" />
          <span>
            <strong>Pricing Policy:</strong> We do not publish flat rates because every student level and custom artwork
            commission is distinct. We share transparent course details and personalized quotes upon enquiry.
          </span>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-900">
              Thank You, {name || 'Artist'}!
            </h4>
            <p className="text-stone-600 text-sm max-w-md mx-auto">
              Your enquiry has been received by <strong className="text-stone-900">Vikas Gothi</strong> and the studio
              team. We will review your requirements and respond via phone or WhatsApp shortly.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsAppSend}
                className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2.5 rounded-sm text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Continue on WhatsApp Now</span>
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetAndClose}
                className="w-full sm:w-auto border border-stone-300 text-stone-700 hover:bg-stone-100 px-6 py-2.5 rounded-sm text-sm font-medium"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {errorMsg}
              </div>
            )}

            {/* Category Selector Tabs */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                What are you enquiring about?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'local-classes', label: 'Local Art Classes (Indore)' },
                  { id: 'international-online', label: 'Online Zoom (US/UK/UAE)' },
                  { id: 'portrait-commissions', label: 'Portrait Commissions' },
                  { id: 'commercial-projects', label: 'Murals & Commercial Art' },
                  { id: 'workshops', label: 'Creative Workshops' },
                  { id: 'general', label: 'General Art Enquiry' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id as EnquiryCategory);
                      setServiceDetail('');
                    }}
                    className={`px-3 py-2 text-xs rounded-sm text-left border transition-all ${
                      category === item.id
                        ? 'bg-[#B85D38] border-[#B85D38] text-white font-medium shadow-sm'
                        : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Sharma"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone / WhatsApp Number <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 99818 83598 or international"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ananya@example.com"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  City & Country of Residence
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={countryOrCity}
                    onChange={(e) => setCountryOrCity(e.target.value)}
                    placeholder="e.g. Indore / London, UK / California, USA"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic context selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Specific Course / Medium / Project
                </label>
                <input
                  type="text"
                  value={serviceDetail}
                  onChange={(e) => setServiceDetail(e.target.value)}
                  placeholder={
                    category === 'portrait-commissions'
                      ? 'e.g. Oil Painting on Canvas / Acrylic / Watercolor / Charcoal (A3/A2 size)'
                      : category === 'international-online'
                      ? 'e.g. Kids / Teen Batch (US / UK / UAE / Canada / Any Country)'
                      : category === 'commercial-projects'
                      ? 'e.g. Café Wall Mural 15x10 ft / Grand Rangoli'
                      : 'e.g. Adult Weekend Oil Painting / Kids Drawing'
                  }
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Preferred Batch / Timeline
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={timeSlotPreference}
                    onChange={(e) => setTimeSlotPreference(e.target.value)}
                    placeholder="e.g. Weekend morning / Weekday 5 PM / Immediate"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Your Message / Specific Requirements
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the student's age or current art experience, or details of the custom artwork you wish to commission..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
              <button
                type="button"
                onClick={handleWhatsAppSend}
                className="w-full sm:w-auto text-xs text-emerald-800 hover:text-emerald-900 font-medium flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <span>Instant WhatsApp Query</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-1/2 sm:w-auto px-4 py-2 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 sm:w-auto bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-2.5 rounded-sm text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>Submit Enquiry</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
