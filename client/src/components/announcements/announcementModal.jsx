import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaBullhorn, FaTimes, FaPlus, FaInfoCircle, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementModal() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isLowPerf, setIsLowPerf] = useState(false);

  // Виявлення слабких пристроїв
  useEffect(() => {
    const checkPerformance = () => {
      // Перевірка на мобільний пристрій
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Перевірка на малий екран
      const isSmallScreen = window.innerWidth <= 768;

      // Перевірка на апаратне забезпечення
      const isLowMemory = navigator.deviceMemory ? navigator.deviceMemory < 4 : false;
      const isLowCPU = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;

      setIsLowPerf(isMobile || isSmallScreen || isLowMemory || isLowCPU);
    };

    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

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
    // Швидше закриття для слабких пристроїв
    setTimeout(
      () => {
        setShowSidebar(false);
        setIsClosing(false);
      },
      isLowPerf ? 150 : 250
    );
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setIsClosing(false);
  };

  const handleDetailsClick = announcement => {
    navigate(`/announcement/${announcement.id}`);
  };

  // Спрощені анімації для слабких пристроїв
  const overlayVariants = isLowPerf
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        initial: { opacity: 0, backdropFilter: 'blur(0px)' },
        animate: {
          opacity: 1,
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.5)',
          transition: { duration: 0.25 },
        },
        exit: {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          transition: { duration: 0.2 },
        },
      };

  const sidebarVariants = isLowPerf
    ? {
        initial: { x: '-100%' },
        animate: { x: 0, transition: { duration: 0.2 } },
        exit: { x: '-100%', transition: { duration: 0.15 } },
      }
    : {
        initial: { x: '-100%', opacity: 0 },
        animate: {
          x: 0,
          opacity: 1,
          transition: { duration: 0.3, ease: 'easeOut' },
        },
        exit: {
          x: '-100%',
          opacity: 0,
          transition: { duration: 0.25, ease: 'easeIn' },
        },
      };

  return (
    <>
      {/* Кнопка відкриття сайдбару */}
      <motion.button
        onClick={handleOpenSidebar}
        className="fixed bottom-6 left-4 z-[998] p-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg active:shadow-xl transition-shadow duration-200 flex items-center justify-center"
        whileHover={!isLowPerf ? { scale: 1.05 } : {}}
        whileTap={!isLowPerf ? { scale: 0.95 } : {}}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        <FaBullhorn className="text-xl sm:text-2xl" />
      </motion.button>

      {/* Сайдбар */}
      <AnimatePresence mode="wait">
        {showSidebar && !isClosing && (
          <>
            {/* Напівпрозорий фон */}
            <motion.div
              className="fixed inset-0 z-[9998]"
              variants={overlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={handleClose}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                pointerEvents: 'auto',
                willChange: isLowPerf ? 'opacity' : 'opacity, backdrop-filter',
              }}
            />

            {/* Панель сайдбару */}
            <motion.div
              className="fixed top-0 left-0 h-full w-full sm:w-96 z-[9999] flex flex-col bg-white text-gray-900 border-r border-gray-200 shadow-2xl"
              variants={sidebarVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{
                willChange: 'transform',
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                WebkitFontSmoothing: 'antialiased',
              }}
            >
              {/* Header */}
              <div className="relative px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="pr-8">
                  <h2 className="text-xl sm:text-2xl font-bold leading-tight">Пропозиції</h2>
                  <p className="text-blue-100 mt-0.5 text-xs sm:text-sm">
                    Перегляньте та додайте нові пропозиції
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 active:bg-white/30 transition-colors text-white"
                  style={{
                    WebkitTapHighlightColor: 'transparent',
                    touchAction: 'manipulation',
                  }}
                >
                  <FaTimes className="text-sm sm:text-base" />
                </button>
              </div>

              {/* Контент */}
              <div className="flex-1 flex flex-col min-h-0 bg-gray-50">
                {/* Кнопка додавання */}
                <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
                  <button
                    onClick={() => navigate('/create-announcement')}
                    className="w-full py-3 sm:py-3.5 rounded-xl font-semibold text-white shadow-md active:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 active:from-blue-700 active:to-indigo-800"
                    style={{
                      WebkitTapHighlightColor: 'transparent',
                      touchAction: 'manipulation',
                    }}
                  >
                    <FaPlus className="text-xs sm:text-sm" />
                    Додати нову пропозицію
                  </button>
                </div>

                {/* Список пропозицій зі скролом */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 space-y-3">
                  {announcements.map(a => (
                    <div
                      key={a.id}
                      className="relative p-3 sm:p-4 rounded-xl border border-gray-200 bg-white active:border-blue-300 transition-colors"
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold sm:font-bold text-sm sm:text-base text-gray-800 pr-2">
                          {a.title}
                        </h3>
                        <span
                          className={`flex-shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                            a.category === 'Шляхотворець'
                              ? 'bg-purple-100 text-purple-800'
                              : a.category === 'Організовую події'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {a.category}
                        </span>
                      </div>

                      <p className="text-gray-500 text-[10px] sm:text-xs italic mb-2">
                        {a.address}
                      </p>

                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg mb-3"
                        loading="lazy"
                        decoding="async"
                      />

                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm font-medium text-gray-700">
                            {a.author}
                          </span>
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                                    i < Math.floor(a.rating) ? 'text-yellow-400' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-500">{a.rating}</span>
                          </div>
                        </div>
                        <span className="font-bold text-xs sm:text-sm text-green-600">
                          {a.price}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                        {a.description}
                      </p>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleDetailsClick(a);
                        }}
                        className="w-full px-3 py-1.5 sm:py-2 rounded-lg bg-blue-50 active:bg-blue-100 text-blue-700 transition-colors font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                        }}
                      >
                        <FaInfoCircle className="text-xs sm:text-sm" />
                        Детальніше
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white">
                  <p className="text-center text-xs sm:text-sm text-gray-500">
                    Всього пропозицій: {announcements.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
