import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import { FaInstagram, FaFacebook, FaTelegram } from 'react-icons/fa';
import {
  FiUpload,
  FiTrash,
  FiLogOut,
  FiSearch,
  FiArrowLeft,
  FiMoon,
  FiMessageCircle,
  FiUsers,
  FiMenu,
  FiX,
  FiMap,
  FiEdit2,
  FiCheck,
  FiLink,
} from 'react-icons/fi';
import { useNavigate } from 'react-router';

import api from '@/api/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: 'Іван',
    lastName: 'Іванов',
    middleName: 'Іванович',
    location: 'Київ, Україна',
    email: 'ivanov@example.com',
    phone: '+380991234567',
    instagram: 'https://instagram.com/ivan_ivanov',
    facebook: 'https://facebook.com/ivan.ivanov',
    telegram: 'https://t.me/ivan_ivanov',
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  useEffect(() => {
    setInitialFormData(formData);
  }, [formData]);

  const isLargeScreen = windowWidth >= 1200;
  const isMediumScreen = windowWidth >= 768 && windowWidth < 1200;
  const isSmallScreen = windowWidth >= 640 && windowWidth < 768;
  const isXSmallScreen = windowWidth < 640;

  const getAvatarSize = () => {
    if (isXSmallScreen) return 'w-20 h-20';
    if (isSmallScreen) return 'w-24 h-24';
    if (isMediumScreen) return 'w-32 h-32';
    return 'w-40 h-40';
  };

  const getAvatarTextSize = () => {
    if (isXSmallScreen) return 'text-2xl';
    if (isSmallScreen) return 'text-3xl';
    if (isMediumScreen) return 'text-4xl';
    return 'text-5xl';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Розмір файлу повинен бути менше 10 МБ');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Дозволені лише JPG/PNG/WEBP файли');
      return;
    }
    setAvatar(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (avatar) formDataToSend.append('avatar', avatar);
      const response = await api.post('/profileChanges', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.status === 200) {
        setIsSuccess(true);
        setInitialFormData(formData);
        setIsEditing(false);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Помилка при збереженні даних. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setFormData(initialFormData);
    }
    setIsEditing(!isEditing);
    setError(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');

    try {
      await api.post('/logout', {}, { withCredentials: true });
    } finally {
      navigate('/');
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const openSocialLink = platform => {
    const url = formData[platform];
    if (url && url.startsWith('http')) {
      window.open(url, '_blank');
    }
  };

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return formData.firstName.charAt(0) + formData.lastName.charAt(0);
    }
    return 'ІП';
  };

  return (
    <div
      className={`min-h-full mx-auto px-4 py-8 rounded-lg mb-10 container sm:ml-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <div className="flex flex-col sm:flex-row items-center sm:justify-between bg-[#F4EFFF] rounded-xl px-4 py-2 mb-6 gap-4 border border-gray-300 shadow-lg">
        <motion.button
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05, backgroundColor: '#FFFFFF', color: '#744ce9' }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 text-sm bg-[#744ce9] text-white w-full sm:w-auto py-2 px-4 rounded-md shadow transition-all duration-50 cursor-pointer border-2 border-[#744ce9] justify-center"
        >
          <FiMap size={20} />
          <FiArrowLeft size={20} />
          <span>Повернутись до карти</span>
        </motion.button>

        <div className="relative w-full max-w-3xl mt-2 sm:mt-0">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук..."
            className="bg-white text-sm text-gray-700 placeholder-gray-400 pl-10 pr-4 py-2 rounded-md w-full shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent"
          />
        </div>

        {isLargeScreen ? (
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDarkMode}
              className="text-[#744ce9] text-xl p-2 rounded cursor-pointer"
            >
              <FiMoon />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#744ce9] text-xl p-2 relative rounded cursor-pointer"
            >
              <FiMessageCircle />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-[#744ce9] text-xl p-2 relative rounded cursor-pointer"
            >
              <FiUsers />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                5
              </span>
            </motion.button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#744ce9] text-white flex items-center justify-center text-sm font-semibold shadow">
                {getInitials()}
              </div>
              <p className="text-base font-medium text-gray-700 whitespace-nowrap">
                {formData.firstName} {formData.lastName}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="text-[#dc2626] text-xl p-2 rounded cursor-pointer"
            >
              <FiLogOut />
            </motion.button>
          </div>
        ) : (
          <motion.button
            onClick={toggleMobileMenu}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-2 text-[#744ce9] text-xl p-2 rounded cursor-pointer flex items-center justify-center"
          >
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </motion.button>
        )}
      </div>

      {isMobileMenuOpen && windowWidth < 1200 && (
        <div className="flex flex-col gap-2 mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
          >
            <FiMoon />
            <span>Тема</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
          >
            <FiMessageCircle />
            <span>Повідомлення</span>
            <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded hover:bg-[#f0e8ff] transition-colors"
          >
            <FiUsers />
            <span>Друзі</span>
            <span className="ml-auto bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              5
            </span>
          </motion.button>
          <div className="flex items-center gap-2 p-2 border rounded bg-[#f0e8ff]">
            <div className="w-8 h-8 rounded-full bg-[#744ce9] text-white flex items-center justify-center text-sm font-semibold shadow flex-shrink-0">
              {getInitials()}
            </div>
            <span className="text-[#744ce9] text-base font-medium">
              {formData.firstName} {formData.lastName}
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#dc2626] text-base p-2 border rounded hover:bg-[#fee2e2] transition-colors"
          >
            <FiLogOut />
            <span>Вихід</span>
          </motion.button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`grid gap-8 ${isLargeScreen ? 'grid-cols-[1fr_2fr]' : 'grid-cols-1'}`}
        >
          <div className="flex flex-col items-center justify-start bg-[#F4EFFF] rounded-xl p-4 sm:p-6 shadow-lg">
            <div
              className={`relative group rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md cursor-pointer ${getAvatarSize()}`}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className={`text-[#744ce9] font-semibold ${getAvatarTextSize()}`}>
                  {getInitials()}
                </span>
              )}

              {isEditing && (
                <div className="absolute inset-0 bg-[#744ce9b3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="text-white text-lg sm:text-xl cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
                  >
                    <FiUpload />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAvatar(null);
                      setAvatarPreview(null);
                      fileInputRef.current.value = null;
                    }}
                    className="text-white text-lg sm:text-xl cursor-pointer p-1.5 sm:p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
                  >
                    <FiTrash />
                  </button>
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2">
              Підтримка: JPG, PNG, WEBP. До 10 МБ
            </p>

            <div className="w-full mt-4 space-y-2 text-center">
              <p className="text-xs sm:text-sm text-gray-400">
                Ваш ID: <span className="font-mono font-medium text-gray-600">22222</span>
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Дата створення: <span className="text-gray-600">20.01.1999</span>
              </p>
            </div>
          </div>

          <div className="space-y-6 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#744ce9]">
                Особисті дані
              </h2>
            </div>

            <div className={`grid gap-4 ${isLargeScreen ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {['firstName', 'lastName', 'middleName', 'location', 'email', 'phone'].map(name => (
                <div key={name} className="relative w-full">
                  <label htmlFor={name} className="block text-sm sm:text-base text-gray-500 mb-1">
                    {name === 'firstName'
                      ? "Ім'я"
                      : name === 'lastName'
                        ? 'Прізвище'
                        : name === 'middleName'
                          ? 'По батькові'
                          : name === 'location'
                            ? 'Місце проживання'
                            : name === 'email'
                              ? 'Email'
                              : 'Телефон'}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                    placeholder={`Введіть ${name === 'firstName' ? "ім'я" : name === 'lastName' ? 'прізвище' : name === 'middleName' ? 'по батькові' : name === 'location' ? 'місце проживання' : name === 'email' ? 'email' : 'телефон'}`}
                    value={formData[name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent ${
                      !isEditing
                        ? 'bg-gray-50 cursor-not-allowed text-gray-600'
                        : 'bg-white text-[#744ce9]'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-base sm:text-lg font-semibold text-[#744ce9] mb-4">
                Соціальні мережі
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: 'instagram',
                    label: 'Instagram',
                    icon: FaInstagram,
                    placeholder: 'https://instagram.com/...',
                    iconColor: 'text-pink-600',
                  },
                  {
                    name: 'facebook',
                    label: 'Facebook',
                    icon: FaFacebook,
                    placeholder: 'https://facebook.com/...',
                    iconColor: 'text-blue-600',
                  },
                  {
                    name: 'telegram',
                    label: 'Telegram',
                    icon: FaTelegram,
                    placeholder: 'https://t.me/...',
                    iconColor: 'text-blue-400',
                  },
                ].map(social => (
                  <div key={social.name} className="flex flex-col gap-1">
                    <label htmlFor={social.name} className="block text-xs sm:text-sm text-gray-500">
                      {social.label}
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                          <social.icon className={`${social.iconColor}`} size={16} />
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

            {isEditing && (
              <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-3 mt-6">
                {error && (
                  <p className="text-red-500 text-sm text-center sm:text-left order-first">
                    {error}
                  </p>
                )}
                {isSuccess && (
                  <p className="text-green-600 text-sm text-center sm:text-left order-first">
                    Зміни успішно збережено!
                  </p>
                )}

                <motion.button
                  type="button"
                  onClick={toggleEditMode}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer order-2 sm:order-1"
                >
                  <FiX size={16} />
                  <span>Скасувати</span>
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all order-1 sm:order-2 ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#32CD32] hover:bg-[#2EB94D] text-white'
                  } focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer border-none font-semibold`}
                >
                  <FiCheck size={16} />
                  {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
                </motion.button>
              </div>
            )}

            {!isEditing && (
              <div className="flex justify-center sm:justify-end mt-6">
                <motion.button
                  type="button"
                  onClick={toggleEditMode}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all bg-[#744ce9] hover:bg-[#5d39b3] text-white focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
                >
                  <FiEdit2 size={16} />
                  <span>Редагувати профіль</span>
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default ProfilePage;
