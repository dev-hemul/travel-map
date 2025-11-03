import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import LoginTelegramButton from './TelegramLoginButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isChecking, setIsChecking] = useState(true); // Лоадер

  const navigate = useNavigate();

  // Тости
  const notifySuccessReg = () => toast.success('Реєстрація успішна!');
  const notifySuccessLog = () => toast.success('Успішний вхід!');
  const notifyLetterHasBeenSentOnEmail = () => toast.success('Лист надіслано на email');
  const notifyPasswordConfirmationErr = () => toast.error('Паролі не збігаються');
  const notifyAllInputAreNecessaryWarning = () => toast.warning('Заповніть усі поля');
  const notifyEmailIsNecessaryWarning = () => toast.warning('Заповніть email та пароль');

  // Перевірка авторизації при завантаженні
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        setIsChecking(false);
        return;
      }

      try {
        await axios.post('http://localhost:4000/profile', {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        navigate('/profile', { replace: true });
      } catch {
        try {
          const res = await axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true });
          if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/profile', { replace: true });
          } else {
            throw new Error();
          }
        } catch {
          localStorage.removeItem('accessToken');
          setIsChecking(false);
        }
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        notifyAllInputAreNecessaryWarning();
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        notifyPasswordConfirmationErr();
        return;
      }

      try {
        const res = await axios.post('http://localhost:4000/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        localStorage.setItem('accessToken', res.data.accessToken);
        notifySuccessReg();
        setTimeout(() => navigate('/profile'), 1500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Помилка реєстрації');
      }
    } else {
      if (!formData.email || !formData.password) {
        notifyEmailIsNecessaryWarning();
        return;
      }

      try {
        const res = await axios.post('http://localhost:4000/login', {
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        localStorage.setItem('accessToken', res.data.accessToken);
        notifySuccessLog();
        setTimeout(() => navigate('/profile'), 1500);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Невірні дані');
      }
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail) return notifyEmailIsNecessaryWarning();
    notifyLetterHasBeenSentOnEmail();
    setShowReset(false);
    setResetEmail('');
  };
// loader dlya perevirky
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 border-4 border-[#744ce9] border-t-transparent"></div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-[#744ce9] font-medium">Перевірка авторизації...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6">
      <ToastContainer position="top-center" autoClose={2000} />

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 rounded-xl shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-300"
      >
        <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8 text-center text-[#744ce9] drop-shadow">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h2>

        {/* Поля */}
        {isRegister && (
          <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Логін"
              className="w-full pl-10 pr-3 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
          </div>
        )}

        <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
        </div>

        <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="w-full pl-10 pr-10 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {isRegister && (
          <div className="relative mb-3 sm:mb-4 md:mb-5 lg:mb-6 xl:mb-7">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Підтвердіть пароль"
              className="w-full pl-10 pr-10 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 rounded-lg font-semibold hover:bg-[#5d39b3] transition mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 shadow cursor-pointer"
        >
          {isRegister ? 'Зареєструватися' : 'Увійти'}
        </button>

        <div className="flex justify-center gap-3 mb-6">
          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center bg-white border border-gray-300 rounded-full shadow hover:bg-gray-50 hover:border-gray-400 transition w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 cursor-pointer"
            aria-label="Увійти через Google"
          >
            <FaGoogle className="text-red-500 w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
          </button>

           <div
            type="button"
            className="relative rounded-full overflow-hidden bg-[#229ED9] border border-[#1a8bc7] shadow transition w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 cursor-pointer flex items-center justify-center"
            aria-label="Увійти через Telegram"
          >
            <LoginTelegramButton />
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#744ce9] hover:underline font-medium cursor-pointer"
          >
            {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
          </button>
        </div>

        {!isRegister && (
          <div className="flex justify-center mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6">
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-semibold text-[#5d39b3] hover:underline transition-colors drop-shadow-sm cursor-pointer"
            >
              Забули пароль?
            </button>
          </div>
        )}
      </form>
      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 overflow-hidden">
          <div className="relative bg-white p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            <button
              onClick={() => setShowReset(false)}
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-5xl cursor-pointer"
              aria-label="Закрити"
            >
              ×
            </button>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 text-[#744ce9] text-center">
              Відновлення пароля
            </h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Ваш email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6 px-3 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9]"
              />
              <button
                type="submit"
                className="w-full bg-[#744ce9] text-white py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold hover:bg-[#5d39b3] transition shadow cursor-pointer"
              >
                Надіслати
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;