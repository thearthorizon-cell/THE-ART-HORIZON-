import React, { useState, useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import { EnquirySubmission } from '../../types';
import {
  X,
  Inbox,
  RefreshCw,
  Search,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Trash2,
  CheckCircle2,
  Sparkles,
  Download,
  AlertCircle,
  Video,
  Palette,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const InquiriesInboxModal: React.FC = () => {
  const {
    isInquiriesModalOpen,
    closeInquiriesModal,
    enquiries,
    newEnquiriesCount,
    isLoadingEnquiries,
    refreshEnquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    businessConfig,
  } = useStudio();

  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'contacted' | 'resolved' | 'trials' | 'online'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquirySubmission | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Private PIN security gate so visitors cannot view inquiries
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('the_art_horizon_admin_auth') === 'true';
  });

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    // Authorized PINs: 83598 (last 5 digits of Vikas Gothi phone 99818 83598), 1998, or full phone number
    if (cleanPin === '83598' || cleanPin === '1998' || cleanPin === '9981883598' || cleanPin === '99818 83598') {
      setIsAuthenticated(true);
      sessionStorage.setItem('the_art_horizon_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect Studio PIN. Only authorized studio administrators can view inquiries.');
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      // Tab filter
      if (activeFilter === 'new' && item.status !== 'new') return false;
      if (activeFilter === 'contacted' && item.status !== 'contacted') return false;
      if (activeFilter === 'resolved' && item.status !== 'resolved') return false;
      if (activeFilter === 'trials') {
        const isTrial =
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('demo')) ||
          (item.message && item.message.toLowerCase().includes('demo')) ||
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('trial'));
        if (!isTrial) return false;
      }
      if (activeFilter === 'online') {
        const isOnline =
          item.serviceCategory === 'international-online' ||
          (item.serviceDetail && item.serviceDetail.toLowerCase().includes('zoom')) ||
          (item.countryOrCity &&
            (item.countryOrCity.toLowerCase().includes('us') ||
              item.countryOrCity.toLowerCase().includes('uk') ||
              item.countryOrCity.toLowerCase().includes('uae')));
        if (!isOnline) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesPhone = item.phone.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesDetail = (item.serviceDetail || '').toLowerCase().includes(q);
        const matchesCity = (item.countryOrCity || '').toLowerCase().includes(q);
        const matchesMsg = item.message.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesEmail || matchesDetail || matchesCity || matchesMsg;
      }

      return true;
    });
  }, [enquiries, activeFilter, searchQuery]);

  if (!isInquiriesModalOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-[#FAF8F5] border border-stone-300 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-[#0B1E3F] to-[#1E293B] text-white p-5 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-900 flex items-center justify-center font-bold">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-white">Private Studio Backend</h3>
                <p className="text-[11px] text-stone-300">The Art Horizon • Vikas Gothi</p>
              </div>
            </div>
            <button
              onClick={closeInquiriesModal}
              className="text-stone-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePinSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Enter Studio Admin PIN
              </label>
              <p className="text-xs text-stone-500">
                Visitor inquiries and trial bookings are protected for privacy.
              </p>
            </div>

            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN (e.g. 83598)"
              className="w-full px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-center tracking-widest text-lg font-mono focus:outline-none focus:border-[#D82828]"
            />

            {pinError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                {pinError}
              </p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={closeInquiriesModal}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                Cancel / Return
              </button>
              <button
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Unlock Admissions Backend
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const handleExportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = [
      'Submission ID',
      'Date & Time',
      'Student / Parent Name',
      'Phone Number',
      'Email',
      'Category',
      'Service / Course Details',
      'Location / Country',
      'Time Slot Preference',
      'Status',
      'Message',
    ];

    const rows = enquiries.map((enq) => [
      enq.id,
      new Date(enq.createdAt).toLocaleString('en-IN'),
      `"${(enq.name || '').replace(/"/g, '""')}"`,
      `"${enq.phone || ''}"`,
      `"${enq.email || ''}"`,
      enq.serviceCategory,
      `"${(enq.serviceDetail || '').replace(/"/g, '""')}"`,
      `"${(enq.countryOrCity || '').replace(/"/g, '""')}"`,
      `"${(enq.timeSlotPreference || '').replace(/"/g, '""')}"`,
      enq.status,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_art_horizon_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 10) {
      return `91${digits}`; // Add India country code if 10-digit
    }
    return digits;
  };

  const getWhatsAppChatUrl = (item: EnquirySubmission) => {
    const phoneDigits = cleanPhoneForWhatsApp(item.phone);
    const greetingText = `Hello ${item.name}! This is Vikas Gothi from The Art Horizon Fine Art Studio & Academy. Thank you for your inquiry regarding "${item.serviceDetail || 'art classes'}". I would be delighted to assist you with batch timings, demo sessions, and course details.`;
    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(greetingText)}`;
  };

  const handleStatusChange = async (id: string, newStatus: EnquirySubmission['status']) => {
    setStatusUpdatingId(id);
    await updateEnquiryStatus(id, newStatus);
    setStatusUpdatingId(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the inquiry from "${name}"?`)) {
      await deleteEnquiry(id);
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-[#0B1E3F] via-[#1E293B] to-[#0B1E3F] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold shadow-md">
              <Inbox className="w-5 h-5 text-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white">
                  Student Inquiries & Free Trial Bookings
                </h3>
                {newEnquiriesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                    {newEnquiriesCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-300">
                Official admissions log for <strong>Vikas Gothi</strong> • Saved persistently on server
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshEnquiries()}
              disabled={isLoadingEnquiries}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-stone-200 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh latest inquiries from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={enquiries.length === 0}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
              title="Export all leads to Excel / CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('the_art_horizon_admin_auth');
                setIsAuthenticated(false);
                setPinInput('');
              }}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-stone-700"
              title="Lock portal immediately (requires PIN again)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock Portal</span>
            </button>

            <button
              onClick={closeInquiriesModal}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner for Vikas Gothi */}
        <div className="bg-amber-50 border-b border-amber-200/60 px-5 py-2.5 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Admissions Desk:</strong> All trial requests and website form submissions are stored here.
              Click <strong>"Chat on WhatsApp"</strong> on any student card to reply directly!
            </span>
          </div>
          <span className="text-[11px] text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-medium">
            Contact phone: {businessConfig.phone}
          </span>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="p-4 border-b border-stone-200 bg-white shrink-0 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                  activeFilter === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All ({enquiries.length})
              </button>
              <button
                onClick={() => setActiveFilter('new')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'new'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>New Leads ({enquiries.filter((e) => e.status === 'new').length})</span>
              </button>
              <button
                onClick={() => setActiveFilter('trials')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'trials'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Trial Bookings</span>
              </button>
              <button
                onClick={() => setActiveFilter('online')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === 'online'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
              >
                <Video className="w-3 h-3 text-indigo-600" />
                <span>International Zoom</span>
              </button>
              <button
                onClick={() => setActiveFilter('contacted')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                  activeFilter === 'contacted'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Contacted ({enquiries.filter((e) => e.status === 'contacted').length})
              </button>
              <button
                onClick={() => setActiveFilter('resolved')}
                className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                  activeFilter === 'resolved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Enrolled ({enquiries.filter((e) => e.status === 'resolved').length})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, phone, course..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D82828] focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Inquiries Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
          {filteredEnquiries.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
                <Inbox className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-xl font-bold text-stone-800">
                {searchQuery || activeFilter !== 'all' ? 'No matching inquiries found' : 'No inquiries yet'}
              </h4>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                {searchQuery || activeFilter !== 'all'
                  ? 'Try adjusting your search query or switching to the "All" tab.'
                  : 'When visitors on your website click "Book Free Trial" or "Request Details", their submissions will appear here in real time.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="text-xs text-[#D82828] font-bold hover:underline"
                >
                  Clear search and show all
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEnquiries.map((item) => {
                const isNew = item.status === 'new';
                const isContacted = item.status === 'contacted';
                const isResolved = item.status === 'resolved';

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-xl border transition-all p-4 sm:p-5 relative ${
                      isNew
                        ? 'border-rose-300 shadow-md ring-1 ring-rose-200/50'
                        : 'border-stone-200 shadow-xs hover:border-stone-300'
                    }`}
                  >
                    {/* Status Top Ribbon */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        {isNew && (
                          <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
                            NEW INQUIRY
                          </span>
                        )}
                        {isContacted && (
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            CONTACTED
                          </span>
                        )}
                        {isResolved && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            ENROLLED / RESOLVED
                          </span>
                        )}

                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(item.createdAt)}</span>
                        </span>
                      </div>

                      {/* Status Selector Dropdown */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-medium text-stone-500">Status:</label>
                        <select
                          value={item.status}
                          disabled={statusUpdatingId === item.id}
                          onChange={(e) =>
                            handleStatusChange(item.id, e.target.value as EnquirySubmission['status'])
                          }
                          className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 font-semibold text-stone-700 focus:outline-none focus:border-[#D82828]"
                        >
                          <option value="new">🔴 Mark as New</option>
                          <option value="contacted">🟡 Mark as Contacted</option>
                          <option value="resolved">🟢 Mark as Enrolled</option>
                        </select>

                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-stone-50 transition-colors"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Main Lead Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left: Contact Person & Phone */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Student / Contact Name
                          </div>
                          <div className="font-serif text-lg font-bold text-stone-900">{item.name}</div>
                        </div>

                        {/* Phone with WhatsApp and Call actions */}
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Contact Phone
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-stone-800">{item.phone}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={getWhatsAppChatUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs transition-all"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chat on WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${item.phone.replace(/\s+/g, '')}`}
                              className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors"
                              title="Direct Phone Call"
                            >
                              <Phone className="w-3.5 h-3.5 text-stone-600" />
                              <span>Call</span>
                            </a>
                          </div>
                        </div>

                        {item.email && (
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                              Email Address
                            </div>
                            <a
                              href={`mailto:${item.email}`}
                              className="text-xs text-stone-700 hover:text-[#D82828] flex items-center gap-1 underline underline-offset-2"
                            >
                              <Mail className="w-3 h-3 text-stone-400" />
                              <span>{item.email}</span>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Middle: Course & Preference Details */}
                      <div className="space-y-2">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Course / Service Requested
                          </div>
                          <div className="text-xs font-bold text-stone-900 bg-stone-100 p-2 rounded-lg border border-stone-200">
                            {item.serviceDetail || item.serviceCategory}
                          </div>
                        </div>

                        {item.timeSlotPreference && (
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                              Preferred Slot / Day
                            </div>
                            <div className="text-xs text-stone-700 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                              <span>{item.timeSlotPreference}</span>
                            </div>
                          </div>
                        )}

                        {item.countryOrCity && (
                          <div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                              Location / City
                            </div>
                            <div className="text-xs text-stone-700 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>{item.countryOrCity}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Message / Notes */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Student Notes / Inquiry Message
                        </div>
                        <div className="bg-[#FAF8F5] p-3 rounded-lg border border-stone-200 text-xs text-stone-700 leading-relaxed max-h-32 overflow-y-auto">
                          {item.message || 'No additional message provided.'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-stone-100 px-5 py-3 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 shrink-0 gap-2">
          <div>
            Showing <strong>{filteredEnquiries.length}</strong> of <strong>{enquiries.length}</strong> total inquiries
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Server-Synced</span>
            </span>
            <span>•</span>
            <button
              onClick={closeInquiriesModal}
              className="font-semibold text-stone-700 hover:text-stone-900"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
