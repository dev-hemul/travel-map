import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaLock, FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import LoginTelegramButton from './TelegramLoginButton';

import api from '@/api/api';
import 'react-toastify/dist/ReactToastify.css';

const BackArrowIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
  </svg>
);


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
  const [isChecking, setIsChecking] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      navigate('/profile', { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [navigate]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const url = isRegister ? '/register' : '/login';

      const payload = isRegister
        ? {
            username: formData.username.trim(),
            email: formData.email.trim(),
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }
        : {
            email: formData.email.trim(),
            password: formData.password,
          };

      const res = await api.post(url, payload, { withCredentials: true });
      localStorage.setItem('accessToken', res.data.accessToken);

      toast.success(isRegister ? 'Реєстрація успішна!' : 'Успішний вхід!', {
        toastId: isRegister ? 'register-success' : 'login-success',
      });

      setTimeout(() => navigate('/profile'), 1200);
      } catch (err) {
      const msg = err.response?.data?.message || 'Щось пішло не так';

      if (err.response?.status === 409) {
        toast.warning(msg);
      } else {
        toast.error(msg);
      }
    }

  };

  const handleResetPassword = e => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      toast.warning('Введіть email');
      return;
    }

    toast.success('Лист для відновлення надіслано на вашу пошту');
    setShowReset(false);
    setResetEmail('');
  };

  const handleTelegramLogin = () => {
    const botId = '7744665366';
    const botUsername = 'TravelMapSupport_bot';
    const redirectUri = 'https://yourdomain.com/profile';
    const origin = window.location.origin;

    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&bot=${botUsername}&origin=${encodeURIComponent(
      origin
    )}&request_access=write&redirect_uri=${encodeURIComponent(redirectUri)}`;

    window.location.href = telegramAuthUrl;
  };

  const handleGoogleLogin = async () => {
    const { data } = await api.get('/google/url');
    window.location.href = data.url;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 border-4 border-[#744ce9] border-t-transparent"></div>
          <p className="text-base sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#744ce9] font-medium">
            Перевірка...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="hidden md:flex lg:hidden fixed top-6 left-1/2 -translate-x-1/2 z-50">
        <Link
          to="/"
          className="
            inline-flex items-center gap-2 rounded-xl
            border border-indigo-200 bg-white/90 backdrop-blur
            px-4 py-3 text-base font-semibold
            text-[#744ce9]
            shadow-sm
            hover:bg-[#744ce9] hover:text-white hover:border-[#744ce9]
            hover:shadow-md
            active:scale-[0.99]
            transition
          "
        >
          <BackArrowIcon />
          <span>Повернутись до карти</span>

        </Link>
      </div>
      {/* LG+ back button (зліва зверху) */}
      <div className="hidden lg:block fixed top-6 left-6 z-50">
        <Link
          to="/"
          className="
            inline-flex items-center gap-2 rounded-xl
            border border-indigo-200 bg-white/90 backdrop-blur
            px-4 py-3 text-base font-semibold
            text-[#744ce9]
            shadow-sm
            hover:bg-[#744ce9] hover:text-white hover:border-[#744ce9]
            hover:shadow-md
            active:scale-[0.99]
            transition
          "
        >
          ← Повернутись до карти
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white p-6 sm:p-6 md:p-7 lg:p-8 xl:p-10
          rounded-2xl shadow-lg
          w-full max-w-[340px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[560px]
          flex flex-col gap-5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8
          transition-all duration-300
        "
      >
        <Link
          to="/"
          className="
            md:hidden
            inline-flex items-center justify-center gap-2 rounded-xl
            border border-indigo-200 bg-white
            px-4 py-3 text-base font-semibold
            text-[#744ce9]
            hover:bg-[#744ce9] hover:text-white hover:border-[#744ce9]
            active:scale-[0.99]
            transition
          "
        >
          ← Повернутись до карти
        </Link>

        <h2 className="text-2xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl font-bold text-center text-[#744ce9] drop-shadow">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h2>

        {isRegister && (
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-base sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Логін"
              className="
                w-full
                h-12 sm:h-10 md:h-12 lg:h-12 xl:h-14
                pl-11 pr-4
                text-base sm:text-base md:text-lg lg:text-lg xl:text-xl
                placeholder:text-base sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl
                leading-none
                border border-indigo-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#744ce9]
              "
            />
          </div>
        )}

        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-base sm:text-base md:text-lg lg:text-xl xl:text-xl" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="
              w-full
              h-12 sm:h-10 md:h-12 lg:h-12 xl:h-14
              pl-11 pr-4
              text-base sm:text-base md:text-lg lg:text-lg xl:text-xl
              placeholder:text-base sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl
              leading-none
              border border-indigo-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#744ce9]
            "
          />
        </div>

        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-base sm:text-base md:text-lg lg:text-xl xl:text-xl" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="
              w-full
              h-12 sm:h-10 md:h-12 lg:h-12 xl:h-14
              pl-11 pr-12
              text-base sm:text-base md:text-lg lg:text-lg xl:text-xl
              placeholder:text-base sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl
              leading-none
              border border-indigo-200 rounded-xl
              focus:outline-none focus:ring-2 focus:ring-[#744ce9]
            "
          />
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-[#744ce9] text-lg cursor-pointer"
            aria-label={showPassword ? 'Сховати пароль' : 'Показати пароль'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {isRegister && (
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-base sm:text-base md:text-lg lg:text-xl xl:text-xl" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Підтвердіть пароль"
              className="
                w-full
                h-12 sm:h-10 md:h-12 lg:h-12 xl:h-14
                pl-11 pr-12
                text-base sm:text-base md:text-lg lg:text-lg xl:text-xl
                placeholder:text-base sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl
                leading-none
                border border-indigo-200 rounded-xl
                focus:outline-none focus:ring-2 focus:ring-[#744ce9]
              "
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(v => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-[#744ce9] text-lg cursor-pointer"
              aria-label={showConfirmPassword ? 'Сховати пароль' : 'Показати пароль'}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#744ce9] text-base sm:text-base md:text-lg lg:text-lg xl:text-xl text-white py-3 sm:py-2 md:py-3 lg:py-3 xl:py-4 rounded-xl font-semibold hover:bg-[#5d39b3] hover:shadow-lg active:scale-[0.99] transition shadow cursor-pointer min-h-[48px]"
        >
          {isRegister ? 'Зареєструватися' : 'Увійти'}
        </button>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-xl transition-all duration-200 w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 cursor-pointer active:scale-[0.99]"
            aria-label="Увійти через Google"
          >
            <FaGoogle className="text-red-500 w-6 h-6 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
          </button>

          <button
            type="button"
            onClick={handleTelegramLogin}
            className="relative rounded-full overflow-hidden bg-[#229ED9] shadow-md hover:shadow-xl hover:bg-[#1e8bc5] transition-all duration-200 w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center cursor-pointer active:scale-[0.99]"
            aria-label="Увійти через Telegram"
          >
            <LoginTelegramButton />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="text-base sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#744ce9] hover:underline font-semibold text-center py-2"
        >
          {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
        </button>

        {!isRegister && (
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="text-base sm:text-sm md:text-base lg:text-lg xl:text-lg font-semibold text-[#5d39b3] hover:underline transition-colors drop-shadow-sm py-2"
          >
            Забули пароль?
          </button>
        )}
      </form>

      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12">
          <div className="bg-white p-6 sm:p-6 md:p-7 lg:p-8 xl:p-10 rounded-2xl shadow-lg w-full max-w-[340px] sm:max-w-[380px] md:max-w-[440px] lg:max-w-[500px] xl:max-w-[560px] flex flex-col gap-5 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 relative">
            <button
              onClick={() => setShowReset(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-3xl cursor-pointer p-2"
              aria-label="Закрити"
            >
              ×
            </button>

            <h3 className="text-xl sm:text-lg md:text-xl lg:text-xl xl:text-xl font-bold text-[#744ce9] text-center">
              Відновлення пароля
            </h3>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="
                  w-full
                  h-12
                  px-4
                  text-base md:text-lg lg:text-lg xl:text-xl
                  placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl
                  border border-indigo-200 rounded-xl
                  focus:outline-none focus:ring-2 focus:ring-[#744ce9]
                "
              />
              <button
                type="submit"
                className="w-full bg-[#744ce9] text-white py-3 rounded-xl text-base md:text-lg lg:text-lg xl:text-xl font-semibold hover:bg-[#5d39b3] hover:shadow-lg active:scale-[0.99] transition shadow cursor-pointer min-h-[48px]"
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
