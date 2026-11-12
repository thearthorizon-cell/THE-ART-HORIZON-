import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessConfig, DetailModalData, EnquiryCategory, EnquirySubmission, GalleryItem, PageId } from '../types';
import { DEFAULT_BUSINESS_CONFIG } from '../data/siteConfig';

interface StudioContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  navigateTo: (page: PageId, hashOrSection?: string) => void;
  businessConfig: BusinessConfig;
  updateBusinessConfig: (newConfig: Partial<BusinessConfig>) => void;
  resetBusinessConfig: () => void;
  enquiries: EnquirySubmission[];
  addEnquiry: (submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: EnquirySubmission['status']) => void;
  clearEnquiries: () => void;
  isEnquiryModalOpen: boolean;
  activeEnquiryCategory: EnquiryCategory;
  activeEnquiryDetail: string;
  openEnquiryModal: (category?: EnquiryCategory, detail?: string) => void;
  closeEnquiryModal: () => void;
  isFreeDemoModalOpen: boolean;
  openFreeDemoModal: () => void;
  closeFreeDemoModal: () => void;
  isAdminConfigOpen: boolean;
  openAdminConfig: () => void;
  closeAdminConfig: () => void;
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
const ENQUIRIES_STORAGE_KEY = 'the_art_horizon_enquiries_v1';

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page Routing via window.location.hash
  const getInitialPage = (): PageId => {
    const hash = window.location.hash.replace('#/', '').replace('#', '').trim();
    const validPages: PageId[] = [
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
    if (validPages.includes(hash as PageId)) {
      return hash as PageId;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState<PageId>(getInitialPage());

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

  // Enquiries state
  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>(() => {
    try {
      const saved = localStorage.getItem(ENQUIRIES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Ignore fallback
    }
    return [];
  });

  // Modals state
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [activeEnquiryCategory, setActiveEnquiryCategory] = useState<EnquiryCategory>('general');
  const [activeEnquiryDetail, setActiveEnquiryDetail] = useState('');
  const [isFreeDemoModalOpen, setIsFreeDemoModalOpen] = useState(false);
  const [isAdminConfigOpen, setIsAdminConfigOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [detailModalItem, setDetailModalItem] = useState<DetailModalData | null>(null);
  const [isGeminiChatOpen, setIsGeminiChatOpen] = useState(false);
  const [isWriteReviewModalOpen, setIsWriteReviewModalOpen] = useState(false);

  const openGeminiChat = () => setIsGeminiChatOpen(true);
  const closeGeminiChat = () => setIsGeminiChatOpen(false);
  const openWriteReviewModal = () => setIsWriteReviewModalOpen(true);
  const closeWriteReviewModal = () => setIsWriteReviewModalOpen(false);

  // Sync route changes with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const page = getInitialPage();
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageId, hashOrSection?: string) => {
    setCurrentPage(page);
    window.location.hash = hashOrSection ? `#/${page}/${hashOrSection}` : `#/${page}`;
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

  const addEnquiry = (submission: Omit<EnquirySubmission, 'id' | 'createdAt' | 'status'>) => {
    const newEntry: EnquirySubmission = {
      ...submission,
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    setEnquiries((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save enquiry', e);
      }
      return updated;
    });
  };

  const updateEnquiryStatus = (id: string, status: EnquirySubmission['status']) => {
    setEnquiries((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, status } : item));
      try {
        localStorage.setItem(ENQUIRIES_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const clearEnquiries = () => {
    setEnquiries([]);
    try {
      localStorage.removeItem(ENQUIRIES_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const openEnquiryModal = (category: EnquiryCategory = 'general', detail: string = '') => {
    setActiveEnquiryCategory(category);
    setActiveEnquiryDetail(detail);
    setIsEnquiryModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsEnquiryModalOpen(false);
  };

  const openFreeDemoModal = () => {
    setIsFreeDemoModalOpen(true);
  };

  const closeFreeDemoModal = () => {
    setIsFreeDemoModalOpen(false);
  };

  const openAdminConfig = () => {
    setIsAdminConfigOpen(true);
  };

  const closeAdminConfig = () => {
    setIsAdminConfigOpen(false);
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
        addEnquiry,
        updateEnquiryStatus,
        clearEnquiries,
        isEnquiryModalOpen,
        activeEnquiryCategory,
        activeEnquiryDetail,
        openEnquiryModal,
        closeEnquiryModal,
        isFreeDemoModalOpen,
        openFreeDemoModal,
        closeFreeDemoModal,
        isAdminConfigOpen,
        openAdminConfig,
        closeAdminConfig,
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
