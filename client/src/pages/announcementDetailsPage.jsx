import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, 
  FiMap, 
  FiStar, 
  FiMessageCircle, 
  FiShare2,
  FiCalendar,
  FiDollarSign,
  FiUser,
  FiHeart
} from 'react-icons/fi';

export default function AnnouncementDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  // Мокові дані - в реальному додатку тут буде запит до API
  const mockOffers = [
    {
      id: 1,
      title: 'Перша пропозиція',
      description: 'Детальний опис першої пропозиції. Тут може бути багато тексту про те, що саме пропонує користувач, які переваги та особливості.',
      fullDescription: 'Повний детальний опис пропозиції. Може включати в себе:\n• Перелік послуг\n• Умови надання\n• Терміни виконання\n• Особливі умови\n\nЦе може бути довгий текст з форматуванням.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60',
      address: 'Львівська область, м. Львів',
      category: 'Шляхотворець',
      author: {
        name: 'Іван Іванов',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=60',
        rating: 4.8,
        reviews: 24
      },
      price: 'Безкоштовно',
      date: '2024-01-15',
      reviews: [
        { id: 1, user: 'Олександр П.', rating: 5, text: 'Чудова пропозиція! Все сподобалося.', date: '2024-01-10' },
        { id: 2, user: 'Марія К.', rating: 4, text: 'Дуже корисно, рекомендую!', date: '2024-01-08' }
      ],
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=Lviv,Ukraine&zoom=13&size=400x200&key=demo'
    },
    {
      id: 2,
      title: 'Друга пропозиція',
      description: 'Опис другої пропозиції',
      fullDescription: 'Повний опис другої пропозиції з деталями та особливостями.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60',
      address: 'Київська область, м. Буча',
      category: 'Організовую події',
      author: {
        name: 'Петро Петренко',
        avatar: null,
        rating: 4.5,
        reviews: 15
      },
      price: '500 грн',
      date: '2024-01-20',
      reviews: [
        { id: 1, user: 'Анна М.', rating: 5, text: 'Враження незабутні!', date: '2024-01-12' }
      ],
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=Kyiv,Ukraine&zoom=13&size=400x200&key=demo'
    }
  ];

  useEffect(() => {
    // Симуляція завантаження даних
    const timer = setTimeout(() => {
      const foundOffer = mockOffers.find(o => o.id === parseInt(id));
      setOffer(foundOffer);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#744ce9] mx-auto"></div>
          <p className="mt-4 text-lg text-[#744ce9] font-medium">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Пропозицію не знайдено</h2>
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#744ce9] text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Повернутись назад
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, backgroundColor: "#F4EFFF", color: "#744ce9" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-sm bg-white text-[#744ce9] py-2 px-4 rounded-md shadow border-2 border-[#744ce9] cursor-pointer transition-all duration-200"
            >
              <FiArrowLeft size={16} />
              <span>Назад</span>
            </motion.button>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-600 hover:text-[#744ce9] cursor-pointer transition-colors"
              >
                <FiShare2 size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-[#744ce9] border-2 border-[#744ce9] py-3 rounded-lg cursor-pointer transition-colors hover:bg-[#F4EFFF] font-medium"
              >
                <FiHeart className="inline mr-2" />
                Зберегти
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <img
                src={offer.image}
                alt={offer.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg"
            >
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  {[
                    { id: 'description', label: 'Опис' },
                    { id: 'reviews', label: 'Відгуки' },
                    { id: 'map', label: 'Мапа' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 text-center font-medium cursor-pointer transition-colors ${
                        activeTab === tab.id
                          ? 'text-[#744ce9] border-b-2 border-[#744ce9]'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Детальний опис</h3>
                    <p className="text-gray-600 whitespace-pre-line">{offer.fullDescription}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center gap-3 text-gray-600">
                        <FiCalendar className="text-[#744ce9]" />
                        <span>Дата публікації: {offer.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-600">
                        <FiDollarSign className="text-[#744ce9]" />
                        <span>Вартість: {offer.price}</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-800">Відгуки</h3>
                      <span className="text-gray-500">{offer.reviews.length} відгуків</span>
                    </div>
                    
                    {offer.reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{review.user}</span>
                          <div className="flex items-center gap-1">
                            <FiStar className="text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600">{review.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{review.text}</p>
                        <span className="text-sm text-gray-400">{review.date}</span>
                      </div>
                    ))}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-gray-100 text-gray-700 py-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-200"
                    >
                      Залишити відгук
                    </motion.button>
                  </div>
                )}

                {activeTab === 'map' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">Розташування</h3>
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={offer.map}
                        alt="Map"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <p className="text-gray-600 flex items-center gap-2">
                      <FiMap className="text-[#744ce9]" />
                      {offer.address}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EFFF] flex items-center justify-center">
                  {offer.author.avatar ? (
                    <img
                      src={offer.author.avatar}
                      alt={offer.author.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-[#744ce9] text-2xl" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{offer.author.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-1">
                      <FiStar className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{offer.author.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">({offer.author.reviews} відгуків)</span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#744ce9] text-white py-3 rounded-lg cursor-pointer transition-colors hover:bg-[#5d39b3]"
              >
                Переглянути профіль
              </motion.button>
            </motion.div>

            {/* Offer Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h3 className="font-semibold text-gray-800 mb-4">Деталі пропозиції</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Категорія:</span>
                  <span className="font-medium text-[#744ce9]">{offer.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Локація:</span>
                  <span className="font-medium text-gray-800">{offer.address}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Вартість:</span>
                  <span className="font-medium text-green-600">{offer.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата:</span>
                  <span className="font-medium text-gray-800">{offer.date}</span>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#744ce9] text-white py-3 rounded-lg cursor-pointer transition-colors hover:bg-[#5d39b3] font-medium"
              >
                Зв'язатися з автором
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-[#744ce9] border-2 border-[#744ce9] py-3 rounded-lg cursor-pointer transition-colors hover:bg-[#F4EFFF] font-medium"
              >
                <FiMessageCircle className="inline mr-2" />
                Написати повідомлення
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}