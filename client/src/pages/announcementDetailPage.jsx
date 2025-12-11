import { useState, useEffect, useRef } from 'react';
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
  FiHeart,
  FiImage,
  FiMapPin,
  FiMail,
  FiPhone,
  FiGlobe,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const authorScrollRef = useRef(null);
  const contentScrollRef = useRef(null);

  // Мокові дані
  const mockOffers = [
    {
      id: 1,
      title: 'Шлях до успіху: від ідеї до реалізації',
      shortDescription: 'Особистий досвід побудови кар\'єри в IT',
      description: 'Як я почав з нуля та досяг успіху за 5 років. Крок за кроком розповім про свої перемоги та помилки.',
      fullDescription: `Повний опис мого шляху:
      
**2018 - Початок: самостійне навчання**
Почав з онлайн-курсів та ютуб-уроків. Перші 6 місяців навчався по 4-6 годин на день після основної роботи.

**2019 - Перша робота: Junior Developer**
Знайшов першу роботу в маленькій компанії. Працював за мінімальну зарплату, але набирався досвіду.

**2020 - Перехід на позицію Middle Developer**
Після року роботи отримав пропозицію від більшої компанії з зарплатою в 2.5 рази вищою.

**2021 - Team Lead у стартапі**
Приєднався до стартапу як технічний лідер. Навчився керувати командою та приймати важливі рішення.

**2022 - Заснування власної спільноти**
Створив онлайн-спільноту для початківців в IT. Проводив безкоштовні вебінари та майстер-класи.

**2023 - Менторство та проведення майстер-класів**
Почав професійно займатися менторством. Допоміг понад 50 людям змінити кар'єру.

**Навички, які набув:**
• Технічні: JavaScript, React, Node.js, TypeScript
• М'які: Комунікація, лідерство, публічні виступи
• Бізнес: Управління проектами, планування, аналітика

**Мої принципи:**
1. Постійне навчання - щодня хоча б 1 година
2. Ділитися знаннями - те, що знаю сам
3. Бути відкритим до нових можливостей
4. Не боятися змін та викликів

Готовий відповісти на ваші запитання та поділитися контактами!`,
      images: [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      ],
      address: 'Львів, Україна',
      category: 'Шляхотворець',
      author: {
        name: 'Андрій Коваленко',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        rating: 4.8,
        reviews: 24,
        experience: '5 років в IT',
        location: 'Львів, Україна',
        memberSince: '2020 року',
        website: 'andriykovalenko.com',
        bio: 'IT-спеціаліст з 5-річним досвідом. Спеціалізуюсь на веб-розробці та менторстві. Допоміг понад 100 людям розпочати кар\'єру в технологіях.',
        education: 'Національний університет "Львівська політехніка"',
        languages: ['Українська', 'Англійська', 'Польська'],
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'Mentoring'],
        contacts: {
          email: 'andriy@example.com',
          phone: '+380 67 123 4567',
          telegram: '@andriy_kov',
          linkedin: 'linkedin.com/in/andriykovalenko'
        },
        stats: {
          offers: 12,
          completed: 47,
          responseRate: '98%',
          responseTime: '2 години',
          successRate: '95%',
          avgRating: 4.8
        },
        achievements: [
          'Топ-ментор 2023',
          'Найкращий відгук року',
          '100+ успішних проектів'
        ]
      },
      price: 'Безкоштовна консультація',
      date: 'Опубліковано 15.01.2024',
      reviews: [
        { 
          id: 1, 
          user: 'Олександр П.', 
          rating: 5, 
          text: 'Дуже надихаюча історія! Андрій поділився цінними інсайтами, які допомогли мені зрозуміти, з чого почати свій шлях в IT. Його підхід до менторства дуже структурований та ефективний.', 
          date: '10.01.2024',
          helpful: 12
        },
        { 
          id: 2, 
          user: 'Марія К.', 
          rating: 4, 
          text: 'Чудова можливість поспілкуватися з досвідченим спеціалістом. Отримала багато корисної інформації для свого розвитку. Особливо сподобалася частина про soft skills.', 
          date: '08.01.2024',
          helpful: 8
        },
        { 
          id: 3, 
          user: 'Сергій Л.', 
          rating: 5, 
          text: 'Рекомендую всім, хто хоче змінити кар\'єру чи розпочати свій шлях в технологіях. Дуже мотивуюче та інформативно!', 
          date: '05.01.2024',
          helpful: 15
        },
        { 
          id: 4, 
          user: 'Наталія В.', 
          rating: 5, 
          text: 'Андрій не тільки досвідчений фахівець, але й чудовий співрозмовник. Дуже детально відповідає на всі питання та дає практичні поради.', 
          date: '03.01.2024',
          helpful: 6
        }
      ],
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=Lviv,Ukraine&zoom=13&size=600x300&key=demo&markers=color:purple%7CLviv,Ukraine',
      tags: ['IT кар\'єра', 'Менторство', 'Особистий досвід', 'Безкоштовно', 'Веб-розробка', 'Кар\'єрний ріст'],
      details: {
        duration: '1-2 години',
        format: 'Онлайн/Офлайн',
        groupSize: 'Індивідуально',
        level: 'Всі рівні',
        languages: 'UA/EN'
      }
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundOffer = mockOffers.find(o => o.id === parseInt(id));
      setOffer(foundOffer);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#744ce9] mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження...</p>
        </div>
      </div>
    );
  }

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Шляхотворець': return 'bg-purple-100 text-purple-800';
      case 'Організовую події': return 'bg-blue-100 text-blue-800';
      case 'Продаю тренажери': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-[#744ce9] cursor-pointer transition-colors"
            >
              <FiArrowLeft size={20} />
              <span className="font-medium">Назад</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-[#744ce9] cursor-pointer transition-colors"
              >
                <FiShare2 size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
              >
                <FiHeart size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Left Column - Author Info with Scroll */}
          <div className="w-96 flex-shrink-0 hidden lg:block">
            <div 
              ref={authorScrollRef}
              className="h-full overflow-y-auto pr-4"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#c7d2fe #f3f4f6'
              }}
            >
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                {/* Author Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                        {offer.author.avatar ? (
                          <img
                            src={offer.author.avatar}
                            alt={offer.author.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FiUser className="text-[#744ce9] text-4xl" />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#744ce9] to-[#8a6de8] rounded-full flex items-center justify-center">
                          <FiStar className="text-white w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{offer.author.name}</h3>
                    <p className="text-gray-600 mt-1">{offer.author.experience}</p>
                    <div className="flex items-center justify-center mt-3">
                      <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                        <FiStar className="text-yellow-400 fill-current mr-1" />
                        <span className="font-bold text-gray-900">{offer.author.rating}</span>
                        <span className="text-gray-500 text-sm ml-2">({offer.author.reviews} відгуків)</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-700 text-center">{offer.author.bio}</p>
                </div>

                {/* Stats Grid */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <FiTrendingUp className="mr-2 text-[#744ce9]" />
                    Статистика
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">{offer.author.stats.offers}</div>
                      <div className="text-gray-600 text-sm mt-1">Пропозицій</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-gray-900">{offer.author.stats.completed}</div>
                      <div className="text-gray-600 text-sm mt-1">Виконано</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-green-600">{offer.author.stats.successRate}</div>
                      <div className="text-gray-600 text-sm mt-1">Успішність</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="text-2xl font-bold text-blue-600">{offer.author.stats.responseRate}</div>
                      <div className="text-gray-600 text-sm mt-1">Відповідь</div>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">Деталі</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-700">
                      <FiMapPin className="mr-3 text-gray-400 flex-shrink-0" size={18} />
                      <span className="text-sm">{offer.author.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiCalendar className="mr-3 text-gray-400 flex-shrink-0" size={18} />
                      <span className="text-sm">На сайті з {offer.author.memberSince}</span>
                    </div>
                    {offer.author.education && (
                      <div className="flex items-start text-gray-700">
                        <FiCheckCircle className="mr-3 text-gray-400 flex-shrink-0 mt-0.5" size={18} />
                        <span className="text-sm">{offer.author.education}</span>
                      </div>
                    )}
                    {offer.author.website && (
                      <div className="flex items-center text-gray-700">
                        <FiGlobe className="mr-3 text-gray-400 flex-shrink-0" size={18} />
                        <a 
                          href={`https://${offer.author.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-[#744ce9] hover:underline"
                        >
                          {offer.author.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills */}
                {offer.author.skills && offer.author.skills.length > 0 && (
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Навички</h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.author.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {offer.author.languages && offer.author.languages.length > 0 && (
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Мови</h4>
                    <div className="flex flex-wrap gap-2">
                      {offer.author.languages.map((lang, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {offer.author.achievements && offer.author.achievements.length > 0 && (
                  <div className="p-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Досягнення</h4>
                    <div className="space-y-2">
                      {offer.author.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-center text-gray-700">
                          <FiCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Контакти</h4>
                  <div className="space-y-3 mb-6">
                    {offer.author.contacts.phone && (
                      <div className="flex items-center text-gray-700">
                        <FiPhone className="mr-3 text-gray-400" size={18} />
                        <span className="text-sm">{offer.author.contacts.phone}</span>
                      </div>
                    )}
                    {offer.author.contacts.email && (
                      <div className="flex items-center text-gray-700">
                        <FiMail className="mr-3 text-gray-400" size={18} />
                        <span className="text-sm truncate">{offer.author.contacts.email}</span>
                      </div>
                    )}
                    {offer.author.contacts.telegram && (
                      <div className="flex items-center text-gray-700">
                        <FiMessageCircle className="mr-3 text-gray-400" size={18} />
                        <span className="text-sm">{offer.author.contacts.telegram}</span>
                      </div>
                    )}
                    {offer.author.contacts.linkedin && (
                      <div className="flex items-center text-gray-700">
                        <FiGlobe className="mr-3 text-gray-400" size={18} />
                        <a 
                          href={`https://${offer.author.contacts.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#744ce9] hover:underline"
                        >
                          LinkedIn
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-[#744ce9] to-[#8a6de8] text-white py-3.5 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FiMessageCircle size={18} />
                      Написати повідомлення
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white border-2 border-[#744ce9] text-[#744ce9] py-3.5 rounded-xl font-medium hover:bg-[#F4EFFF] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FiPhone size={18} />
                      Зателефонувати
                    </motion.button>
                  </div>

                  {/* Response Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">Швидкість відповіді</span>
                      <span className="font-bold text-green-600">{offer.author.stats.responseRate}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <FiClock className="mr-1" size={12} />
                      <span>Середній час: {offer.author.stats.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content with Scroll */}
          <div 
            ref={contentScrollRef}
            className="flex-1 overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#c7d2fe #f3f4f6'
            }}
          >
            <div className="max-w-4xl mx-auto pb-8">
              {/* Category Badge */}
              <div className="mb-6">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(offer.category)}`}>
                  {offer.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
              <p className="text-lg text-gray-600 mb-8">{offer.shortDescription}</p>

              {/* Gallery */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {offer.images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="relative overflow-hidden rounded-2xl cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`${offer.title} - фото ${index + 1}`}
                        className="w-full h-64 object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <FiImage className="inline mr-1" />
                          <span className="text-sm font-medium">{offer.images.length} фото</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Quick Details */}
              {offer.details && (
                <div className="mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(offer.details).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                        <div className="text-sm text-gray-500 mb-1">
                          {key === 'duration' ? 'Тривалість' :
                           key === 'format' ? 'Формат' :
                           key === 'groupSize' ? 'Розмір групи' :
                           key === 'level' ? 'Рівень' :
                           key === 'languages' ? 'Мови' : key}
                        </div>
                        <div className="font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
                {/* Description Section */}
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Опис {offer.category === 'Шляхотворець' ? 'маршруту' : offer.category === 'Організовую події' ? 'події' : 'товару'}
                  </h2>
                  <div className="prose prose-lg max-w-none">
                    <div className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
                      {showFullDescription ? offer.fullDescription : offer.description}
                    </div>
                    {offer.fullDescription.length > 300 && (
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-[#744ce9] font-medium hover:text-[#5d39b3] cursor-pointer flex items-center gap-2"
                      >
                        {showFullDescription ? (
                          <>
                            <span>Згорнути опис</span>
                          </>
                        ) : (
                          <>
                            <span>Читати повністю</span>
                            <FiChevronRight className="mt-0.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Map Section */}
                <div className="p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Мапа</h2>
                  <div className="rounded-2xl overflow-hidden mb-4 shadow-md">
                    <img
                      src={offer.map}
                      alt="Локація"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  <div className="flex items-center text-gray-700 text-lg">
                    <FiMapPin className="mr-3 text-[#744ce9]" size={24} />
                    <span className="font-medium">{offer.address}</span>
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Відгуки</h2>
                    <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                      <FiStar className="text-yellow-400 fill-current mr-2" size={20} />
                      <span className="font-bold text-gray-900 text-lg">{offer.author.rating}</span>
                      <span className="text-gray-500 ml-2">({offer.reviews.length} відгуків)</span>
                    </div>
                  </div>

                  {offer.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {offer.reviews.map(review => (
                        <div key={review.id} className="border border-gray-200 rounded-2xl p-6 hover:border-[#744ce9]/30 transition-colors">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{review.user}</h4>
                              <div className="flex items-center mt-2">
                                <div className="flex mr-4">
                                  {[...Array(5)].map((_, i) => (
                                    <FiStar
                                      key={i}
                                      className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{review.date}</span>
                              </div>
                            </div>
                            {review.helpful && (
                              <div className="text-sm text-gray-500">
                                <FiCheckCircle className="inline mr-1 text-green-500" />
                                {review.helpful} корисних
                              </div>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg mb-3">Ще немає відгуків</div>
                      <p className="text-gray-500">Будьте першим, хто залишить відгук</p>
                    </div>
                  )}

                  {/* Leave Review Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-8 bg-white border-2 border-[#744ce9] text-[#744ce9] py-4 rounded-xl font-medium hover:bg-[#F4EFFF] transition-colors cursor-pointer text-lg"
                  >
                    Лишити відгук
                  </motion.button>
                </div>
              </div>

              {/* Tags */}
              {offer.tags && offer.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Теги</h3>
                  <div className="flex flex-wrap gap-3">
                    {offer.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-gray-500">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" />
                      <span>{offer.date}</span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#744ce9]">
                    {offer.price}
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-[#744ce9] text-white rounded-xl font-medium cursor-pointer"
                    >
                      Забронювати
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white border-2 border-[#744ce9] text-[#744ce9] rounded-xl font-medium cursor-pointer"
                    >
                      Запитати
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}