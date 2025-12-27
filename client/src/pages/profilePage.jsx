import axios from 'axios';
import { motion } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    location: '',
    email: '',
    phone: '',
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
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const mockProfileData = {
      firstName: 'Іван',
      lastName: 'Іванов',
      middleName: 'Іванович',
      location: 'Київ, Україна',
      email: 'ivanov@example.com',
      phone: '+380991234567',
    };
    setFormData(mockProfileData);
    setInitialFormData(mockProfileData);
  }, []);

  const isLargeScreen = windowWidth >= 1200;
  const isSmallScreen = windowWidth >= 640 && windowWidth < 768;
  const isXSmallScreen = windowWidth < 640;

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
      const response = await axios.post('http://localhost:4000/profileChanges', formDataToSend, {
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
    await axios.post(
      'http://localhost:4000/logout',
      {},
      { withCredentials: true } 
    );
  } catch (error) {
    console.error('Помилка логауту:', error);
  } finally {
    navigate('/');
  }
};

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div
      className={`min-h-full mx-auto px-4 py-8 rounded-lg mb-10 container sm: ml-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
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
                ІП
              </div>
              <p className="text-base font-medium text-gray-700 whitespace-nowrap">
                Ім&apos;я Прізвище
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
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded"
          >
            Тема <FiMoon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded"
          >
            Повідомлення <FiMessageCircle />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded"
          >
            Друзі <FiUsers />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-[#744ce9] text-base p-2 border rounded"
          >
            Профіль{' '}
            <div className="w-6 h-6 rounded-full bg-[#744ce9] text-white flex items-center justify-center text-xs font-semibold">
              ІП
            </div>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#dc2626] text-base p-2 border rounded"
          >
            Вихід <FiLogOut />
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
          <div className="flex flex-col items-center justify-start bg-[#F4EFFF] rounded-xl p-6 shadow-lg">
            <div
              className="relative group rounded-full overflow-hidden bg-white flex items-center justify-center shadow-md cursor-pointer"
              style={{
                width: isXSmallScreen ? '100px' : isSmallScreen ? '120px' : '160px',
                height: isXSmallScreen ? '100px' : isSmallScreen ? '120px' : '160px',
              }}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#744ce9] text-4xl font-semibold">ІП</span>
              )}
              {isEditing && (
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[#744ce9b3] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-1">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="text-white text-xl cursor-pointer p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
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
                    className="text-white text-xl cursor-pointer p-2 rounded-lg hover:bg-[#5d39b380] transition-all duration-200"
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
            <p className="text-center text-sm text-gray-500 mt-2">
              Підтримка: JPG, PNG, WEBP. До 10 МБ
            </p>
            <p className="text-center text-sm text-gray-400 mt-2">Ваш ID: 22222</p>
            <p className="text-center text-sm text-gray-400 mt-2">
              Дата створення акаунту: 20.01.1999
            </p>
          </div>

          <div className="space-y-6 bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-semibold text-[#744ce9]">Особисті дані</h2>
            </div>

            <div className={`grid gap-4 ${isLargeScreen ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {['firstName', 'lastName', 'middleName', 'location', 'email', 'phone'].map(name => (
                <div key={name} className="relative w-full">
                  <label htmlFor={name} className="block text-base md:text-lg text-gray-500 mb-1">
                    {name === 'firstName'
                      ? "Ім'я"
                      : name === 'lastName'
                        ? 'Прізвище'
                        : name === 'middleName'
                          ? 'По батькові'
                          : name === 'location'
                            ? 'Місце'
                            : name === 'email'
                              ? 'Email'
                              : 'Телефон'}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={name === 'email' ? 'email' : name === 'phone' ? 'tel' : 'text'}
                    placeholder={`Уведіть ваше ${name === 'firstName' ? "ім'я" : name === 'lastName' ? 'прізвище' : name === 'middleName' ? 'по батькові' : name === 'location' ? 'місце проживання' : name === 'email' ? 'email' : 'телефон'}`}
                    value={formData[name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full p-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent ${!isEditing ? 'bg-white cursor-not-allowed text-gray-600' : 'bg-gray-100 text-[#744ce9]'}`}
                  />
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {isSuccess && <p className="text-green-600 text-sm">Зміни успішно збережено!</p>}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 text-sm md:text-base rounded-lg transition-all ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#32CD32] hover:bg-[#2EB94D] text-white'} focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer border-none font-semibold`}
                >
                  <FiCheck size={16} />
                  {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
                </motion.button>
              </div>
            )}
            <motion.button
              type="button"
              onClick={toggleEditMode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isEditing ? 'bg-gray-300 hover:bg-gray-400' : 'bg-[#744ce9] hover:bg-[#5d39b3] text-white'} focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer`}
            >
              {isEditing ? (
                <>
                  <FiX size={16} />
                  <span>Скасувати</span>
                </>
              ) : (
                <>
                  <FiEdit2 size={16} />
                  <span>Редагувати</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default ProfilePage;
