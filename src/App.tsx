/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { EnquiryModal } from './components/common/EnquiryModal';
import { FreeDemoModal } from './components/common/FreeDemoModal';
import { Lightbox } from './components/common/Lightbox';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { ItemDetailModal } from './components/common/ItemDetailModal';
import { SEOHead } from './components/common/SEOHead';
import { GeminiChatModal } from './components/chat/GeminiChatModal';
import { GeminiFloatingButton } from './components/chat/GeminiFloatingButton';
import { WriteReviewModal } from './components/common/WriteReviewModal';
import { InquiriesInboxModal } from './components/common/InquiriesInboxModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FounderPage } from './pages/FounderPage';
import { ArtClassesPage } from './pages/ArtClassesPage';
import { FineArtCoursesPage } from './pages/FineArtCoursesPage';
import { OnlineClassesPage } from './pages/OnlineClassesPage';
import { PortraitCommissionsPage } from './pages/PortraitCommissionsPage';
import { CommercialProjectsPage } from './pages/CommercialProjectsPage';
import { WorkshopsPage } from './pages/WorkshopsPage';
import { GalleryPage } from './pages/GalleryPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';

const MainContent: React.FC = () => {
  const {
    currentPage,
    isGeminiChatOpen,
    openGeminiChat,
    closeGeminiChat,
    isWriteReviewModalOpen,
    closeWriteReviewModal,
  } = useStudio();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'founder':
        return <FounderPage />;
      case 'art-classes':
        return <ArtClassesPage />;
      case 'fine-art-courses':
        return <FineArtCoursesPage />;
      case 'online-classes':
        return <OnlineClassesPage />;
      case 'portrait-commissions':
        return <PortraitCommissionsPage />;
      case 'commercial-projects':
        return <CommercialProjectsPage />;
      case 'workshops':
        return <WorkshopsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'testimonials':
        return <TestimonialsPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 antialiased selection:bg-[#B85D38]/20 selection:text-[#8C4A2D]">
      <SEOHead page={currentPage} />
      <Header />
      <main className="flex-1">{renderCurrentPage()}</main>
      <Footer />

      {/* Global Interactive Overlays */}
      <ItemDetailModal />
      <EnquiryModal />
      <FreeDemoModal />
      <Lightbox />
      <WhatsAppButton />
      <GeminiFloatingButton onClick={openGeminiChat} />
      <GeminiChatModal isOpen={isGeminiChatOpen} onClose={closeGeminiChat} />
      <WriteReviewModal isOpen={isWriteReviewModalOpen} onClose={closeWriteReviewModal} />
      <InquiriesInboxModal />
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <MainContent />
    </StudioProvider>
  );
}
