import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBullhorn, FaTimes, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementModal() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const pressTimerRef = useRef(null);

  const [announcements] = useState([
    {
      id: 1,
      title: 'Перша пропозиція',
      description: 'Опис першої пропозиції',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
      address: 'Львівська область, м. Львів',
      category: 'Шляхотворець',
      price: 'Безкоштовно',
      author: 'Іван Іванов',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Друга пропозиція',
      description: 'Опис другої пропозиції',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60',
      address: 'Київська область, м. Буча',
      category: 'Організовую події',
      price: '500 грн',
      author: 'Петро Петренко',
      rating: 4.5
    },
    {
      id: 3,
      title: 'Третя пропозиція',
      description: 'Ще один опис пропозиції для перевірки скролу',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
      address: 'Одеська область, м. Одеса',
      category: 'Продаю тренажери',
      price: '15 000 грн',
      author: 'Максим Спорт',
      rating: 4.8
    },
    {
      id: 4,
      title: 'Четверта пропозиція',
      description: 'Тестовий опис четвертої пропозиції',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60',
      address: 'Харківська область, м. Харків',
      category: 'Шляхотворець',
      price: '1200 грн',
      author: 'Андрій Гірський',
      rating: 4.9
    },
  ]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setShowSidebar(false);
      setIsClosing(false);
    }, 300);
  };

  const handleOpenSidebar = () => {
    setShowSidebar(true);
    setIsClosing(false);
  };

  const handleLongPressStart = (announcement) => {
    pressTimerRef.current = setTimeout(() => {
      setSelectedAnnouncement(announcement);
    }, 500); // 500ms delay for long press
  };

  const handleLongPressEnd = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const closeModal = () => {
    setSelectedAnnouncement(null);
  };

  return (
    <>
      {/* Кнопка відкриття сайдбару */}
      <motion.button
        onClick={handleOpenSidebar}
        className="fixed bottom-8 left-5 z-[998] p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaBullhorn className="text-2xl" />
      </motion.button>

      {/* Сайдбар */}
      <AnimatePresence>
        {showSidebar && !isClosing && (
          <>
            {/* Напівпрозорий фон */}
            <motion.div
              className="fixed inset-0 z-40 flex"
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{
                opacity: 1,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(0,0,0,0.5)',
                transition: { duration: 0.3 },
              }}
              exit={{
                opacity: 0,
                backdropFilter: 'blur(0px)',
                transition: { duration: 0.3, ease: 'easeInOut' },
              }}
              onClick={handleClose}
              style={{ zIndex: 999 }}
            />

            {/* Панель сайдбару */}
            <motion.div
              className="fixed top-0 left-0 h-full w-96 z-1000 flex flex-col bg-gradient-to-br from-white to-gray-50 text-gray-900 border-r border-gray-200 shadow-2xl"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{
                x: 0,
                opacity: 1,
                transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
              }}
              exit={{
                x: '-100%',
                opacity: 0,
                transition: { duration: 0.3, ease: 'easeIn' },
              }}
            >
              {/* Header */}
              <div className="relative p-6 rounded-br-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <h2 className="text-2xl font-bold leading-tight">Пропозиції</h2>
                <p className="text-blue-100 mt-1 text-sm">
                  Перегляньте та додайте нові пропозиції
                </p>

                <motion.button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                </motion.button>
              </div>

              {/* Контент */}
              <div className="flex-1 flex flex-col p-6 space-y-6 min-h-0">
                {/* Кнопка додавання */}
                <motion.button
                  onClick={() => navigate('/create-announcement')}
                  className="w-full cursor-pointer py-3.5 rounded-xl font-semibold text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPlus className="text-sm" />
                  Додати нову пропозицію
                </motion.button>

                {/* Список пропозицій зі скролом */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                  {announcements.map((a) => (
                    <motion.div
                      key={a.id}
                      className="p-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      onMouseDown={() => handleLongPressStart(a)}
                      onMouseUp={handleLongPressEnd}
                      onMouseLeave={handleLongPressEnd}
                      onTouchStart={() => handleLongPressStart(a)}
                      onTouchEnd={handleLongPressEnd}
                    >
                      <h3 className="font-bold text-lg mb-1 text-gray-800">{a.title}</h3>
                      <p className="text-gray-500 text-xs italic mb-3">{a.address}</p>
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{a.description}</p>
                      <motion.button
                        onClick={() => navigate(`/offer/${a.id}`)}
                        className="text-xs px-3 py-1 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Детальніше
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-center text-sm text-gray-500">
                    Всього пропозицій: {announcements.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Модальне вікно для довгого утримування */}
      <AnimatePresence>
        {selectedAnnouncement && (
          <>
            {/* Фон */}
            <motion.div
              className="fixed inset-0 z-[1100] bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Модальне вікно */}
            <motion.div
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1101] w-11/12 max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Зображення */}
              <div className="relative h-48 bg-gray-200">
                <img
                  src={selectedAnnouncement.image}
                  alt={selectedAnnouncement.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-sm">
                  {selectedAnnouncement.price}
                </div>
              </div>

              {/* Контент */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 pr-4">
                    {selectedAnnouncement.title}
                  </h3>
                  <motion.button
                    onClick={closeModal}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes size={20} />
                  </motion.button>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  <span className="text-sm">{selectedAnnouncement.address}</span>
                </div>

                <p className="text-gray-700 mb-4 leading-relaxed">
                  {selectedAnnouncement.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Категорія: {selectedAnnouncement.category}</span>
                  <span>Автор: {selectedAnnouncement.author}</span>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => {
                      navigate(`/offer/${selectedAnnouncement.id}`);
                      closeModal();
                    }}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Детальніше
                  </motion.button>
                  <motion.button
                    onClick={closeModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Закрити
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}