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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const inputClasses = `
  w-full pl-10 pr-3 py-3 md:py-4
  text-base sm:text-xs md:text-sm lg:text-l xl:text-l
  border border-indigo-200 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-[#744ce9]
  placeholder:text-gray-500 placeholder:opacity-70
  disabled:opacity-70
`;

  const navigate = useNavigate();

  // Тости
  const notifySuccessReg = () => toast.success('Реєстрація успішна! Ви можете увійти.');
  const notifySuccessLog = () => toast.success('Успішний вхід!');
  const notifyLetterHasBeenSentOnEmail = () => toast.success('Лист надіслано');
  const notifyPasswordConfirmationErr = () => toast.error('Паролі не збігаються');
  const notifyAllInputAreNecessaryWarning = () => toast.warning('Заповніть усі поля.');
  const notifyEmailIsNecessaryWarning = () => toast.warning('Заповніть email та пароль.');

  // ПЕРЕВІРКА СЕСІЇ
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsCheckingSession(false);
      return;
    }

    axios.post('http://localhost:4000/profile', {}, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    })
    .then(() => {
      navigate('/profile', { replace: true });
    })
    .catch(() => {
      axios.post('http://localhost:4000/refresh-token', {}, { withCredentials: true })
        .then(res => {
          if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            navigate('/profile', { replace: true });
          } else {
            throw new Error();
          }
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          toast.info('Сесія закінчилася. Увійдіть знову.');
        })
        .finally(() => {
          setIsCheckingSession(false);
        });
    });
  }, [navigate]);

  if (isCheckingSession) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#744ce9] mx-auto"></div>
          <p className="mt-6 text-xl font-medium text-[#744ce9]">Перевірка сесії...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (isRegister) {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        notifyAllInputAreNecessaryWarning();
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        notifyPasswordConfirmationErr();
        setIsSubmitting(false);
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
        setTimeout(() => {
        navigate('/profile', { replace: true });
        }, 800);

      } catch (err) {
        toast.error(err.response?.data?.message || 'Помилка сервера');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      if (!formData.email || !formData.password) {
        notifyEmailIsNecessaryWarning();
        setIsSubmitting(false);
        return;
      }

      try {
        const res = await axios.post('http://localhost:4000/login', {
          email: formData.email,
          password: formData.password,
        }, { withCredentials: true });

        localStorage.setItem('accessToken', res.data.accessToken);
        notifySuccessLog();
        setTimeout(() => {
        navigate('/profile', { replace: true });
        }, 800);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Невірні дані');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResetPassword = (e) => {
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      notifyEmailIsNecessaryWarning();
      return;
    }
    notifyLetterHasBeenSentOnEmail();
    setShowReset(false);
    setResetEmail('');
  };
    if (!resetEmail) return notifyEmailIsNecessaryWarning();
    notifyLetterHasBeenSentOnEmail();
    setShowReset(false);
    setResetEmail('');
  };

  const handleTelegramLogin = () => {
    const botId = '7744665366';
    const botUsername = 'TravelMapSupport_bot';
    const redirectUri = 'https://yourdomain.com/profile';
    const origin = window.location.origin;
    const telegramAuthUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&bot=${botUsername}&origin=${encodeURIComponent(origin)}&request_access=write&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = telegramAuthUrl;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 lg:h-16 lg:w-16 xl:h-20 xl:w-20 border-4 border-[#744ce9] border-t-transparent"></div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-[#744ce9] font-medium">Перевірка...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">Помилка завантаження</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#744ce9] text-white rounded-lg hover:bg-[#5d39b3] transition"
          >
            Перезавантажити
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
        <ToastContainer position="top-center" autoClose={2000} />

        <h1 className="sr-only">Авторизація</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-xl shadow-lg w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[580px] flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8 transition-all duration-300"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-center text-[#744ce9] drop-shadow">
            {isRegister ? 'Реєстрація' : 'Вхід'}
          </h2>

          {isRegister && (
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Логін"
               className={inputClasses}
                disabled={isSubmitting}
              />
            </div>
          )}

          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
             className={inputClasses}
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Пароль"
              className={inputClasses}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl cursor-pointer"
              disabled={isSubmitting}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {isRegister && (
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Підтвердіть пароль"
                className={inputClasses}
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#744ce9] text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl cursor-pointer"
                disabled={isSubmitting}
                tabIndex={-1}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#744ce9] text-sm sm:text-base md:text-lg lg:text-l xl:text-l text-white py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 rounded-lg font-semibold hover:bg-[#5d39b3] transition shadow cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Зачекайте...' : (isRegister ? 'Зареєструватися' : 'Увійти')}
          </button>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              className="flex items-center justify-center bg-white border border-[#D1D5DB] rounded-full shadow-md hover:shadow-xl transition-all duration-200 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 cursor-pointer"
              aria-label="Увійти через Google"
              disabled={isSubmitting}
            >
              <FaGoogle className="text-red-500 w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
            </button>
              <div className="relative rounded-full overflow-hidden bg-[#229ED9] shadow-md hover:shadow-xl hover:bg-[#1e8bc5] transition-all duration-200 w-10 h-10 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-12 lg:h-12 xl:w-14 xl:h-14 flex items-center justify-center cursor-pointer">
                <LoginTelegramButton />
              </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-l text-[#744ce9] hover:underline font-medium text-center"
            disabled={isSubmitting}
          >
            <LoginTelegramButton />
          </button>

          {!isRegister && (
            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-l font-semibold text-[#5d39b3] hover:underline transition-colors drop-shadow-sm"
              disabled={isSubmitting}
            >
              Забули пароль?
            </button>
          )}
        </form>

        {showReset && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
            <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 rounded-xl shadow-lg w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px] lg:max-w-[520px] xl:max-w-[580px] flex flex-col gap-4 relative">
              <button
                onClick={() => setShowReset(false)}
                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl cursor-pointer"
                aria-label="Закрити"
              >
                ×
              </button>
              <h3 className="text-lg sm:text-xl md:text-l lg:text-xl xl:text-2xl font-bold text-[#744ce9] text-center">
                Відновлення пароля
              </h3>
              <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Уведіть ваш email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-3 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] flex items-center leading-none placeholder:text-[13px] placeholder:text-gray-500 sm:placeholder:text-[13px] md:placeholder:text-[14px] lg:placeholder:text-[15px] xl:placeholder:text-[16px] placeholder:flex placeholder:items-center"
                />
                <button
                  type="submit"
                  className="w-full bg-[#744ce9] text-white py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 rounded-lg text-sm sm:text-base md:text-lg lg:text-l xl:text-xl font-semibold hover:bg-[#5d39b3] transition shadow cursor-pointer"
                >
                  Відправити
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

    </>
  );
};

export default LoginPage;