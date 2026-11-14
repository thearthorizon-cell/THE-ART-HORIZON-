import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  BusinessConfig,
  CMSState,
  DemoModalPreset,
  DetailModalData,
  EnquiryCategory,
  EnquirySubmission,
  GalleryItem,
  PageId,
} from '../types';
import {
  DEFAULT_ANNOUNCEMENTS,
  DEFAULT_BUSINESS_CONFIG,
  DEFAULT_FOUNDER_PROFILE,
  DEFAULT_ONLINE_COURSES,
  DEFAULT_SITE_CONTENT,
} from '../data/siteConfig';
import { GALLERY_DATA } from '../data/galleryData';

interface StudioContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  navigateTo: (page: PageId, hashOrSection?: string) => void;
  businessConfig: BusinessConfig;
  updateBusinessConfig: (newConfig: Partial<BusinessConfig>) => void;
  resetBusinessConfig: () => void;
  // Enquiries (PIN-protected backend)
  enquiries: EnquirySubmission[];
  isLoadingEnquiries: boolean;
  newEnquiriesCount: number;
  refreshEnquiries: (pin?: string) => Promise<boolean>;
  addEnquiry: (submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>) => Promise<boolean>;
  lastEnquiryError: string;
  updateEnquiryStatus: (id: string, status: EnquirySubmission['status']) => Promise<boolean>;
  deleteEnquiry: (id: string) => Promise<boolean>;
  clearEnquiries: () => void;
  // Static Studio Content & Online Course Details
  cmsState: CMSState;
  selectedCourseSlug: string | null;
  setSelectedCourseSlug: (slug: string | null) => void;
  openCourseDetail: (slug: string) => void;
  // Admin Inquiries Auth (PIN protected)
  isAdminAuthenticated: boolean;
  isLoadingAdmin: boolean;
  verifyAndLoadAdmin: (pinOverride?: string) => Promise<{ ok: boolean; error?: string }>;
  clearAdminSession: () => void;
  // Modals
  isEnquiryModalOpen: boolean;
  activeEnquiryCategory: EnquiryCategory;
  activeEnquiryDetail: string;
  openEnquiryModal: (category?: EnquiryCategory, detail?: string) => void;
  closeEnquiryModal: () => void;
  isFreeDemoModalOpen: boolean;
  demoModalPreset: DemoModalPreset | null;
  openFreeDemoModal: (preset?: DemoModalPreset | React.MouseEvent<any>) => void;
  closeFreeDemoModal: () => void;
  isInquiriesModalOpen: boolean;
  openInquiriesModal: () => void;
  closeInquiriesModal: () => void;
  lightboxItem: GalleryItem | null;
  openLightbox: (item: GalleryItem) => void;
  closeLightbox: () => void;
  detailModalItem: DetailModalData | null;
  openDetailModal: (item: DetailModalData) => void;
  closeDetailModal: () => void;
  isGeminiChatOpen: boolean;
  openGeminiChat: () => void;
  closeGeminiChat: () => void;
  isWriteReviewModalOpen: boolean;
  openWriteReviewModal: () => void;
  closeWriteReviewModal: () => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const CONFIG_STORAGE_KEY = 'the_art_horizon_config_v2';
const STUDIO_PIN_SESSION_KEY = 'the_art_horizon_admin_pin';
const STUDIO_AUTH_SESSION_KEY = 'the_art_horizon_admin_auth';
const BROWSER_ENQUIRIES_STORAGE_KEY = 'the_art_horizon_enquiries_v1';

// Safe session storage wrapper with in-memory fallback (works even in restricted iframes)
const memorySessionMap = new Map<string, string>();
export const safeSessionGet = (key: string): string => {
  try {
    const val = window.sessionStorage.getItem(key);
    if (val !== null) return val;
  } catch {
    // ignore SecurityError in sandboxed iframes
  }
  return memorySessionMap.get(key) ?? '';
};

