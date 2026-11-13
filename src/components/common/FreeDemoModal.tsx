import React, { useEffect, useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Sparkles, CheckCircle2, Send, MapPin, Video, MessageCircle } from 'lucide-react';

export const FreeDemoModal: React.FC = () => {
  const { isFreeDemoModalOpen, closeFreeDemoModal, demoModalPreset, addEnquiry, businessConfig } = useStudio();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [studentAge, setStudentAge] = useState('');
  const [country, setCountry] = useState('United States');
  const [selectedCourse, setSelectedCourse] = useState('Junior Artist Program (Age: 6–8 Years)');
  const [mode, setMode] = useState<'studio' | 'online'>('online');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDay, setPreferredDay] = useState('Weekend Morning (10:30 AM)');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isFreeDemoModalOpen) return;
    if (demoModalPreset?.mode) {
      setMode(demoModalPreset.mode);
    } else {
      setMode('online');
    }
    if (demoModalPreset?.courseTitle || demoModalPreset?.ageGroup) {
      const label =
        demoModalPreset.courseTitle && demoModalPreset.ageGroup
          ? `${demoModalPreset.courseTitle} (Age: ${demoModalPreset.ageGroup})`
          : demoModalPreset.courseTitle || demoModalPreset.ageGroup || '';
      if (label.toLowerCase().includes('junior') || label.includes('6')) {
        setSelectedCourse('Junior Artist Program (Age: 6–8 Years)');
      } else if (label.toLowerCase().includes('young') || label.includes('9')) {
        setSelectedCourse('Young Artist Program (Age: 9–11 Years)');
      } else if (label.toLowerCase().includes('senior') || label.includes('12')) {
        setSelectedCourse('Senior Artist Program (Age: 12–15 Years)');
      } else if (label) {
        setSelectedCourse(label);
      }
    }
  }, [isFreeDemoModalOpen, demoModalPreset]);

  if (!isFreeDemoModalOpen) return null;

  const whatsappSummaryText = `*New Free Demo Class Booking - The Art Horizon*\n*Student Name:* ${studentName.trim()}\n*Student Age:* ${studentAge.trim() || 'Not specified'}\n*Parent/Guardian:* ${parentName.trim() || 'Self'}\n*Mode:* ${mode === 'online' ? 'Live Zoom (Worldwide)' : 'In-Studio (Indore)'}\n*Selected Program:* ${selectedCourse}\n*Country:* ${country}\n*Phone / WhatsApp:* ${phone.trim()}\n*Email:* ${email.trim() || 'Not specified'}\n*Preferred Slot:* ${preferredDay}\n\nHello Vikas Sir, I have booked a Free Demo on The Art Horizon website. Please share our batch details!`;

  const whatsappUrl = `https://wa.me/${businessConfig.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    whatsappSummaryText
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      setErrorMsg('Please provide the student name and contact phone / WhatsApp number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const ok = await addEnquiry({
      name: `${studentName.trim()}${parentName.trim() ? ` (Parent: ${parentName.trim()})` : ''}`,
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: mode === 'online' ? 'international-online' : 'local-classes',
      serviceDetail: `Free Demo Request [${mode === 'online' ? 'Live Zoom Worldwide' : 'In-Studio Indore'}] - ${selectedCourse}`,
      countryOrCity: mode === 'online' ? country : 'Indore, India',
      studentAge: studentAge.trim() || selectedCourse,
      timeSlotPreference: preferredDay,
      message: `Free Demo Class Request. Program: ${selectedCourse}. Student Age: ${studentAge.trim() || 'Not specified'}. Mode: ${mode.toUpperCase()}. Country: ${mode === 'online' ? country : 'India'}. Preferred Slot: ${preferredDay}.`,
    });

    setIsSubmitting(false);

    if (!ok) {
      setErrorMsg('Could not reach the studio server right now. Please try again or reach us on WhatsApp.');
      return;
    }

    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setStudentName('');
    setParentName('');
    setStudentAge('');
    setPhone('');
    setEmail('');
    setErrorMsg('');
    closeFreeDemoModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="bg-[#1C1917] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-stone-900" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Book Your Free Demo Class</h3>
              <p className="text-xs text-stone-400">Experience our live interactive teaching before enrolling</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-900">Free Demo Request Saved!</h4>
            <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
              We have recorded your demo booking for <strong className="text-stone-900">{studentName}</strong> ({selectedCourse}) in our private admissions system. Founder <strong>Vikas Gothi</strong> or our academic desk will confirm your batch slot shortly.
            </p>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left space-y-2.5 max-w-md mx-auto">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Want instant WhatsApp confirmation?</span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Tap below to share your demo request directly with Vikas Gothi on WhatsApp (+91 99818 83598):
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Booking on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={handleClose}
              className="bg-stone-800 hover:bg-stone-900 text-white px-6 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Back to Website
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                {errorMsg}
              </div>
            )}

            {/* Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                Class Attendance Mode
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode('online')}
                  className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-all ${
                    mode === 'online'
                      ? 'bg-amber-900/5 border-[#B85D38] text-[#B85D38]'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <Video className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-stone-900">Live Zoom (Worldwide)</div>
                    <div className="text-[11px] text-stone-500">USA, UK, UAE, Oman, Kuwait</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('studio')}
                  className={`p-3 rounded-sm border text-left flex items-start gap-2.5 transition-all ${
                    mode === 'studio'
                      ? 'bg-amber-900/5 border-[#B85D38] text-[#B85D38]'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-xs text-stone-900">In-Studio (Indore)</div>
                    <div className="text-[11px] text-stone-500">Usha Nagar Studio</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Student Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Aarav Mehta"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  placeholder="e.g. Manish Mehta"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Selected Course / Age Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                >
                  <option value="Junior Artist Program (Age: 6–8 Years)">
                    Junior Artist Program (Age: 6–8 Years)
                  </option>
                  <option value="Young Artist Program (Age: 9–11 Years)">
                    Young Artist Program (Age: 9–11 Years)
                  </option>
                  <option value="Senior Artist Program (Age: 12–15 Years)">
                    Senior Artist Program (Age: 12–15 Years)
                  </option>
                  <option value="One-on-One (1:1) Private Mentorship">
                    One-on-One (1:1) Private Mentorship
                  </option>
                  <option value="Adults (Age 18+ Atelier / Hobby)">
                    Adults (Age 18+ Atelier / Hobby)
                  </option>
                  <option value="In-Studio Indore (Any Age Group)">
                    In-Studio Indore (Any Age Group)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Student Age
                </label>
                <input
                  type="text"
                  value={studentAge}
                  onChange={(e) => setStudentAge(e.target.value)}
                  placeholder="e.g. 8 years"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone / WhatsApp <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 / +44 / +971 / +91"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                >
                  <option value="United States">United States (USA)</option>
                  <option value="United Kingdom">United Kingdom (UK)</option>
                  <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                  <option value="Oman">Oman</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Singapore">Singapore</option>
                  <option value="India">India</option>
                  <option value="Other Country">Other Country</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Preferred Slot</label>
                <select
                  value={preferredDay}
                  onChange={(e) => setPreferredDay(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                >
                  <option value="Weekend Morning (10:30 AM)">Weekend Morning (10:30 AM)</option>
                  <option value="Weekend Afternoon (3:00 PM)">Weekend Afternoon (3:00 PM)</option>
                  <option value="Weekday Evening (5:00 PM)">Weekday Evening (5:00 PM)</option>
                  <option value="International Time Slot (US/UK/UAE/GCC)">
                    International Time Slot (US/UK/UAE/GCC)
                  </option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              * Includes a guided live artistic assessment and batch recommendation with no obligation to enroll.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#B85D38] hover:bg-[#A04F2E] disabled:opacity-60 text-white px-5 py-2 rounded-sm text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>{isSubmitting ? 'Saving...' : 'Confirm Demo Request'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
