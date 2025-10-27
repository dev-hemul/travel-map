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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate();

  const notifySuccessReg = () => toast.success('Реєстрація успішна! Ви можете увійти.');
  const notifySuccessLog = () => toast.success('Успішний вхід!');
  const notifyLetterHasBeenSentOnEmail = () => toast.success('Лист підтвердження було надіслано на ваш Email');
  const notifyPasswordConfirmationErr = () => toast.error('Паролі не збігаються');
  const notifyAllInputAreNecessaryWarning = () => toast.warning('Заповніть усі поля.');
  const notifyEmailIsNecessaryWarning = () => toast.warning('Заповніть усі поля.');
  const notifyPasswordRecoveryErr = () => toast.error('Невірні облікові дані.');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('Checking auth, accessToken:', accessToken);

    if (accessToken) {
      axios
        .post('http://localhost:4000/profile', {}, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        })
        .then(res => {
          console.log('Profile check success:', res.status);
          if (res.status === 200) navigate('/profile');
        })
        .catch(error => {
          console.log('Profile check error:', error);
          axios
            .post('http://localhost:4000/refresh-token', {}, {
              withCredentials: true,
            })
            .then(res => {
              console.log('Refresh success, new accessToken:', res.data.accessToken);
              if (res.data.accessToken) {
                localStorage.setItem('accessToken', res.data.accessToken);
                navigate('/profile');
              }
            })
            .catch(error => {
              console.log('Refresh error:', error.response?.data);
              localStorage.removeItem('accessToken');
              navigate('/login');
              toast.error('Сесія закінчилася. Увійдіть знову.');
            });
        });
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Форма відправлена, isRegister:', isRegister); 
    console.log('Дані форми:', formData);

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
        console.log('Відправка на /register...');
        const response = await axios.post('http://localhost:4000/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        },  {withCredentials: true}
      );
  console.log('Заголовки відповіді:', response.headers);
        console.log('Відповідь від сервера:', response.data);
        notifySuccessReg();
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        localStorage.setItem('accessToken', response.data.accessToken);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } catch (error) {
        console.log('Помилка реєстрації:', error.response?.data);
        const message = error.response?.data?.message || 'Помилка сервера';
        toast.error(message);
      }
    } else {
      if (!formData.email || !formData.password) {
        notifyEmailIsNecessaryWarning();
        return;
      }
      try {
        console.log('Відправка на /login...');
        const response = await axios.post('http://localhost:4000/login', {
            email: formData.email,
            password: formData.password,
        }, {
            withCredentials: true 
        });
        console.log('cookies', document.cookie)
        console.log('Відповідь від сервера:', response.data);
        notifySuccessLog();
        localStorage.setItem('accessToken', response.data.accessToken); 
        
        console.log('Document cookies after login:', document.cookie);
        
        setTimeout(() => {
            navigate('/profile');
        }, 2000);
    } catch (error) {
        console.log('Помилка входу:', error.response?.data);
        const message = error.response?.data?.message || 'Помилка сервера';
        toast.error(message);
    }
    }
  };

  const handleGoogleLogin = () => {
    // TODO: логіка Google Login
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      notifyEmailIsNecessaryWarning();
      return;
    }
    try {
      console.log('Відправка email для скидання пароля:', resetEmail);
      notifyLetterHasBeenSentOnEmail();
      setShowReset(false);
      setResetEmail('');
    } catch (error) {
      console.error('Помилка скидання пароля:', error.message);
      notifyPasswordRecoveryErr();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10 sm:bg-gradient-to-br md:bg-gradient-to-br lg:bg-gradient-to-br">
      <ToastContainer />
      <h1 className="sr-only">Авторизація</h1>
      <form
        className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 rounded-xl shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl transition-all duration-300"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center text-[#744ce9] drop-shadow">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h2>

        {isRegister && (
          <div className="relative mb-3 sm:mb-4 md:mb-5">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#744ce9]" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Логін"
              className="w-full pl-10 pr-3 py-2 sm:py-3 md:py-4 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
          </div>
        )}

        <div className="relative mb-3 sm:mb-4 md:mb-5">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#744ce9]" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-2 sm:py-3 md:py-4 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
        </div>

        <div className="relative mb-3 sm:mb-4 md:mb-5">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#744ce9]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="w-full pl-10 pr-10 py-2 sm:py-3 md:py-4 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#744ce9] focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {isRegister && (
          <div className="relative mb-3 sm:mb-4 md:mb-5">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#744ce9]" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Підтвердіть пароль"
              className="w-full pl-10 pr-10 py-2 sm:py-3 md:py-4 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#744ce9] focus:outline-none"
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-2 sm:mb-3 md:mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-2 sm:mb-3 md:mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-[#744ce9] text-base sm:text-lg md:text-xl text-white py-2 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#5d39b3] transition mb-2 sm:mb-3 md:mb-4 shadow"
        >
          {isRegister ? 'Зареєструватися' : 'Увійти'}
        </button>

        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-white border border-[#D1D5DB] p-2 sm:p-3 md:p-4 rounded-full shadow text-xl sm:text-2xl md:text-3xl hover:bg-[#f3f3f3] transition w-full sm:w-10 sm:h-10 md:w-12 md:h-12"
            aria-label="Увійти через Google"
          >
            <FaGoogle className="text-red-500" />
          </button>
          <LoginTelegramButton />
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-[#744ce9] hover:underline font-medium text-sm sm:text-base md:text-lg"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
          </button>
        </div>

        {!isRegister && (
          <div className="flex justify-center mb-2 sm:mb-3 md:mb-4">
            <button
              type="button"
              className="text-sm sm:text-base md:text-lg font-semibold text-[#5d39b3] hover:underline transition-colors drop-shadow-sm"
              onClick={() => setShowReset(true)}
            >
              Забули пароль?
            </button>
          </div>
        )}
      </form>

      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-2 sm:p-3 md:p-4">
          <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg w-full max-w-xs sm:max-w-sm md:max-w-md">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowReset(false)}
              aria-label="Закрити модальне вікно"
            >
              &times;
            </button>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-[#744ce9] text-center">Відновлення пароля</h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                required
                placeholder="Уведіть ваш email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full mb-2 sm:mb-3 md:mb-4 px-3 py-2 sm:py-3 md:py-4 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
              />
              <button
                type="submit"
                className="w-full bg-[#744ce9] text-white py-2 sm:py-3 md:py-4 rounded-lg font-semibold hover:bg-[#5d39b3] transition shadow"
              >
                Відправити
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;