export const safeSessionSet = (key: string, value: string): void => {
  memorySessionMap.set(key, value);
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // ignore SecurityError
  }
};

export const safeSessionRemove = (key: string): void => {
  memorySessionMap.delete(key);
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // ignore SecurityError
  }
};

const readFallbackEnquiries = (): EnquirySubmission[] => {
  try {
    const raw = localStorage.getItem(BROWSER_ENQUIRIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as EnquirySubmission[]) : [];
  } catch {
    return [];
  }
};

const writeFallbackEnquiries = (list: EnquirySubmission[]): void => {
  try {
    localStorage.setItem(BROWSER_ENQUIRIES_STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore storage errors
  }
};

const RAW_API_BASE =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) || '';
const NORMALIZED_API_BASE = String(RAW_API_BASE).trim().replace(/\/+$/, '');

export const buildApiUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return NORMALIZED_API_BASE ? `${NORMALIZED_API_BASE}${cleanPath}` : cleanPath;
};

interface ApiResult<T = any> {
  ok: boolean;
  status: number;
  data: T | null;
  isJson: boolean;
  staticHostDetected?: boolean;
}

const xhrFallback = (
  url: string,
  init: RequestInit,
  withCredentials = true
): Promise<{ status: number; contentType: string; text: string }> => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open(init.method || 'GET', url, true);
      xhr.withCredentials = withCredentials;
      xhr.timeout = 12000;
      const headers = init.headers as Record<string, string> | undefined;
      if (headers) {
        for (const [k, v] of Object.entries(headers)) {
          xhr.setRequestHeader(k, v);
        }
      }
      xhr.onload = () => {
        resolve({
          status: xhr.status,
          contentType: xhr.getResponseHeader('content-type') || '',
          text: xhr.responseText || '',
        });
      };
      xhr.onerror = () => reject(new Error('XHR network error'));
      xhr.ontimeout = () => reject(new Error('XHR request timeout'));
      xhr.send((init.body as string | null) ?? null);
    } catch (err) {
      reject(err);
    }
  });
};

async function apiRequest<T = any>(url: string, init: RequestInit = {}, retries = 2): Promise<ApiResult<T>> {
  const fullUrl = buildApiUrl(url);
  const isCrossOrigin =
    typeof window !== 'undefined' &&
    /^https?:\/\//i.test(fullUrl) &&
    !fullUrl.startsWith(window.location.origin);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      let status = 0;
      let contentType = '';
      let rawText = '';

      try {
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timer = controller ? setTimeout(() => controller.abort(), 10000) : null;
        try {
          const res = await fetch(fullUrl, {
            ...init,
            cache: 'no-store',
            credentials: isCrossOrigin ? 'omit' : 'same-origin',
            signal: controller ? controller.signal : undefined,
          });
          status = res.status;
          contentType = res.headers.get('content-type') || '';
          rawText = await res.text();
        } finally {
          if (timer) clearTimeout(timer);
        }
      } catch {
        const xhrRes = await xhrFallback(fullUrl, init, !isCrossOrigin);
        status = xhrRes.status;
        contentType = xhrRes.contentType;
        rawText = xhrRes.text;
      }

      const trimmed = rawText.trim();
      const looksLikeJson = contentType.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[');
      let parsed: T | null = null;
      if (looksLikeJson && trimmed) {
        try {
          parsed = JSON.parse(trimmed) as T;
        } catch {
          parsed = null;
        }
      }

      const isStaticHtmlOrMethodBlocked =
        status === 405 ||
        (status === 404 && !looksLikeJson) ||
        (status >= 200 && status < 300 && !looksLikeJson && /<!doctype html|<html/i.test(trimmed));
      if (isStaticHtmlOrMethodBlocked) {
        return {
          ok: false,
          status,
          data: null,
          isJson: false,
          staticHostDetected: true,
        };
      }

      const isWarmupOrGatewayError = status === 502 || status === 503 || status === 504 || (!looksLikeJson && status >= 200);
      if (isWarmupOrGatewayError && attempt < retries) {
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }

      return {
        ok: status >= 200 && status < 300 && looksLikeJson && parsed !== null,
        status,
        data: parsed,
        isJson: looksLikeJson && parsed !== null,
      };
    } catch {
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 700));
        continue;
      }
      return { ok: false, status: 0, data: null, isJson: false };
    }
  }
  return { ok: false, status: 0, data: null, isJson: false };
}

