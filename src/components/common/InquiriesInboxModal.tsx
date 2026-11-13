import React, { useState, useMemo, useEffect } from 'react';
import { safeSessionGet, safeSessionRemove, safeSessionSet, useStudio } from '../../context/StudioContext';
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
  Download,
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
    isAdminAuthenticated,
    isLoadingAdmin,
    verifyAndLoadAdmin,
    clearAdminSession,
  } = useStudio();

  // Security PIN gate state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return (
      isAdminAuthenticated ||
      (safeSessionGet('the_art_horizon_admin_auth') === 'true' &&
        Boolean(safeSessionGet('the_art_horizon_admin_pin')))
    );
  });

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToastMsg({ type, text });
    setTimeout(() => {
      setToastMsg((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // Enquiries filters & search
  const [activeFilter, setActiveFilter] = useState<'all' | 'new' | 'contacted' | 'resolved' | 'trials' | 'online'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Reload enquiries if modal opens while cached session exists
  useEffect(() => {
    if (isInquiriesModalOpen && isAuthenticated && !isAdminAuthenticated && !isLoadingAdmin) {
      verifyAndLoadAdmin().then((res) => {
        if (!res.ok) {
          setIsAuthenticated(false);
          setPinError(res.error || '');
        }
      });
    }
  }, [isInquiriesModalOpen, isAuthenticated, isAdminAuthenticated, isLoadingAdmin, verifyAndLoadAdmin]);

  useEffect(() => {
    if (isAdminAuthenticated && !isAuthenticated) {
      setIsAuthenticated(true);
    }
  }, [isAdminAuthenticated, isAuthenticated]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pinInput.trim();
    if (!cleanPin) {
      setPinError('Please enter the Studio PIN.');
      return;
    }

    setIsVerifyingPin(true);
    setPinError('');
    safeSessionSet('the_art_horizon_admin_pin', cleanPin);
    const result = await verifyAndLoadAdmin(cleanPin);
    setIsVerifyingPin(false);

    if (result.ok) {
      safeSessionSet('the_art_horizon_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
    } else {
      safeSessionRemove('the_art_horizon_admin_pin');
      safeSessionRemove('the_art_horizon_admin_auth');
      setPinError(result.error || 'Incorrect Studio PIN.');
    }
  };

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
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

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.phone.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          (item.serviceDetail || '').toLowerCase().includes(q) ||
          (item.countryOrCity || '').toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enquiries, activeFilter, searchQuery]);

  if (!isInquiriesModalOpen) return null;

  // LOCKED SCREEN
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
                <h3 className="font-serif text-lg font-bold text-white">Studio Inquiries Portal</h3>
                <p className="text-[11px] text-stone-300">The Art Horizon • Vikas Gothi</p>
              </div>
            </div>
            <button onClick={closeInquiriesModal} className="text-stone-400 hover:text-white p-1 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handlePinSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Enter Studio Admin PIN
              </label>
              <p className="text-xs text-stone-500">
                Enter Studio PIN to view and manage student &amp; client inquiries.
              </p>
            </div>

            <input
              type="password"
              autoFocus
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter Studio PIN"
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
                disabled={isVerifyingPin}
                className="bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {isVerifyingPin ? 'Verifying...' : 'Unlock Inquiries Inbox'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // CSV Helper
  const handleExportEnquiriesCSV = () => {
    if (enquiries.length === 0) return;
    const headers = [
      'Submission ID',
      'Date & Time',
      'Student / Parent Name',
      'Student Age',
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
      `"${(enq.studentAge || '').replace(/"/g, '""')}"`,
      `"${enq.phone || ''}"`,
      `"${enq.email || ''}"`,
      enq.serviceCategory,
      `"${(enq.serviceDetail || '').replace(/"/g, '""')}"`,
      `"${(enq.countryOrCity || '').replace(/"/g, '""')}"`,
      `"${(enq.timeSlotPreference || '').replace(/"/g, '""')}"`,
      enq.status,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
    ]);
    const csv = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', `the_art_horizon_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const cleanPhoneForWhatsApp = (phoneStr: string) => {
    const digits = phoneStr.replace(/\D/g, '');
    return digits.length === 10 ? `91${digits}` : digits;
  };

  const getWhatsAppChatUrl = (item: EnquirySubmission) => {
    const phoneDigits = cleanPhoneForWhatsApp(item.phone);
    const greetingText = `Hello ${item.name}! This is Vikas Gothi from The Art Horizon Fine Art Studio & Academy. Thank you for your inquiry regarding "${
      item.serviceDetail || 'art classes'
    }". I would be delighted to assist you with batch timings, demo sessions, and course details.`;
    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(greetingText)}`;
  };

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-IN', {
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-150">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-2 max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0B1E3F] via-[#1E293B] to-[#0B1E3F] text-white px-4 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-900 flex items-center justify-center font-bold shadow-md shrink-0">
              <Inbox className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base sm:text-xl font-bold text-white truncate">
                  The Art Horizon — Inquiries Inbox
                </h3>
                {newEnquiriesCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {newEnquiriesCount} New Leads
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-300 truncate">
                PIN-Protected Inquiries Portal • <strong>Vikas Gothi</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => refreshEnquiries()}
              disabled={isLoadingEnquiries || isLoadingAdmin}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-stone-200 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnquiries || isLoadingAdmin ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            <button
              onClick={() => {
                clearAdminSession();
                setIsAuthenticated(false);
                setPinInput('');
              }}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border border-stone-700"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>

            <button
              onClick={closeInquiriesModal}
              className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close Inquiries Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback Toast */}
        {toastMsg && (
          <div
            className={`mx-4 sm:mx-6 mt-3 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between border shrink-0 ${
              toastMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <span>{toastMsg.text}</span>
            <button onClick={() => setToastMsg(null)}>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Scrollable Inquiries Panel */}
        <div className="p-4 sm:p-6 overflow-y-auto grow space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
              {[
                { id: 'all', label: `All (${enquiries.length})` },
                { id: 'new', label: `New (${enquiries.filter((e) => e.status === 'new').length})` },
                { id: 'trials', label: 'Trial Bookings' },
                { id: 'online', label: 'International Zoom' },
                { id: 'contacted', label: `Contacted (${enquiries.filter((e) => e.status === 'contacted').length})` },
                { id: 'resolved', label: `Enrolled (${enquiries.filter((e) => e.status === 'resolved').length})` },
              ].map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setActiveFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-full font-semibold transition-all shrink-0 ${
                    activeFilter === pill.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-60">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, phone, course..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#D82828]"
                />
              </div>
              <button
                onClick={handleExportEnquiriesCSV}
                disabled={enquiries.length === 0}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {filteredEnquiries.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-2xl p-10 text-center space-y-2">
              <Inbox className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="font-serif text-lg font-bold text-stone-800">No Matching Enquiries</h4>
              <p className="text-xs text-stone-500">All website demo bookings and contact enquiries appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredEnquiries.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-4 sm:p-5 ${
                    item.status === 'new' ? 'border-rose-300 shadow-sm' : 'border-stone-200'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="uppercase text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800">
                        {item.status}
                      </span>
                      <span className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={item.status}
                        disabled={statusUpdatingId === item.id}
                        onChange={async (e) => {
                          setStatusUpdatingId(item.id);
                          const ok = await updateEnquiryStatus(item.id, e.target.value as EnquirySubmission['status']);
                          setStatusUpdatingId(null);
                          showToast(ok ? 'success' : 'error', ok ? 'Enquiry status updated!' : 'Could not update status.');
                        }}
                        className="text-xs bg-stone-50 border border-stone-200 rounded px-2 py-1 font-semibold text-stone-700"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Enrolled / Resolved</option>
                      </select>
                      {confirmDeleteId === item.id ? (
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={async () => {
                              const ok = await deleteEnquiry(item.id);
                              setConfirmDeleteId(null);
                              showToast(ok ? 'success' : 'error', ok ? 'Enquiry deleted.' : 'Failed to delete enquiry.');
                            }}
                            className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-0.5 rounded bg-stone-200 text-stone-700 text-[11px] font-semibold hover:bg-stone-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded"
                          title="Delete enquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-serif text-base font-bold text-stone-900">{item.name}</div>
                      {item.studentAge && (
                        <div className="text-[11px] font-semibold text-[#B85D38]">Age: {item.studentAge}</div>
                      )}
                      <div className="font-mono font-bold text-stone-800">{item.phone}</div>
                      <div className="flex items-center gap-2 pt-1">
                        <a
                          href={getWhatsAppChatUrl(item)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-[#25D366] text-white font-bold px-2.5 py-1 rounded-lg"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={`tel:${item.phone.replace(/\s+/g, '')}`}
                          className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 font-semibold px-2.5 py-1 rounded-lg"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>
                      {item.email && (
                        <div className="text-stone-600 flex items-center gap-1 pt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{item.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-stone-900 bg-stone-50 p-2 rounded-lg border border-stone-200">
                        {item.serviceDetail || item.serviceCategory}
                      </div>
                      {item.countryOrCity && (
                        <div className="flex items-center gap-1 text-stone-600">
                          <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <span>{item.countryOrCity}</span>
                        </div>
                      )}
                      {item.timeSlotPreference && (
                        <div className="flex items-center gap-1 text-stone-600">
                          <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{item.timeSlotPreference}</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#FAF8F5] p-3 rounded-lg border border-stone-200 text-stone-700 leading-relaxed max-h-28 overflow-y-auto">
                      {item.message || 'No additional notes.'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
