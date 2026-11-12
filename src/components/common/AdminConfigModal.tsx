import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import {
  X,
  SlidersHorizontal,
  Save,
  RotateCcw,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldAlert,
  FileSpreadsheet,
} from 'lucide-react';

export const AdminConfigModal: React.FC = () => {
  const {
    isAdminConfigOpen,
    closeAdminConfig,
    businessConfig,
    updateBusinessConfig,
    resetBusinessConfig,
    enquiries,
    updateEnquiryStatus,
    clearEnquiries,
    openInquiriesModal,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<'config' | 'enquiries'>('config');

  // Form states for business configuration
  const [address, setAddress] = useState(businessConfig.address);
  const [isPending, setIsPending] = useState(businessConfig.isAddressPendingConfirmation);
  const [businessHours, setBusinessHours] = useState(businessConfig.businessHours);
  const [phone, setPhone] = useState(businessConfig.phone);
  const [email, setEmail] = useState(businessConfig.email);
  const [instagramUrl, setInstagramUrl] = useState(businessConfig.instagramUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isAdminConfigOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessConfig({
      address: address.trim(),
      isAddressPendingConfirmation: isPending,
      businessHours: businessHours.trim(),
      phone: phone.trim(),
      email: email.trim(),
      instagramUrl: instagramUrl.trim(),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Category', 'Service Detail', 'Location', 'Status', 'Message'];
    const rows = enquiries.map((enq) => [
      enq.id,
      enq.createdAt,
      `"${(enq.name || '').replace(/"/g, '""')}"`,
      `"${enq.phone || ''}"`,
      `"${enq.email || ''}"`,
      enq.serviceCategory,
      `"${(enq.serviceDetail || '').replace(/"/g, '""')}"`,
      `"${(enq.countryOrCity || '').replace(/"/g, '""')}"`,
      enq.status,
      `"${(enq.message || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `the_art_horizon_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-[#FAF8F5] border border-[#E7DFD5] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1C1917] text-white px-6 py-4 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#B85D38] flex items-center justify-center text-white">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Studio Management & Business Settings
              </h3>
              <p className="text-xs text-stone-400">The Art Horizon • Founder: Vikas Gothi</p>
            </div>
          </div>
          <button
            onClick={closeAdminConfig}
            className="text-stone-400 hover:text-white p-1.5 rounded-sm hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 flex items-center gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all ${
              activeTab === 'config'
                ? 'border-[#B85D38] text-[#B85D38]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            Business & Address Configuration
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 text-xs font-semibold tracking-wider uppercase border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-[#B85D38] text-[#B85D38]'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Enquiries & Admissions Log</span>
            <span className="bg-[#B85D38] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {enquiries.length}
            </span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto grow">
          {activeTab === 'config' ? (
            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-2xl">
              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-sm flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Business information saved and updated across all pages!</span>
                </div>
              )}

              {/* Address Settings */}
              <div className="bg-white p-5 border border-stone-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                  <MapPin className="w-4 h-4 text-[#B85D38]" />
                  <span>Studio Address (Pending Confirmation Setting)</span>
                </div>
                <p className="text-xs text-stone-500">
                  Per project instructions, keep the full address editable pending final confirmation.
                </p>

                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={isPending}
                    onChange={(e) => setIsPending(e.target.checked)}
                    className="rounded text-[#B85D38] focus:ring-[#B85D38]"
                  />
                  <span>
                    Keep marked as <em>"Editable pending final confirmation"</em> on website
                  </span>
                </label>
              </div>

              {/* Operating Hours Settings */}
              <div className="bg-white p-5 border border-stone-200 rounded-sm space-y-3">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                  <Clock className="w-4 h-4 text-[#B85D38]" />
                  <span>Business Hours / Studio Timings</span>
                </div>
                <p className="text-xs text-stone-500">
                  Do not invent hours; update with verified studio timings or keep appointment-based note.
                </p>

                <textarea
                  rows={2}
                  value={businessHours}
                  onChange={(e) => setBusinessHours(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                />
              </div>

              {/* Contact Details */}
              <div className="bg-white p-5 border border-stone-200 rounded-sm space-y-4">
                <div className="font-semibold text-sm text-stone-900">Contact Channels</div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-sm focus:outline-none focus:border-[#B85D38]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={resetBusinessConfig}
                  className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>

                <button
                  type="submit"
                  className="bg-[#B85D38] hover:bg-[#A04F2E] text-white px-6 py-2.5 rounded-sm text-sm font-medium flex items-center gap-2 shadow-sm transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-serif text-lg font-bold text-stone-900">
                    Received Enquiries & Admission Requests
                  </h4>
                  <p className="text-xs text-stone-500">
                    Total: {enquiries.length} visitor enquiries recorded
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      closeAdminConfig();
                      openInquiriesModal();
                    }}
                    className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-sm shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>📥 Open Full Inquiries Inbox</span>
                  </button>

                  {enquiries.length > 0 && (
                    <>
                      <button
                        onClick={handleExportCSV}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-3 py-2 rounded-sm font-medium flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={clearEnquiries}
                        className="text-red-700 hover:bg-red-50 text-xs px-3 py-2 rounded-sm border border-red-200"
                      >
                        Clear All
                      </button>
                    </>
                  )}
                </div>
              </div>

              {enquiries.length === 0 ? (
                <div className="text-center py-16 text-stone-500 text-sm">
                  <p>No enquiries recorded yet.</p>
                  <p className="text-xs text-stone-400 mt-1">
                    When visitors submit the contact form, free demo request, course enquiry, or portrait request, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white border border-stone-200 p-4 rounded-sm shadow-xs space-y-2 hover:border-[#B85D38]/40 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-stone-900">{enq.name}</span>
                          <span className="text-xs text-stone-500 ml-2">
                            • {new Date(enq.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium uppercase">
                            {enq.serviceCategory.replace('-', ' ')}
                          </span>
                          <select
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                            className="text-xs border border-stone-300 rounded px-2 py-0.5 bg-stone-50"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="resolved">Resolved</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-stone-600 bg-stone-50 p-2.5 rounded">
                        <div>
                          <strong className="text-stone-700">Phone: </strong>
                          <a href={`tel:${enq.phone}`} className="text-[#B85D38] hover:underline">
                            {enq.phone}
                          </a>
                        </div>
                        <div>
                          <strong className="text-stone-700">Email: </strong>
                          <span>{enq.email || '—'}</span>
                        </div>
                        <div>
                          <strong className="text-stone-700">Location: </strong>
                          <span>{enq.countryOrCity || '—'}</span>
                        </div>
                      </div>

                      {enq.serviceDetail && (
                        <div className="text-xs text-stone-700">
                          <strong>Service of Interest:</strong> {enq.serviceDetail}
                        </div>
                      )}

                      {enq.message && (
                        <div className="text-xs text-stone-600 italic bg-amber-50/50 p-2.5 rounded border border-amber-100">
                          "{enq.message}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