const STATIC_STUDIO_STATE: CMSState = {
  founder: DEFAULT_FOUNDER_PROFILE,
  announcements: DEFAULT_ANNOUNCEMENTS,
  onlineCourses: DEFAULT_ONLINE_COURSES,
  galleryPhotos: GALLERY_DATA,
  siteContent: DEFAULT_SITE_CONTENT,
};

const VALID_PAGES: PageId[] = [
  'home',
  'about',
  'founder',
  'art-classes',
  'fine-art-courses',
  'online-classes',
  'portrait-commissions',
  'commercial-projects',
  'workshops',
  'gallery',
  'testimonials',
  'contact',
];

const parseRouteFromLocation = (): { page: PageId; courseSlug: string | null; openAdmin: boolean } => {
  if (typeof window === 'undefined') {
    return { page: 'home', courseSlug: null, openAdmin: false };
  }
  const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
  if (rawHash === 'admin' || rawHash === 'inbox' || rawHash === 'studio-backend' || rawHash === 'inquiries') {
    return { page: 'home', courseSlug: null, openAdmin: true };
  }

  const rawPath = rawHash || window.location.pathname.replace(/^\/+|\/+$/g, '').trim();
  const parts = rawPath.split('/').filter(Boolean);
  const firstSegment = parts[0] || '';

  if (firstSegment === 'admin' || firstSegment === 'inbox' || firstSegment === 'studio-backend' || firstSegment === 'inquiries') {
    return { page: 'home', courseSlug: null, openAdmin: true };
  }

  if (VALID_PAGES.includes(firstSegment as PageId)) {
    const page = firstSegment as PageId;
    const courseSlug = page === 'online-classes' && parts[1] ? parts[1] : null;
    return { page, courseSlug, openAdmin: false };
  }

  return { page: 'home', courseSlug: null, openAdmin: false };
};

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialRoute = parseRouteFromLocation();
  const [currentPage, setCurrentPage] = useState<PageId>(initialRoute.page);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(initialRoute.courseSlug);

  // Business Config state
  const [businessConfig, setBusinessConfig] = useState<BusinessConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_BUSINESS_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore fallback
    }
    return DEFAULT_BUSINESS_CONFIG;
  });

  // Static site state (replaces live CMS)
  const cmsState = STATIC_STUDIO_STATE;

  // Admin-only Enquiries state (never populated unless authenticated via PIN)
  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(false);
  const [lastEnquiryError, setLastEnquiryError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [activeEnquiryCategory, setActiveEnquiryCategory] = useState<EnquiryCategory>('general');
  const [activeEnquiryDetail, setActiveEnquiryDetail] = useState('');
  const [isFreeDemoModalOpen, setIsFreeDemoModalOpen] = useState(false);
  const [demoModalPreset, setDemoModalPreset] = useState<DemoModalPreset | null>(null);
  const [isInquiriesModalOpen, setIsInquiriesModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<DetailModalData | null>(null);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);

  const openGeminiChat = () => setIsGeminiChatOpen(true);
  const closeGeminiChat = () => setIsGeminiChatOpen(false);
  const openWriteReviewModal = () => setIsWriteReviewModalOpen(true);
  const closeWriteReviewModal = () => setIsWriteReviewModalOpen(false);
  const openInquiriesModal = () => setIsInquiriesModalOpen(true);
  const closeInquiriesModal = () => setIsInquiriesModalOpen(false);

  const activePinRef = useRef<string>(safeSessionGet(STUDIO_PIN_SESSION_KEY).trim());

  const getStoredPin = () => (activePinRef.current || safeSessionGet(STUDIO_PIN_SESSION_KEY)).trim();

  const buildPinHeaders = (pin: string, withJsonContentType = false): Record<string, string> => {
    const headers: Record<string, string> = {
      'x-studio-pin': pin,
      Authorization: `Bearer ${pin}`,
    };
    if (withJsonContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  };

  // Fetch enquiries from server ONLY with valid Studio PIN
  const refreshEnquiries = useCallback(async (pinOverride?: string): Promise<boolean> => {
    const pin = (pinOverride ?? getStoredPin()).trim();
    if (!pin) {
      setEnquiries([]);
      setIsAdminAuthenticated(false);
      return false;
    }

    setIsLoadingEnquiries(true);
    try {
      const res = await apiRequest<any>('/api/enquiries', {
        headers: buildPinHeaders(pin),
      });
      if (res.ok && res.data && Array.isArray(res.data.enquiries)) {
        if (res.data.mode === 'browser-fallback') {
          setEnquiries(readFallbackEnquiries());
        } else {
          setEnquiries(res.data.enquiries);
        }
        setIsAdminAuthenticated(true);
        return true;
      }
      if (res.status === 401 || res.status === 429) {
        setEnquiries([]);
        setIsAdminAuthenticated(false);
        if (res.status === 401) {
          activePinRef.current = '';
          safeSessionRemove(STUDIO_PIN_SESSION_KEY);
          safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
        }
        return false;
      }
    } finally {
      setIsLoadingEnquiries(false);
    }
    return false;
  }, []);

  // Verify PIN and load Enquiries Inbox
  const verifyAndLoadAdmin = useCallback(
    async (pinOverride?: string): Promise<{ ok: boolean; error?: string }> => {
      const pin = (pinOverride ?? getStoredPin()).trim();
      if (!pin) {
        return { ok: false, error: 'Please enter the Studio PIN.' };
      }

      setIsLoadingAdmin(true);
      try {
        const loginRes = await apiRequest<any>('/api/admin/login', {
          method: 'POST',
          headers: buildPinHeaders(pin, true),
          body: JSON.stringify({ pin }),
        });

        if (loginRes.status === 429) {
          return {
            ok: false,
            error: loginRes.data?.error || 'Too many failed PIN attempts. Please try again later.',
          };
        }

        if (loginRes.status === 401) {
          activePinRef.current = '';
          safeSessionRemove(STUDIO_PIN_SESSION_KEY);
          safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
          setEnquiries([]);
          setIsAdminAuthenticated(false);
          return {
            ok: false,
            error: 'Incorrect Studio PIN. Only authorized studio administrators can unlock this portal.',
          };
        }

        if (loginRes.ok && loginRes.data?.ok) {
          activePinRef.current = pin;
          safeSessionSet(STUDIO_PIN_SESSION_KEY, pin);
          safeSessionSet(STUDIO_AUTH_SESSION_KEY, 'true');
          setIsAdminAuthenticated(true);
          if (loginRes.data.mode === 'browser-fallback') {
            setEnquiries(readFallbackEnquiries());
          } else if (Array.isArray(loginRes.data.enquiries)) {
            setEnquiries(loginRes.data.enquiries);
          }
          return { ok: true };
        }

        if (loginRes.staticHostDetected) {
          return {
            ok: false,
            error: `Static hosting detected (HTTP ${loginRes.status}) — please deploy the updated Cloudflare Worker (worker.ts + wrangler.jsonc) so /api/* routes are active.`,
          };
        }

        if (loginRes.status === 0) {
          return {
            ok: false,
            error: 'Unable to connect to Studio server right now. Please wait a moment and try again.',
          };
        }

        return {
          ok: false,
          error: loginRes.data?.error || `Studio server returned status ${loginRes.status}. Please try again.`,
        };
      } finally {
        setIsLoadingAdmin(false);
      }
    },
    []
  );

  useEffect(() => {
    if (getStoredPin()) {
      verifyAndLoadAdmin();
    }
  }, [verifyAndLoadAdmin]);

  // Sync route changes with clean browser path & legacy URL hashes
  useEffect(() => {
    const handleLocationChange = () => {
      const parsed = parseRouteFromLocation();
      if (parsed.openAdmin) {
        setIsInquiriesModalOpen(true);
        return;
      }
      setCurrentPage(parsed.page);
      setSelectedCourseSlug(parsed.courseSlug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (initialRoute.openAdmin) {
      setIsInquiriesModalOpen(true);
    }

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (page: PageId, hashOrSection?: string) => {
    setCurrentPage(page);
    if (page !== 'online-classes') {
      setSelectedCourseSlug(null);
    } else if (!hashOrSection) {
      setSelectedCourseSlug(null);
    } else {
      setSelectedCourseSlug(hashOrSection);
    }
    const cleanPath =
      page === 'home'
        ? '/'
        : hashOrSection
        ? `/${page}/${hashOrSection}`
        : `/${page}`;
    try {
      if (window.location.pathname !== cleanPath || window.location.hash) {
        window.history.pushState({}, '', cleanPath);
      }
    } catch {
      window.location.hash = hashOrSection ? `#/${page}/${hashOrSection}` : `#/${page}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCourseDetail = (slug: string) => {
    setSelectedCourseSlug(slug);
    setCurrentPage('online-classes');
    const cleanPath = `/online-classes/${slug}`;
    try {
      if (window.location.pathname !== cleanPath || window.location.hash) {
        window.history.pushState({}, '', cleanPath);
      }
    } catch {
      window.location.hash = `#/online-classes/${slug}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateBusinessConfig = (newConfig: Partial<BusinessConfig>) => {
    setBusinessConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save business config', e);
      }
      return updated;
    });
  };

  const resetBusinessConfig = () => {
    setBusinessConfig(DEFAULT_BUSINESS_CONFIG);
    try {
      localStorage.removeItem(CONFIG_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Add inquiry with persistent server sync (falls back to browser storage when KV is not yet bound on Cloudflare)
  const addEnquiry = async (
    submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>
  ): Promise<boolean> => {
    setLastEnquiryError('');
    const res = await apiRequest<any>('/api/enquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        serviceCategory: submission.serviceCategory,
        serviceDetail: submission.serviceDetail,
        countryOrCity: submission.countryOrCity,
        studentAge: submission.studentAge,
        timeSlotPreference: submission.timeSlotPreference,
        message: submission.message,
      }),
    });

    if (res.ok && res.data?.enquiry) {
      if (res.data.mode === 'browser-fallback') {
        const updated = [res.data.enquiry as EnquirySubmission, ...readFallbackEnquiries()];
        writeFallbackEnquiries(updated);
      }
      if (getStoredPin()) {
        setEnquiries((prev) => [res.data.enquiry, ...prev]);
        refreshEnquiries();
      }
      return true;
    }

    if (res.staticHostDetected) {
      setLastEnquiryError(
        'This domain is serving static files without API Functions active. Please tap WhatsApp below to send your enquiry directly.'
      );
    } else {
      setLastEnquiryError(
        res.data?.error || 'Could not reach the studio server right now. Please try again or reach us on WhatsApp.'
      );
    }

    return false;
  };

  const updateEnquiryStatus = async (id: string, status: EnquirySubmission['status']): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;

    setEnquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));

    const res = await apiRequest<any>(`/api/enquiries/${id}`, {
      method: 'PATCH',
      headers: buildPinHeaders(pin, true),
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      if (res.data?.mode === 'browser-fallback') {
        const updated = readFallbackEnquiries().map((item) => (item.id === id ? { ...item, status } : item));
        writeFallbackEnquiries(updated);
        setEnquiries(updated);
        return true;
      }
      await refreshEnquiries(pin);
      return true;
    }
    await refreshEnquiries(pin);
    return false;
  };

  const deleteEnquiry = async (id: string): Promise<boolean> => {
    const pin = getStoredPin();
    if (!pin) return false;

    setEnquiries((prev) => prev.filter((item) => item.id !== id));

    const res = await apiRequest<any>(`/api/enquiries/${id}`, {
      method: 'DELETE',
      headers: buildPinHeaders(pin),
    });
    if (res.ok) {
      if (res.data?.mode === 'browser-fallback') {
        const updated = readFallbackEnquiries().filter((item) => item.id !== id);
        writeFallbackEnquiries(updated);
        setEnquiries(updated);
        return true;
      }
      await refreshEnquiries(pin);
      return true;
    }
    await refreshEnquiries(pin);
    return false;
  };

  const clearEnquiries = () => {
    setEnquiries([]);
  };

  const clearAdminSession = () => {
    activePinRef.current = '';
    safeSessionRemove(STUDIO_PIN_SESSION_KEY);
    safeSessionRemove(STUDIO_AUTH_SESSION_KEY);
    setEnquiries([]);
    setIsAdminAuthenticated(false);
  };

  const openEnquiryModal = (category: EnquiryCategory = 'general', detail: string = '') => {
    setLastEnquiryError('');
    setActiveEnquiryCategory(category);
    setActiveEnquiryDetail(detail);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setLastEnquiryError('');
    setIsEnquiryModalOpen(false);
  };

  const openFreeDemoModal = (preset?: DemoModalPreset | React.MouseEvent<any>) => {
    setLastEnquiryError('');
    if (
      preset &&
      typeof preset === 'object' &&
      !('nativeEvent' in preset) &&
      ('courseTitle' in preset || 'ageGroup' in preset || 'mode' in preset)
    ) {
      setDemoModalPreset(preset as DemoModalPreset);
    } else {
      setDemoModalPreset(null);
    }
    setIsFreeDemoModalOpen(true);
  };

  const closeFreeDemoModal = () => {
    setLastEnquiryError('');
    setIsFreeDemoModalOpen(false);
    setDemoModalPreset(null);
  };

  const openLightbox = (item: GalleryItem) => {
    setLightboxItem(item);
  };

  const closeLightbox = () => {
    setLightboxItem(null);
  };

  const openDetailModal = (item: DetailModalData) => {
    setDetailModalItem(item);
  };

  const closeDetailModal = () => {
    setDetailModalItem(null);
  };

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <StudioContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        navigateTo,
        businessConfig,
        updateBusinessConfig,
        resetBusinessConfig,
        enquiries,
        isLoadingEnquiries,
        newEnquiriesCount,
        refreshEnquiries,
        addEnquiry,
        lastEnquiryError,
        updateEnquiryStatus,
        deleteEnquiry,
        clearEnquiries,
        cmsState,
        selectedCourseSlug,
        setSelectedCourseSlug,
        openCourseDetail,
        isAdminAuthenticated,
        isLoadingAdmin,
        verifyAndLoadAdmin,
        clearAdminSession,
        isEnquiryModalOpen,
        activeEnquiryCategory,
        activeEnquiryDetail,
        openEnquiryModal,
        closeEnquiryModal,
        isFreeDemoModalOpen,
        demoModalPreset,
        openFreeDemoModal,
        closeFreeDemoModal,
        isInquiriesModalOpen,
        openInquiriesModal,
        closeInquiriesModal,
        lightboxItem,
        openLightbox,
        closeLightbox,
        detailModalItem,
        openDetailModal,
        closeDetailModal,
        isGeminiChatOpen,
        openGeminiChat,
        closeGeminiChat,
        isWriteReviewModalOpen,
        openWriteReviewModal,
        closeWriteReviewModal,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
};
