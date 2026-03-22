import { motion } from 'framer-motion';
import { FaInstagram, FaFacebook, FaTelegram } from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';

const SocialLinksForm = ({ formData, handleChange, isEditing, openSocialLink }) => {
  const socials = [
    {
      name: 'instagram',
      label: 'Instagram',
      icon: FaInstagram,
      iconColor: 'text-pink-600',
      placeholder: 'https://instagram.com/...',
    },
    {
      name: 'facebook',
      label: 'Facebook',
      icon: FaFacebook,
      iconColor: 'text-blue-600',
      placeholder: 'https://facebook.com/...',
    },
    {
      name: 'telegram',
      label: 'Telegram',
      icon: FaTelegram,
      iconColor: 'text-blue-400',
      placeholder: 'https://t.me/...',
    },
  ];

  return (
    <div className="border-t border-gray-200 pt-4">
      <h3 className="text-base sm:text-lg font-semibold text-[#744ce9] mb-4">Соціальні мережі</h3>
      <div className="space-y-4">
        {socials.map(social => (
          <div key={social.name} className="flex flex-col gap-1">
            <label htmlFor={social.name} className="block text-xs sm:text-sm text-gray-500">
              {social.label}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <social.icon className={social.iconColor} size={16} />
                </div>
                <input
                  id={social.name}
                  name={social.name}
                  type="url"
                  placeholder={social.placeholder}
                  value={formData[social.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full pl-10 p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent ${
                    !isEditing
                      ? 'bg-gray-50 cursor-not-allowed text-gray-600'
                      : 'bg-white text-[#744ce9]'
                  }`}
                />
              </div>
              {!isEditing && formData[social.name] && (
                <motion.button
                  type="button"
                  onClick={() => openSocialLink(social.name)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2 bg-[#744ce9] text-white rounded-md hover:bg-[#5d39b3] transition-colors flex items-center justify-center gap-1 text-sm whitespace-nowrap sm:w-auto w-full"
                >
                  <FiLink size={14} />
                  <span>Відкрити</span>
                </motion.button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinksForm;
