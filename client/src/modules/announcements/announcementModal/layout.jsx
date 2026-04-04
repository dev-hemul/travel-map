import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import AddButton from './addButton';
import AnnouncementButton from './announcementButton';
import AnnouncementList from './announcementList';
import ModalFooter from './ModalFooter';
import ModalOverlay from './modalOverlay';
import ModalSidebar from './modalSidebar';
import { useAnimationVariants } from './useAnimationVariants';

import { useDeviceType, usePerformanceOptimization } from '@/utils';

const AnnouncementModal = () => {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { isMobile } = useDeviceType();
  const { isLowPerf, shouldReduceMotion, getAnimationDuration } = usePerformanceOptimization();
  const { overlayVariants, sidebarVariants } = useAnimationVariants(isLowPerf, shouldReduceMotion);

  const [announcements] = useState([
    {
      id: 1,
      title: 'Перша пропозиція',
      description: 'Опис першої пропозиції',
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=30',
      address: 'Львівська область, м. Львів',
      category: 'Шляхотворець',
      author: 'Іван Іванов',
      rating: 4.8,
      price: 'Безкоштовно',
    },
    {
      id: 2,
      title: 'Друга пропозиція',
      description: 'Опис другої пропозиції',
      image:
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=30',
      address: 'Київська область, м. Буча',
      category: 'Організовую події',
      author: 'Петро Петренко',
      rating: 4.5,
      price: '500 грн',
    },
    {
      id: 3,
      title: 'Третя пропозиція',
      description: 'Ще один опис пропозиції для перевірки скролу',
      image:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=30',
      address: 'Одеська область, м. Одеса',
      category: 'Продаю тренажери',
      author: 'Марія Сидоренко',
      rating: 4.9,
      price: '1500 грн',
    },
    {
      id: 4,
      title: 'Четверта пропозиція',
      description: 'Тестовий опис четвертої пропозиції',
      image:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=30',
      address: 'Харківська область, м. Харків',
      category: 'Шляхотворець',
      author: 'Олег Коваль',
      rating: 4.7,
      price: 'Безкоштовно',
    },
  ]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    const duration = getAnimationDuration(0.25, 0.15);
    setTimeout(() => {
      setShowSidebar(false);
      setIsClosing(false);
    }, duration * 1000);
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setIsClosing(false);
  };

  const handleDetailsClick = announcement => {
    navigate(`/announcement/${announcement.id}`);
  };

  return (
    <>
      <AnnouncementButton
        onClick={handleOpenSidebar}
        isLowPerf={isLowPerf}
        shouldReduceMotion={shouldReduceMotion}
      />

      <AnimatePresence mode="wait">
        {showSidebar && !isClosing && (
          <>
            <ModalOverlay onClick={handleClose} variants={overlayVariants} isLowPerf={isLowPerf} />

            <ModalSidebar
              variants={sidebarVariants}
              onClose={handleClose}
              isMobile={isMobile}
              isLowPerf={isLowPerf}
            >
              <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
                <AddButton />
                <AnnouncementList
                  announcements={announcements}
                  onDetailsClick={handleDetailsClick}
                />
                <ModalFooter count={announcements.length} />
              </div>
            </ModalSidebar>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnnouncementModal;
