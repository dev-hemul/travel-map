import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiArrowLeft, 
  FiMap, 
  FiStar, 
  FiMessageCircle, 
  FiShare2,
  FiCalendar,
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
  FiTrendingUp,
  FiUsers,
  FiFileText,
  FiMessageSquare,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
Почав професійно займатися менторством. Допоміг понад 50 людям змінити кар&apos;єру.

**Навички, які набув:**
• Технічні: JavaScript, React, Node.js, TypeScript
• М&apos;які: Комунікація, лідерство, публічні виступи
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
        bio: 'IT-спеціаліст з 5-річним досвідом. Спеціалізуюсь на веб-розробці та менторстві. Допоміг понад 100 людям розпочати кар&apos;єру в технологіях.',
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
          text: 'Рекомендую всім, хто хоче змінити кар&apos;єру чи розпочати свій шлях в технологіях. Дуже мотивуюче та інформативно!', 
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
      events: [
        {
          id: 1,
          title: 'Безкоштовна консультація для початківців',
          date: '25.01.2024',
          time: '18:00',
          format: 'Онлайн',
          price: 'Безкоштовно',
          spots: '12 місць',
          description: 'Індивідуальні консультації для тих, хто хоче розпочати кар&apos;єру в IT'
        },
        {
          id: 2,
          title: 'Мастер-клас: JavaScript для початківців',
          date: '30.01.2024',
          time: '19:00',
          format: 'Онлайн',
          price: '500 грн',
          spots: '20 місць',
          description: 'Практичний урок з основ JavaScript та створення першого проєкту'
        }
      ],
      reports: [
        {
          id: 1,
          title: 'Звіт за 2023 рік',
          date: '15.12.2023',
          content: 'За 2023 рік провів 47 консультацій, допоміг 32 людям знайти роботу в IT'
        },
        {
          id: 2,
          title: 'Успішні кейси менторства',
          date: '10.11.2023',
          content: '10 історій успіху моїх студентів, які знайшли роботу за 3-6 місяців'
        }
      ],
      map: 'https://maps.googleapis.com/maps/api/staticmap?center=Lviv,Ukraine&zoom=13&size=600x300&key=demo&markers=color:purple%7CLviv,Ukraine',
      tags: ['IT кар&apos;єра', 'Менторство', 'Особистий досвід', 'Безкоштовно', 'Веб-розробка', 'Кар&apos;єрний ріст'],
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
  });

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

  const renderTabContent = () => {
    switch(activeTab) {
      case 'details':
        return (
          <div className="space-y-8">
            {/* Gallery */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {offer.images.slice(0, 3).map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="relative overflow-hidden rounded-2xl cursor-pointer"
                  >
                    <img
                      src={image}
                      alt={`${offer.title} - фото ${index + 1}`}
                      className="w-full h-48 md:h-64 object-cover"
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
              
              {/* Quick Details */}
              {offer.details && (
                <div className="mb-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {Object.entries(offer.details).map(([key, value]) => (
                      <div key={key} className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 text-center">
                        <div className="text-xs md:text-sm text-gray-500 mb-1">
                          {key === 'duration' ? 'Тривалість' :
                           key === 'format' ? 'Формат' :
                           key === 'groupSize' ? 'Розмір групи' :
                           key === 'level' ? 'Рівень' :
                           key === 'languages' ? 'Мови' : key}
                        </div>
                        <div className="text-sm md:text-base font-semibold text-gray-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Description */}
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
          </div>
        );
      
      case 'events':
        return (
          <div className="space-y-6">
            {offer.events && offer.events.length > 0 ? (
              offer.events.map(event => (
                <div key={event.id} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 hover:border-[#744ce9]/30 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 md:gap-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2" size={14} />
                          <span className="text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <FiClock className="mr-2" size={14} />
                          <span className="text-sm">{event.time}</span>
                        </div>
                        <div className="flex items-center">
                          <FiUsers className="mr-2" size={14} />
                          <span className="text-sm">{event.spots}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 text-sm md:text-base">{event.description}</p>
                    </div>
                    <div className="text-right w-full md:w-auto">
                      <div className="text-xl md:text-2xl font-bold text-[#744ce9]">{event.price}</div>
                      <div className="text-xs md:text-sm text-gray-500 mt-1">{event.format}</div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#744ce9] text-white py-3 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer"
                  >
                    Записатися
                  </motion.button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 md:py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-lg mb-3">Немає запланованих подій</div>
                <p className="text-gray-500">Слідкуйте за оновленнями</p>
              </div>
            )}
          </div>
        );
      
      case 'reports':
        return (
          <div className="space-y-6">
            {offer.reports && offer.reports.length > 0 ? (
              offer.reports.map(report => (
                <div key={report.id} className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6 hover:border-[#744ce9]/30 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FiCalendar className="mr-2" size={14} />
                        <span className="text-sm">{report.date}</span>
                      </div>
                      <p className="text-gray-700 text-sm md:text-base">{report.content}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors cursor-pointer text-sm md:text-base"
                    >
                      <FiFileText className="inline mr-2" />
                      Переглянути
                    </motion.button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 md:py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-lg mb-3">Немає звітів</div>
                <p className="text-gray-500">Звіти з&apos;являться після проведення подій</p>
              </div>
            )}
          </div>
        );
      
      case 'reviews':
        return (
          <div className="space-y-6">
            {offer.reviews.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <div className="flex items-center bg-gray-50 px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                    <FiStar className="text-yellow-400 fill-current mr-2" size={18} />
                    <span className="font-bold text-gray-900 text-base md:text-lg">{offer.author.rating}</span>
                    <span className="text-gray-500 text-sm ml-2">({offer.reviews.length} відгуків)</span>
                  </div>
                </div>
                
                {offer.reviews.map(review => (
                  <div key={review.id} className="border border-gray-200 rounded-2xl p-4 md:p-6 hover:border-[#744ce9]/30 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base md:text-lg">{review.user}</h4>
                        <div className="flex items-center mt-2">
                          <div className="flex mr-3 md:mr-4">
                            {[...Array(5)].map((_, i) => (
                              <FiStar
                                key={i}
                                className={`w-4 h-4 md:w-5 md:h-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs md:text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      {review.helpful && (
                        <div className="text-xs md:text-sm text-gray-500">
                          <FiCheckCircle className="inline mr-1 text-green-500" />
                          {review.helpful} корисних
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{review.text}</p>
                  </div>
                ))}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 md:mt-8 bg-white border-2 border-[#744ce9] text-[#744ce9] py-3 md:py-4 rounded-xl font-medium hover:bg-[#F4EFFF] transition-colors cursor-pointer text-base md:text-lg"
                >
                  Лишити відгук
                </motion.button>
              </>
            ) : (
              <div className="text-center py-8 md:py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-lg mb-3">Ще немає відгуків</div>
                <p className="text-gray-500">Будьте першим, хто залишить відгук</p>
              </div>
            )}
          </div>
        );
      
      case 'map':
        return (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden mb-4 shadow-lg">
              <img
                src={offer.map}
                alt="Локація"
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
              <div className="flex items-center text-gray-700 text-base md:text-lg mb-4">
                <FiMapPin className="mr-3 text-[#744ce9]" size={20} />
                <span className="font-medium">{offer.address}</span>
              </div>
              <p className="text-gray-600 text-sm md:text-base">
                Зустріч можлива як онлайн, так і офлайн у Львові. 
                Для офлайн зустрічей обираю зручні коворкінги або кав&apos;ярні в центрі міста.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Компонент лівої панелі
  const LeftPanel = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      {/* Author Header */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col items-center text-center mb-4 md:mb-6">
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {offer.author.avatar ? (
                <img
                  src={offer.author.avatar}
                  alt={offer.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#744ce9] text-3xl md:text-4xl" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 md:p-2 shadow-md">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-[#744ce9] to-[#8a6de8] rounded-full flex items-center justify-center">
                <FiStar className="text-white w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{offer.author.name}</h3>
          <p className="text-gray-600 mt-1 text-sm md:text-base">{offer.author.experience}</p>
        </div>
      </div>
      
      {/* Contact Info */}
      <div className="p-4 md:p-6">
        <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Контакти</h4>
        
        {/* Місто з іконкою - на першому місці */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center text-gray-700 mb-3">
            <FiMapPin className="mr-3 text-gray-400 flex-shrink-0" size={16} />
            <span className="text-sm font-medium">{offer.author.location}</span>
          </div>
        </div>
        
        <div className="space-y-3 mb-4 md:mb-6">
          {offer.author.contacts.phone && (
            <div className="flex items-center text-gray-700">
              <FiPhone className="mr-3 text-gray-400" size={16} />
              <span className="text-sm">{offer.author.contacts.phone}</span>
            </div>
          )}
          {offer.author.contacts.email && (
            <div className="flex items-center text-gray-700">
              <FiMail className="mr-3 text-gray-400" size={16} />
              <span className="text-sm truncate">{offer.author.contacts.email}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.a
            href={`mailto:${offer.author.contacts.email}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#744ce9] to-[#8a6de8] text-white py-3 md:py-3.5 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiMessageCircle size={16} />
            Написати повідомлення
          </motion.a>
          
          <motion.a
            href={`tel:${offer.author.contacts.phone}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border-2 border-[#744ce9] text-[#744ce9] py-3 md:py-3.5 rounded-xl font-medium hover:bg-[#F4EFFF] transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiPhone size={16} />
            Зателефонувати
          </motion.a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 text-gray-600 hover:text-[#744ce9] cursor-pointer transition-colors"
              >
                {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.button>
              
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-600 hover:text-[#744ce9] cursor-pointer transition-colors"
              >
                <FiArrowLeft size={20} />
                <span className="font-medium hidden sm:inline">Назад</span>
              </motion.button>
            </div>

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
      <div className="container mx-auto px-4 py-4 md:py-6">
        {/* Mobile Left Panel */}
        <div className={`lg:hidden mb-6 transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <LeftPanel />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Desktop only (sticky) */}
          <div className="hidden lg:block w-96 flex-shrink-0">        
            <div className="sticky top-24">
              <LeftPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">{offer.shortDescription}</p>

              {/* Tabs */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 md:mb-8">
                <div className="border-b border-gray-200 overflow-x-auto">
                  <div className="flex min-w-max">
                    {[
                      { id: 'details', label: 'Детальніше', icon: <FiFileText /> },
                      { id: 'events', label: 'Події', icon: <FiCalendar /> },
                      { id: 'reports', label: 'Звіти', icon: <FiTrendingUp /> },
                      { id: 'reviews', label: `Відгуки (${offer.reviews.length})`, icon: <FiMessageSquare /> },
                      { id: 'map', label: 'Мапа', icon: <FiMap /> }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm border-b-2 transition-colors flex-shrink-0 ${
                          activeTab === tab.id
                            ? 'border-[#744ce9] text-[#744ce9]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 md:p-6 lg:p-8">
                  {renderTabContent()}
                </div>
              </div>

              {/* Footer Info */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-gray-500 text-sm md:text-base">
                    <div className="flex items-center">
                      <FiCalendar className="mr-2" size={16} />
                      <span>{offer.date}</span>
                    </div>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-[#744ce9]">
                    {offer.price}
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-[#744ce9] text-white rounded-xl font-medium cursor-pointer text-sm md:text-base"
                    >
                      Зaбронювати
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-[#744ce9] text-[#744ce9] rounded-xl font-medium cursor-pointer text-sm md:text-base"
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