import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, Sparkles, CheckCircle2, Send, Calendar, Clock, MapPin, Video } from 'lucide-react';

export const FreeDemoModal: React.FC = () => {
  const { isFreeDemoModalOpen, closeFreeDemoModal, addEnquiry, businessConfig } = useStudio();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [ageGroup, setAgeGroup] = useState('Kids (Ages 5-11)');
  const [mode, setMode] = useState<'studio' | 'online'>('studio');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDay, setPreferredDay] = useState('Weekend Morning');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isFreeDemoModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      setErrorMsg('Please provide the student name and contact phone number.');
      return;
    }

    addEnquiry({
      name: `${studentName.trim()} (Parent: ${parentName.trim() || 'Self'})`,
      email: email.trim(),
      phone: phone.trim(),
      serviceCategory: mode === 'online' ? 'international-online' : 'local-classes',
      serviceDetail: `Free Demo Class [${mode === 'online' ? 'Live Zoom' : 'In-Studio Indore'}] - ${ageGroup}`,
      timeSlotPreference: preferredDay,
      message: `Requested Free Demo session. Mode: ${mode.toUpperCase()}. Age Group: ${ageGroup}. Preferred Timing: ${preferredDay}.`,
    });

    setIsSubmitted(true);
    setErrorMsg('');
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setStudentName('');
    setParentName('');
    setPhone('');
    setEmail('');
    setErrorMsg('');
    closeFreeDemoModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden my-8">
        <div className="bg-[#1C1917] text-white px-6 py-5 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#B85D38] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-100">Book a Free Demo Class</h3>
              <p className="text-xs text-stone-400">Experience our atelier teaching before enrolling</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-white p-1 rounded-sm hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif text-2xl font-bold text-stone-900">Demo Session Requested!</h4>
            <p className="text-stone-600 text-sm max-w-sm mx-auto">
              We have reserved your request for <strong className="text-stone-900">{studentName}</strong>. Our
              academic coordinator will connect via WhatsApp/Phone to confirm your trial batch slot and share the
              introductory kit list.
            </p>
            <button
              onClick={handleClose}
              className="bg-[#B85D38] text-white px-6 py-2.5 rounded-sm text-sm font-medium hover:bg-[#A04F2E] transition-colors"
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
                    <div className="text-[11px] text-stone-500">US, UK, UAE & Global</div>
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
                  Parent / Guardian Name (if under 18)
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Age Category <span className="text-red-600">*</span>
                </label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                >
                  <option value="Online Kids (Ages 6–8 Years)">Online Kids (Ages 6–8 Years)</option>
                  <option value="Online Kids (Ages 9–11 Years)">Online Kids (Ages 9–11 Years)</option>
                  <option value="Online Teens (Ages 12–15 Years)">Online Teens (Ages 12–15 Years)</option>
                  <option value="One-on-One (1:1) Private Mentorship">One-on-One (1:1) Private Mentorship</option>
                  <option value="Adults (Age 18+ Atelier / Hobby)">Adults (Age 18+ Atelier / Hobby)</option>
                  <option value="In-Studio Indore (Any Age Group)">In-Studio Indore (Any Age Group)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Phone / WhatsApp <span className="text-red-600">*</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <option value="International Time Slot (US/UK/UAE)">International Time Slot (US/UK/UAE)</option>
                </select>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              * The demo class includes a guided technique overview and artistic assessment with no obligation to enroll.
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
                className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-5 py-2 rounded-sm text-sm font-medium flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Confirm Demo Request</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
