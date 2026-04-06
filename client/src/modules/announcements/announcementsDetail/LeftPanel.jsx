import { motion } from 'framer-motion';
import { FiUser, FiStar, FiMapPin, FiPhone, FiMessageCircle, FiGlobe } from 'react-icons/fi';

export const LeftPanel = ({ offer }) => {
  if (!offer || !offer.author) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <p className="text-gray-500 text-center">Дані відсутні</p>
      </div>
    );
  }

  const { author } = offer;
  const contacts = author.contacts || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-4 md:p-6 border-b border-gray-200">
        <div className="flex flex-col items-center text-center mb-4 md:mb-6">
          <div className="relative mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#f9e5d8] to-[#f0d0c0] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              {author.avatar ? (
                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
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
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            {author.name || 'Користувач'}
          </h3>
          <p className="text-gray-600 mt-1 text-sm md:text-base">{author.experience || ''}</p>

          <div className="mt-4 px-4 py-2 bg-gradient-to-r from-[#e65000] to-[#f57c00] text-white rounded-full">
            <span className="font-medium">Відкритий до безгрошових взаємообмінів</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <h4 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Контакти</h4>

        <div className="mb-3 md:mb-4">
          <div className="flex items-center text-gray-700 mb-3">
            <FiMapPin className="mr-3 text-gray-400 flex-shrink-0" size={16} />
            <span className="text-sm font-medium">{author.location || 'Не вказано'}</span>
          </div>
        </div>

        {/* Перевіряємо чи є телефон */}
        {contacts.phone && (
          <div className="mb-4 md:mb-6">
            <div className="flex items-center text-gray-700 mb-3">
              <FiPhone className="mr-3 text-gray-400" size={16} />
              <span className="text-sm font-medium">{contacts.phone}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6 md:mb-8">
          {contacts.telegram && (
            <ContactLink href={contacts.telegram} icon={<FiMessageCircle />} label="Telegram" />
          )}
          {contacts.facebook && (
            <ContactLink
              href={`https://${contacts.facebook}`}
              icon={<FiGlobe />}
              label="Facebook"
            />
          )}
          {contacts.youtube && (
            <ContactLink href={`https://${contacts.youtube}`} icon={<FiGlobe />} label="YouTube" />
          )}
        </div>

        <div className="space-y-3">
          {contacts.telegram && (
            <motion.a
              href={contacts.telegram}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#e65000] to-[#f57c00] text-white py-3 md:py-3.5 rounded-xl font-medium hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <FiMessageCircle size={16} />
              Написати в Telegram
            </motion.a>
          )}

          {contacts.phone && (
            <motion.a
              href={`tel:${contacts.phone.replace(/\s/g, '')}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white border-2 border-[#e65000] text-[#e65000] py-3 md:py-3.5 rounded-xl font-medium hover:bg-[#fef0e6] transition-colors cursor-pointer flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <FiPhone size={16} />
              Зателефонувати
            </motion.a>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center text-gray-700 hover:text-[#e65000] transition-colors"
  >
    <span className="mr-3 text-gray-400">{icon}</span>
    <span className="text-sm">{label}</span>
  </a>
);
