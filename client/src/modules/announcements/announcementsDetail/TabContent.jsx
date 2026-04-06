import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

import { PortfolioSection } from './sections/PortfolioSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ReportsSection } from './sections/ReportsSection';
import { ReviewsSection } from './sections/ReviewsSection';
import { SpoonsGallery } from './sections/SpoonsGallery';
import { VideoSection } from './sections/VideoSection';

export const TabContent = ({
  offer,
  activeTab,
  activeSubTab,
  onShowFullDescription,
  onImageClick,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const section = offer.sections[activeTab];

  if (!section) return null;

  const handleToggleDescription = () => {
    const newValue = !showFullDescription;
    setShowFullDescription(newValue);
    onShowFullDescription?.(newValue);
  };

  switch (activeSubTab) {
    case 'details':
      return (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h2>
            <p className="text-lg text-gray-600 mt-2">{section.subtitle}</p>
          </div>

          {activeTab === 'travel' && section.videos?.length > 0 && (
            <VideoSection section={section} />
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed text-base md:text-lg">
              {showFullDescription ? section.fullDescription : section.description}
            </div>
            {section.fullDescription?.length > 300 && (
              <button
                onClick={handleToggleDescription}
                className="text-[#e65000] font-medium hover:text-[#d45c00] cursor-pointer flex items-center gap-2 text-base"
              >
                <span>{showFullDescription ? 'Згорнути опис' : 'Читати повністю'}</span>
                <FiChevronRight className="mt-0.5" />
              </button>
            )}
          </div>

          {activeTab === 'travel' && section.projects && (
            <ProjectsSection projects={section.projects} />
          )}

          {activeTab === 'websites' && section.portfolio && (
            <PortfolioSection portfolio={section.portfolio} />
          )}

          {activeTab === 'spoons' && section.images && (
            <SpoonsGallery images={section.images} onImageClick={onImageClick} />
          )}
        </div>
      );

    case 'reports':
      return <ReportsSection section={section} activeTab={activeTab} />;

    case 'reviews':
      return <ReviewsSection section={section} />;

    case 'videos':
      return <VideoSection section={section} />;

    default:
      return null;
  }
};
