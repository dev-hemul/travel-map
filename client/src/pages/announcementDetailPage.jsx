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
  FiX,
  FiExternalLink,
  FiTool,
  FiHome,
  FiNavigation,
  FiCode,
  FiTool as FiSpoon,
} from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('travel');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('details');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  // Мокові дані на основі інформації з ko.in.ua
  const mockOffers = [
    {
      id: 1,
      title: 'Валентин Добротворцев',
      shortDescription:
        'Організовую подорожі, практикую тілесну терапію, створюю сайти та виготовляю ложки з дерева',
      description:
        'Відкритий до безгрошових взаємообмінів через Клуб Організаторів. Практикую бартерний обмін послугами та знаннями.',

      // Зображення
      mainImage: 'https://ko.in.ua/wp-content/uploads/2020/11/logoVD-e1609080023185.jpg',
      images: [
        'https://ko.in.ua/wp-content/uploads/2020/11/logoVD-e1609080023185.jpg',
        'https://ko.in.ua/wp-content/uploads/bfi_thumb/Logo_ST-qiuj3pbukfjvfzmxw5bkil2jcfjecb7f8wphelpuqw.png',
        'https://ko.in.ua/wp-content/uploads/2020/11/4.0.jpg',
        'https://ko.in.ua/wp-content/uploads/2020/11/photo_2022-02-10-00.01.49.jpeg',
      ],

      // Контактна інформація
      address: 'Київ, Україна',
      contacts: {
        phone: '+38 (093) 927-72-39',
        facebook: 'facebook.com/dobrotvorcev',
        youtube: 'youtube.com/@zkowt',
        instagram: 'instagram.com/shliah_tvorcia',
        telegram: 'https://bit.ly/valentin-dobrotvorcev',
      },

      // Розділи з сайту
      sections: {
        travel: {
          title: 'Шлях Творця',
          subtitle: 'Туристичний маршрут від Києва до моря',
          description:
            'Започаткував та розвиваю туристичний маршрут через всю Україну. Акцентую увагу на відрізку маршруту від Українки до Канева і далі на захід проробляю нову гілку маршруту.',
          fullDescription: `Організовую групові та індивідуальні подорожі Шляхом Творця, а також консультую бажаючих пройтися Шляхом самостійно.

В подорожах ми:
• Пізнаємо рідний край
• Пізнаємо людей та їх професії
• Вчимося та товаришуємо
• Практикуємо духовне просвітлення

**Популярні маршрути:**
1. Активна прогулянка "Три Купелі" - Київ
2. Похід "Озеро за лісом" - Київ
3. Середній похід Шляхом Творця (Українка → Канев)

**Соціальні мережі проекту:**
• Instagram: @shliah_tvorcia
• Facebook: група "Шлях Творця"
• TikTok: @shliah_tvorcia
• Сайт: shliah-tvorcia.com.ua
• YouTube: @zkowt`,
          projects: [
            {
              id: 1,
              name: 'Шлях Творця 2023',
              image:
                'https://ko.in.ua/wp-content/uploads/bfi_thumb/11-qaektgj3y35je8r6in98zkcl70lm26sxsozpwm4trg.jpg',
              description:
                'Середній похід Шляхом Творця, йдемо з Українки до Канева в Пошуках Домів',
              link: 'https://shliah-tvorcia.ko.in.ua/pohid-shliahom-tvorcia-2023/',
            },
          ],
          videos: [
            { id: 1, url: 'https://www.youtube.com/embed/bjQ2grA3FIg', title: 'Про Шлях Творця' },
            { id: 2, url: 'https://www.youtube.com/embed/7XBSp-0EDU8', title: 'Три Купелі' },
            { id: 3, url: 'https://www.youtube.com/embed/y2RtjdSYX9I', title: 'Озеро за лісом' },
          ],
          reports: [
            {
              id: 1,
              title: 'Три Купелі',
              image:
                'https://ko.in.ua/wp-content/uploads/bfi_thumb/245271560_4390566621024964_6261619414226046259_n-peeu34k3hefai29isvb4ip2b6nj1nkouzw12c1it9o.jpg',
              description: 'Активна прогулянка по Києву',
              date: '10.10.2021',
              link: 'https://ko.in.ua/tru-kypeli/',
            },
            {
              id: 2,
              title: 'Озеро за лісом',
              image:
                'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo1634493912-1-peqxmb2slm1i03dnea5ga3xwhaua59yaompl8xuegc.jpeg',
              description: 'Активна прогулянка по Києву',
              date: '17.10.2021',
              link: 'https://ko.in.ua/ozero-za-lisom-zvit/',
            },
          ],
          reviews: [
            {
              id: 1,
              user: 'Катерина з Екопростору "Писанка"',
              avatar:
                'https://ko.in.ua/wp-content/uploads/2023/08/290686197_1206662836766525_3937860109189581756_n.jpeg',
              text: 'Валентин зупиняється у нас зі своїми туристами. Він згуртовує навколо себе таких самих добротворчих людей, як і він сам.',
              date: '2023',
            },
            {
              id: 2,
              user: 'Annete',
              avatar:
                'https://ko.in.ua/wp-content/uploads/2021/10/photo_2021-06-04_01-41-25-150x150.jpg',
              text: 'Це була чудова прогулянка. Я відкрила для себе нові місця рідного міста. Валентин — чудовий провідник, що розказує цікаву інформацію про відвідані місця.',
              date: '10.10.2021',
            },
            {
              id: 3,
              user: 'Алёна Коваленко',
              avatar:
                'https://ko.in.ua/wp-content/uploads/2021/10/244788142_4556055331138338_3349937057014784655_n-150x150.jpeg',
              text: 'Була на цій прогулянці — отримала океан задоволення! Відчула себе живою, адже ходити – це головна потреба людини!',
              date: '10.10.2021',
            },
            {
              id: 4,
              user: 'Олексій Носівець',
              avatar: 'https://ko.in.ua/wp-content/uploads/2021/10/leha-150x150.jpeg',
              text: 'Мені давно не вистачало такої активності. Поспілкувавшись з Валентином і зрозумівши що це за людина, я старатимусь підтримувать його ініціативи що є сил.',
              date: '17.10.2021',
            },
          ],
        },

        wellness: {
          title: 'Оздоровлення',
          subtitle: 'Ретритний Суботник',
          description:
            'День внутрішнього очищення через неїдення та взаємодію з Природою через стихії',
          fullDescription: `Запрошую у гості на програму Суботника, яка може формуватися в залежності від вашого запиту наперед, або у довільній формі по ходу діла. З мене супровід, підтримка, увага, відгук.

**Опції суботника:**
• Неїдення
• Інформ детокс
• Тілесна терапія
• Мовчання
• Фізична активність
• Окунання в холодній воді
• Взаємодія з вогнем
• Прогулянка лісом
• Їжа з печі

**Умови:**
Приїздити в гості раджу не менше як на два дні.
Цінність: оплата за житло на садибі + вільний грошовий внесок за програму.
За програму можливий бартерний взаємообмін по цінностях (обговорюється).

Проводжу таку програму регулярно на тих місцях де живу чи в тих подіях, в яких прийматиму участь.`,
          videos: [
            { id: 1, url: 'https://www.youtube.com/embed/b4nnOEya3HA', title: 'Суботник' },
            { id: 2, url: 'https://www.youtube.com/embed/BbnBus4Pxts', title: 'Ретрит' },
          ],
          reviews: [],
        },

        websites: {
          title: 'Сайти',
          subtitle: 'Створення сайтів на WordPress',
          description:
            'Створюю сайти під ключ на wordpress: сайти-візитки та лендінги. По дизайну сайта — консультую!',
          fullDescription: `**Послуги:**
• Сайти-візитки
• Лендінги
• Консультації по дизайну
• Розробка під ключ

**Портфоліо:**
1. Authentic - http://authentic.com.ua/
2. Tesla Garage - https://teslagarage.com.ua/
3. Шлях Творця - https://shliah-tvorcia.com.ua/
4. Клуб Організаторів - https://ko.in.ua/

**Цінність:**
Від 10 000 грн

Маю досвід створення функціональних та зручних сайтів з урахуванням потреб клієнта. Працюю на WordPress з використанням сучасних технологій.`,
          portfolio: [
            { name: 'Authentic', url: 'http://authentic.com.ua/' },
            { name: 'Tesla Garage', url: 'https://teslagarage.com.ua/' },
            { name: 'Шлях Творця', url: 'https://shliah-tvorcia.com.ua/' },
            { name: 'Клуб Організаторів', url: 'https://ko.in.ua/' },
          ],
          reviews: [],
        },

        spoons: {
          title: 'Ложки з дерева',
          subtitle: "Виготовлення дерев'яних ложок на замовлення",
          description:
            'Обожнюю робити ложки з дерева для людей на замовлення. Під час роботи думаю про людину і ложка виходить особливою та суто індивідуальною.',
          fullDescription: `**Переваги дерев\'яних ложок:**
• Не окислюються (на відміну від металу)
• Не збивають емаль із зубів
• Натуральний матеріал
• Енергетично наповнені

**Процес виготовлення:**
Кожна ложка робиться вручну з урахуванням побажань замовника. Підбираю деревину, обробляю, шліфую та покриваю натуральною олією.

**Цінність:**
Від 500 грн

**Галерея робіт:**`,
          images: [
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.44-pka0iek2egucce3w38dlkc4hrpyt6js7rhe6rwut9o.jpeg',
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.46-pka0igfqs4wwzm15s96upbneyhpjlxzofqp5qgs0x8.jpeg',
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.48-pka0igfqs4wwzm15s96upbneyhpjlxzofqp5qgs0x8.jpeg',
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.49-pka0iibf5szhmtyfha03ub6c59ga1c754004p0p8ks.jpeg',
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.53-pka0ik73jh22a1vp6atczap9c170gqels9b3nkmg8c.jpeg',
            'https://ko.in.ua/wp-content/uploads/bfi_thumb/photo_2022-02-10-00.01.55-pka0im2rx54mx9syvbmm4a86isxqw4m2gim2m4jnvw.jpeg',
          ],
          reviews: [],
        },
      },

      // Додаткова інформація
      category: 'Клуб Організаторів',
      author: {
        name: 'Валентин Добротворцев',
        avatar: 'https://ko.in.ua/wp-content/uploads/2020/11/logoVD-e1609080023185.jpg',
        rating: 4.8,
        reviews: 24,
        experience: 'Організатор подорожей, тілесний терапевт, веб-розробник',
        location: 'Київ, Україна',
        memberSince: '2020 року',
        bio: 'Організовую подорожі Шляхом Творця, збираю охочих людей до бартерного взаємообміну у Клубі Організаторів, практикую тілесну терапію, роблю простенькі сайти та на замовлення виготовляю ложки з дерева.',
        skills: [
          'Організація подорожей',
          'Тілесна терапія',
          'Веб-розробка',
          'Робота з деревом',
          'Бартерний обмін',
        ],
        contacts: {
          email: '',
          phone: '+38 (093) 927-72-39',
          telegram: 'https://bit.ly/valentin-dobrotvorcev',
          facebook: 'facebook.com/dobrotvorcev',
          instagram: 'instagram.com/shliah_tvorcia',
          youtube: 'youtube.com/@zkowt',
        },
        stats: {
          offers: 4,
          completed: 50,
          responseRate: '100%',
          responseTime: '2 години',
          successRate: '95%',
          avgRating: 4.8,
        },
      },
      price: 'Бартер / Вільний внесок',
      date: 'Оновлено 07.02.2024',
      reviews: [],
      tags: [
        'Подорожі',
        'Тілесна терапія',
        'Веб-розробка',
        'Деревообробка',
        'Бартер',
        'Еко-життя',
        'Клуб Організаторів',
      ],
      details: {
        format: 'Онлайн/Офлайн',
        exchange: 'Бартерний обмін',
        location: 'Київ та Україна',
        languages: 'Українська, Російська',
      },

      // Головні події
      events: [
        {
          id: 1,
          title: 'Шлях Творця 2024',
          date: 'Весна-Осінь 2024',
          description: 'Груповий похід маршрутом від Українки до Канева',
        },
        {
          id: 2,
          title: 'Ретритний Суботник',
          date: 'Кожні вихідні',
          description: 'Оздоровчий ретрит на природі',
        },
      ],
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

  const renderTabContent = () => {
    if (!offer) return null;

    const section = offer.sections[activeTab];
    if (!section) return null;

    switch (activeSubTab) {
      case 'details':
        return (
          <div className="space-y-6">
            {/* Заголовок розділу */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h2>
              <p className="text-lg text-gray-600 mt-2">{section.subtitle}</p>
            </div>

            {/* Відео для подорожей */}
            {activeTab === 'travel' && section.videos && section.videos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Відео про проект</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {section.videos.map(video => (
                    <div key={video.id} className="bg-black rounded-xl overflow-hidden">
                      <iframe
                        src={video.url}
                        title={video.title}
                        className="w-full h-64"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <div className="p-4 bg-white">
                        <p className="font-medium text-gray-900">{video.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Опис */}
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed text-base md:text-lg">
                {showFullDescription ? section.fullDescription : section.description}
              </div>
              {section.fullDescription && section.fullDescription.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[#e65000] font-medium hover:text-[#d45c00] cursor-pointer flex items-center gap-2 text-base"
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

            {/* Специфічний контент для кожного розділу */}
            {activeTab === 'travel' && section.projects && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Поточні проекти</h3>
                <div className="grid grid-cols-1 gap-6">
                  {section.projects.map(project => (
                    <div
                      key={project.id}
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#e65000]/30 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-1/3">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                          <p className="text-gray-700 mb-4">{project.description}</p>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-[#e65000] font-medium hover:text-[#d45c00]"
                          >
                            Детальніше
                            <FiExternalLink size={16} />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'websites' && section.portfolio && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Портфоліо</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.portfolio.map((site, index) => (
                    <a
                      key={index}
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#e65000] hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-gray-900">{site.name}</h4>
                        <FiExternalLink className="text-gray-400" />
                      </div>
                      <div className="text-gray-600 text-sm truncate">{site.url}</div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'spoons' && section.images && (
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Галерея робіт</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {section.images.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedGalleryImage(img)}
                      className="cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`Ложка ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'reports':
        return activeTab === 'travel' ? (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Звіти про подорожі
            </h2>
            {section.reports && section.reports.length > 0 ? (
              section.reports.map(report => (
                <div
                  key={report.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#e65000]/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{report.title}</h3>
                      <div className="flex items-center text-gray-600 mb-3">
                        <FiCalendar className="mr-2" size={14} />
                        <span className="text-sm">{report.date}</span>
                      </div>
                      <p className="text-gray-700 mb-4">{report.description}</p>
                      <a
                        href={report.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#e65000] font-medium hover:text-[#d45c00]"
                      >
                        Читати звіт
                        <FiExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-lg mb-3">Ще немає звітів</div>
                <p className="text-gray-500">Звіти з'являться після проведення подорожей</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-gray-400 text-lg mb-3">
              Звіти доступні тільки для розділу "Подорожі"
            </div>
          </div>
        );

      case 'reviews':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Відгуки{' '}
              {section.reviews && section.reviews.length > 0 && `(${section.reviews.length})`}
            </h2>

            {section.reviews && section.reviews.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-6">
                  {section.reviews.map(review => (
                    <div
                      key={review.id}
                      className="border border-gray-200 rounded-2xl p-6 hover:border-[#e65000]/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={review.avatar}
                          alt={review.user}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900">{review.user}</h4>
                            <span className="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 bg-[#e65000] text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer"
                  >
                    <FiMessageSquare size={18} />
                    Залишити відгук
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <div className="text-gray-400 text-lg mb-3">Ще немає відгуків</div>
                <p className="text-gray-500 mb-6">
                  Будьте першим, хто залишить відгук про цю послугу
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 bg-[#e65000] text-white px-6 py-3 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer"
                >
                  <FiMessageSquare size={18} />
                  Залишити відгук
                </motion.button>
              </div>
            )}
          </div>
        );

      case 'videos':
        return section.videos && section.videos.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Відеоматеріали</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.videos.map(video => (
                <div key={video.id} className="bg-black rounded-xl overflow-hidden">
                  <iframe
                    src={video.url}
                    title={video.title}
                    className="w-full h-64"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <div className="p-4 bg-white">
                    <p className="font-medium text-gray-900">{video.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <div className="text-gray-400 text-lg mb-3">Відео відсутні</div>
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
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#f9e5d8] to-[#f0d0c0] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {offer.author.avatar ? (
                <img
                  src={offer.author.avatar}
                  alt={offer.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-[#e65000] text-3xl md:text-4xl" />
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 md:p-2 shadow-md">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-[#e65000] to-[#f57c00] rounded-full flex items-center justify-center">
                <FiStar className="text-white w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">{offer.author.name}</h3>
          <p className="text-gray-600 mt-1 text-sm md:text-base">{offer.author.experience}</p>

          {/* Статус бартерного обміну */}
          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-[#e65000] to-[#f57c00] text-white rounded-full">
            <div className="flex items-center gap-2">
              <span className="font-medium">Відкритий до безгрошових взаємообмінів</span>
            </div>
          </div>
        </div>
      </div>

      {/* Контактна інформація */}
      <div className="p-4 md:p-6">
        <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Контакти</h4>

        {/* Місто */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center text-gray-700 mb-3">
            <FiMapPin className="mr-3 text-gray-400 flex-shrink-0" size={16} />
            <span className="text-sm font-medium">{offer.author.location}</span>
          </div>
        </div>

        {/* Телефон */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center text-gray-700 mb-3">
            <FiPhone className="mr-3 text-gray-400" size={16} />
            <span className="text-sm font-medium">{offer.author.contacts.phone}</span>
          </div>
        </div>

        {/* Соціальні мережі */}
        <div className="space-y-3 mb-6 md:mb-8">
          {offer.author.contacts.telegram && (
            <a
              href={offer.author.contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-[#e65000] transition-colors"
            >
              <FiMessageCircle className="mr-3 text-gray-400" size={16} />
              <span className="text-sm">Telegram</span>
            </a>
          )}
          {offer.author.contacts.facebook && (
            <a
              href={`https://${offer.author.contacts.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-[#e65000] transition-colors"
            >
              <FiGlobe className="mr-3 text-gray-400" size={16} />
              <span className="text-sm">Facebook</span>
            </a>
          )}
          {offer.author.contacts.youtube && (
            <a
              href={`https://${offer.author.contacts.youtube}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-700 hover:text-[#e65000] transition-colors"
            >
              <FiGlobe className="mr-3 text-gray-400" size={16} />
              <span className="text-sm">YouTube</span>
            </a>
          )}
        </div>

        {/* Дії */}
        <div className="space-y-3">
          <motion.a
            href={offer.author.contacts.telegram}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-[#e65000] to-[#f57c00] text-white py-3 md:py-3.5 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiMessageCircle size={16} />
            Написати в Telegram
          </motion.a>

          <motion.a
            href={`tel:${offer.author.contacts.phone.replace(/\s/g, '')}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border-2 border-[#e65000] text-[#e65000] py-3 md:py-3.5 rounded-xl font-medium hover:bg-[#fef0e6] transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiPhone size={16} />
            Зателефонувати
          </motion.a>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#e65000] mx-auto"></div>
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
            className="bg-[#e65000] text-white px-6 py-3 rounded-lg cursor-pointer"
          >
            Повернутись назад
          </motion.button>
        </div>
      </div>
    );
  }

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
                className="lg:hidden p-2 text-gray-600 hover:text-[#e65000] cursor-pointer transition-colors"
              >
                {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </motion.button>

              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-600 hover:text-[#e65000] cursor-pointer transition-colors"
              >
                <FiArrowLeft size={20} />
                <span className="font-medium hidden sm:inline">Назад</span>
              </motion.button>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-500 hover:text-[#e65000] cursor-pointer transition-colors"
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
        <div
          className={`lg:hidden mb-6 transition-all duration-300 ${isMobileMenuOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
        >
          <LeftPanel />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Desktop only */}
          <div className="hidden lg:block w-96 flex-shrink-0">
            <div className="sticky top-24">
              <LeftPanel />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-4xl mx-auto">
              {/* Title Section */}
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{offer.title}</h1>
                <p className="text-base md:text-lg text-gray-600 mb-4">{offer.shortDescription}</p>

                {/* Tags */}
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

              {/* Main Tabs (Розділи) */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 md:mb-8">
                <div className="border-b border-gray-200 overflow-x-auto">
                  <div className="flex min-w-max">
                    {[
                      { id: 'travel', label: 'Подорожі', icon: <FiNavigation /> },
                      { id: 'wellness', label: 'Оздоровлення', icon: <FiTool /> },
                      { id: 'websites', label: 'Сайти', icon: <FiCode /> },
                      { id: 'spoons', label: 'Ложки', icon: <FiSpoon /> },
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setActiveSubTab('details');
                        }}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm border-b-2 transition-colors flex-shrink-0 ${
                          activeTab === tab.id
                            ? 'border-[#e65000] text-[#e65000]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub Tabs */}
                <div className="border-b border-gray-200 overflow-x-auto">
                  <div className="flex min-w-max">
                    {[
                      { id: 'details', label: 'Детальніше' },
                      ...(activeTab === 'travel' ? [{ id: 'reports', label: 'Звіти' }] : []),
                      { id: 'reviews', label: 'Відгуки' },
                      ...(offer.sections[activeTab]?.videos
                        ? [{ id: 'videos', label: 'Відео' }]
                        : []),
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm border-b-2 transition-colors flex-shrink-0 ${
                          activeSubTab === tab.id
                            ? 'border-[#e65000] text-[#e65000]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="p-4 md:p-6 lg:p-8">{renderTabContent()}</div>
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
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-[#e65000]">
                      {offer.price}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">Бартерний обмін / Вільний внесок</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-[#e65000] text-white rounded-xl font-medium cursor-pointer text-sm md:text-base"
                    >
                      Записатися
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-[#e65000] text-[#e65000] rounded-xl font-medium cursor-pointer text-sm md:text-base"
                    >
                      Запитати про бартер
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальне вікно для зображень */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedGalleryImage}
              alt="Велике зображення"
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
