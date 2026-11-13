import React, { useState } from 'react';
import { useStudio } from '../context/StudioContext';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Send,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight,
  MessageSquare,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { businessConfig, addEnquiry, openFreeDemoModal } = useStudio();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceCategory, setServiceCategory] = useState('Local Art Classes in Indore');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const cleanPhone = businessConfig.phone.replace(/[^0-9]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your full name and phone number.');
      return;
    }

    addEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: 'general',
      serviceDetail: serviceCategory,
      message: message.trim() || `Inquiry from website contact page for: ${serviceCategory}`,
    });

    try {
      const text = `*Contact Page Enquiry - The Art Horizon*\n*Name:* ${name.trim() || 'Prospective Student/Client'}\n*Service of Interest:* ${serviceCategory}\n*Phone:* ${phone.trim()}\n*Email:* ${email.trim() || 'Not provided'}\n*Message:* ${message.trim() || 'I would like to visit the studio or request batch details.'}`;
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    } catch {
      // ignore
    }

    setIsSubmitted(true);
    setErrorMsg('');
  };

  const handleWhatsAppSend = () => {
    const text = `*Contact Page Enquiry - The Art Horizon*
*Name:* ${name || 'Prospective Student/Client'}
*Service of Interest:* ${serviceCategory}
*Phone:* ${phone || 'Not provided'}
*Email:* ${email || 'Not provided'}
*Message:* ${message || 'I would like to visit the studio or request batch details.'}`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-24 py-12 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B85D38]/10 border border-[#B85D38]/20 text-[#8C4A2D] text-xs font-semibold uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#B85D38]" />
          <span>Connect with The Art Horizon</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight">
          Contact Us & Studio Location
        </h1>
        <p className="text-stone-600 max-w-2xl mx-auto text-base sm:text-lg">
          Whether you wish to enroll in kids or adult art classes, commission a bespoke heirloom portrait, discuss a
          wall mural, or join our global online Zoom batches, we are here to assist you.
        </p>
      </section>

      {/* Main Grid: Contact Channels & Interactive Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-sm shadow-xs space-y-6">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Studio Information
              </h2>

              <div className="space-y-5 text-sm">
                {/* Address */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Address
                    </span>
                    <p className="text-stone-900 font-medium mt-0.5 leading-snug">
                      {businessConfig.address}
                    </p>
                    {businessConfig.isAddressPendingConfirmation && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mt-1.5">
                        <ShieldAlert className="w-3 h-3 text-amber-600" />
                        <span>Address editable pending final confirmation</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Direct Phone
                    </span>
                    <a
                      href={`tel:${businessConfig.phone.replace(/\s+/g, '')}`}
                      className="text-stone-900 font-semibold hover:text-[#B85D38] transition-colors block text-base mt-0.5"
                    >
                      {businessConfig.phone}
                    </a>
                    <span className="text-xs text-stone-500">Tap to call founder Vikas Gothi</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Official Email
                    </span>
                    <a
                      href={`mailto:${businessConfig.email}`}
                      className="text-stone-900 font-medium hover:text-[#B85D38] transition-colors block mt-0.5"
                    >
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                  <div className="w-9 h-9 rounded bg-[#B85D38]/10 text-[#B85D38] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                      Operating Hours Note
                    </span>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {businessConfig.businessHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-stone-100 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(businessConfig.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Chat on WhatsApp Instantly</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  onClick={openFreeDemoModal}
                  className="w-full border border-stone-300 text-stone-800 hover:bg-stone-50 py-2.5 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Book a Free Demo Class
                </button>
              </div>
            </div>

            {/* Social & Founder Connect */}
            <div className="bg-[#1C1917] text-white p-6 rounded-sm border border-stone-800 space-y-3">
              <span className="text-xs uppercase font-bold tracking-wider text-[#E8926F] block">
                Social & Video Channels
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Watch our tutorials, speed drawings, and student artworks on YouTube and Instagram:
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={businessConfig.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-xs font-semibold text-red-100 hover:text-white bg-red-950/70 hover:bg-red-900 px-3.5 py-2.5 rounded-sm border border-red-800/60 transition-colors shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-3.5 shrink-0" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                      <rect width="28" height="20" rx="5" fill="#FF0000" />
                      <path d="M11.5 5.8L18.5 10L11.5 14.2V5.8Z" fill="#FFFFFF" />
                    </svg>
                    <span>The Art Horizon YouTube Channel</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href={businessConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-xs font-semibold text-stone-200 hover:text-white bg-stone-800 hover:bg-stone-700 px-3.5 py-2 rounded-sm border border-stone-700 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-400" />
                    <span>@thearthorizon (Official Instagram)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-stone-200 p-8 sm:p-10 rounded-sm shadow-sm space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  Send a Message to The Art Horizon
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Fill in your details below and our team will get back to you with syllabus guides and pricing details.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 text-center space-y-4 bg-emerald-50 border border-emerald-200 rounded-sm">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-stone-900">
                    Thank You, {name}!
                  </h4>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Your inquiry has been submitted directly to Vikas Gothi. We will call or WhatsApp you on{' '}
                    <strong>{phone}</strong> soon with course details and batch openings.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setName('');
                      setPhone('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="bg-[#B85D38] text-white px-6 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                      {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Your Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Diya Sen"
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Contact Phone / WhatsApp <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 99818 83598"
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="diya@example.com"
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">
                        Service or Program of Interest
                      </label>
                      <select
                        value={serviceCategory}
                        onChange={(e) => setServiceCategory(e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                      >
                        <option value="Kids Drawing & Painting Classes">Kids Drawing & Painting Classes</option>
                        <option value="Teen Art & Sketching Program">Teen Art & Sketching Program</option>
                        <option value="Adult Drawing & Canvas Painting">Adult Drawing & Canvas Painting</option>
                        <option value="Professional Fine Art Diploma">Professional Fine Art Diploma</option>
                        <option value="International Online Zoom Classes (US/UK/UAE)">
                          International Online Zoom Classes (US/UK/UAE)
                        </option>
                        <option value="Custom Portrait Commission (Charcoal / Colour Pencil)">
                          Custom Portrait Commission (Charcoal / Colour Pencil)
                        </option>
                        <option value="Wall Murals & Café Projects">Wall Murals & Café Projects</option>
                        <option value="Large-Scale Festival Rangoli">Large-Scale Festival Rangoli</option>
                        <option value="Resin / Lippan / Clay Workshops">Resin / Lippan / Clay Workshops</option>
                        <option value="General Studio Consultation">General Studio Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Your Message or Questions
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please mention student age, preferred batch slot, reference photo details, or any questions you may have..."
                      className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleWhatsAppSend}
                      className="w-full sm:w-auto text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center justify-center gap-1.5 py-2 px-3 rounded border border-emerald-300 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <span>Send Enquiry via WhatsApp</span>
                    </button>

                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#B85D38] hover:bg-[#A04F2E] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <span>Submit Contact Form</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Embed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-stone-200 rounded-sm overflow-hidden shadow-xs">
          <div className="p-6 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#B85D38] block">
                Interactive Map Location
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                Find The Art Horizon in Indore
              </h3>
              <p className="text-xs text-stone-500">
                266, Ganesh Villa, Usha Nagar Extension, Ranjit Hanuman Road, Indore, Madhya Pradesh
              </p>
            </div>
            <a
              href="https://maps.google.com/?q=266+Ganesh+Villa+Usha+Nagar+Extension+Ranjit+Hanuman+Road+Indore"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0B1E3F] hover:bg-[#D82828] text-white text-xs px-4 py-2 rounded-sm font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
            >
              <span>Get Driving Directions</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#F5B700]" />
            </a>
          </div>

          <div className="w-full aspect-[21/9] min-h-[300px] bg-stone-100 relative">
            <iframe
              title="The Art Horizon Studio Location in Indore"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=266%20Ganesh%20Villa%20Usha%20Nagar%20Extension%20Ranjit%20Hanuman%20Road%20Indore&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
