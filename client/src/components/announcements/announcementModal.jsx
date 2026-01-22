import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaBullhorn, FaTimes, FaPlus, FaInfoCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function AnnouncementModal() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  
  const [announcements] = useState([
    {
      id: 1,
      title: 'Перша пропозиція',
      description: 'Опис першої пропозиції',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
      address: 'Львівська область, м. Львів',
      category: 'Шляхотворець',
      author: 'Іван Іванов',
      rating: 4.8,
      price: 'Безкоштовно'
    },
    {
      id: 2,
      title: 'Друга пропозиція',
      description: 'Опис другої пропозиції',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60',
      address: 'Київська область, м. Буча',
      category: 'Організовую події',
      author: 'Петро Петренко',
      rating: 4.5,
      price: '500 грн'
    },
    {
      id: 3,
      title: 'Третя пропозиція',
      description: 'Ще один опис пропозиції для перевірки скролу',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=60',
      address: 'Одеська область, м. Одеса',
      category: 'Продаю тренажери',
      author: 'Марія Сидоренко',
      rating: 4.9,
      price: '1500 грн'
    },
    {
      id: 4,
      title: 'Четверта пропозиція',
      description: 'Тестовий опис четвертої пропозиції',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60',
      address: 'Харківська область, м. Харків',
      category: 'Шляхотворець',
      author: 'Олег Коваль',
      rating: 4.7,
      price: 'Безкоштовно'
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

  const handleDetailsClick = (announcement) => {
    navigate(`/announcement/${announcement.id}`);
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
                <p className="text-blue-100 mt-1 text-sm">Перегляньте та додайте нові пропозиції</p>

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
                  {announcements.map(a => (
                    <motion.div
                      key={a.id}
                      className="relative p-4 rounded-xl border-2 border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-lg mb-1 text-gray-800">{a.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          a.category === 'Шляхотворець' ? 'bg-purple-100 text-purple-800' :
                          a.category === 'Організовую події' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {a.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-500 text-xs italic mb-3">{a.address}</p>
                      <img
                        src={a.image}
                        alt={a.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">{a.author}</span>
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaTimes 
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(a.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{a.rating}</span>
                          </div>
                        </div>
                        <span className="font-bold text-green-600">{a.price}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{a.description}</p>
                      
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDetailsClick(a);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaInfoCircle />
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
    </>
  );
}