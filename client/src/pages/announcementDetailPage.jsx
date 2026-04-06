import { useState } from 'react';
import { useNavigate } from 'react-router';

import { useAnnouncement } from '../hooks/useAnnouncement';
import { FooterInfo } from '../modules/announcements/announcementsDetail/FooterInfo';
import { Header } from '../modules/announcements/announcementsDetail/Header';
import { ImageModal } from '../modules/announcements/announcementsDetail/ImageModal';
import { LeftPanel } from '../modules/announcements/announcementsDetail/LeftPanel';
import { LoadingSpinner } from '../modules/announcements/announcementsDetail/LoadingSpinner';
import { NotFound } from '../modules/announcements/announcementsDetail/NotFound';
import { TabContent } from '../modules/announcements/announcementsDetail/TabContent';
import { TabNavigation } from '../modules/announcements/announcementsDetail/TabNavigation';

export default function AnnouncementDetailPage() {
  const navigate = useNavigate();
  const { offer, loading } = useAnnouncement();
  const [activeTab, setActiveTab] = useState('travel');
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  if (loading) return <LoadingSpinner />;
  if (!offer) return <NotFound onBack={() => navigate(-1)} />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onBack={() => navigate(-1)}
      />

      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile Left Panel */}
        <div
          className={`lg:hidden mb-6 transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <LeftPanel offer={offer} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Desktop */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <div className="sticky top-24">
              <LeftPanel offer={offer} />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto">
              {/* Title Section */}
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
                <p className="text-base md:text-lg text-gray-600 mb-4">{offer.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {offer.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <TabNavigation
                activeTab={activeTab}
                activeSubTab={activeSubTab}
                onTabChange={setActiveTab}
                onSubTabChange={setActiveSubTab}
                sections={offer.sections}
              />

              {/* Tab Content */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 md:mb-8">
                <div className="p-4 md:p-6 lg:p-8">
                  <TabContent
                    offer={offer}
                    activeTab={activeTab}
                    activeSubTab={activeSubTab}
                    selectedGalleryImage={selectedGalleryImage}
                    onImageClick={setSelectedGalleryImage}
                  />
                </div>
              </div>

              {/* Footer Info */}
              <FooterInfo offer={offer} />
            </div>
          </div>
        </div>
      </div>

      <ImageModal image={selectedGalleryImage} onClose={() => setSelectedGalleryImage(null)} />
    </div>
  );
}
