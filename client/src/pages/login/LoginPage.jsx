import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';

import LoginTelegramButton from './TelegramLoginButton';

import 'react-toastify/dist/ReactToastify.css';

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
  const [showReset, setShowReset] = useState(false); // Додано для модального вікна
  const [resetEmail, setResetEmail] = useState(''); // Додано для email скидання

  const navigate = useNavigate();

  const notifySuccessReg = () => toast.success('Реєстрація успішна! Ви можете увійти');
  const notifySuccessLog = () => toast.success('Успішний вхід!');
  const notifyLetterHasBeenSentOnEmail = () => toast.success('Лист підтвердження було надіслано на ваш Email');
  const notifyPasswordConfirmationErr = () => toast.error('Паролі не збігаються');
  const notifyCurrentEmailErr = () => toast.error('Такий email вже зайнятий');
  const notifyCurrentLoginErr = () => toast.error('Такий логін вже зайнятий');
  const notifyWrongPasswordErr = () => toast.error('Невірний пароль.');
  const notifyCurrentUserDoesntExist = () => toast.error('Такого користувача не існує');
  const notifyServerErr = () => toast.error('Помилка сервера', );
  const notifyPasswordRecoveryErr = () => toast.error('Невірні облікові дані');
  const notifyAllInputAreNecessaryWarning = () => toast.warning('Заповніть усі поля')
  const notifyEmailIsNecessaryWarning = () => toast.warning('Заповніть усі поля')
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Скидаємо помилку при зміні
    setSuccess(''); // Скидаємо успіх при зміні
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Форма відправлена, isRegister:', isRegister); // Діагностика
    console.log('Дані форми:', formData);

    if (isRegister) {
      // Логіка реєстрації
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        notifyAllInputAreNecessaryWarning();
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        notifyPasswordConfirmationErr();
        return;
      }
      try {
        console.log('Відправка на /api/register...');
        const response = await axios.post('http://localhost:4000/api/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        console.log('Відповідь від сервера:', response.data);
        notifySuccessReg();
        setFormData({ username: '', email: '', password: '', confirmPassword: '' }); // Скидання форми
        localStorage.setItem('accessToken', response.data.accessToken); // Збереження токенів
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } catch (error) {
        const field = error.response?.data?.field;
        if(field === 'email') {
          notifyCurrentEmailErr();
        } else if (field === 'username') {
          notifyCurrentLoginErr();
        } else if (field === 'serverRegisterError') {
          notifyServerErr();
        } else {
          toast.error('Виникла помилка при надсиланні даних. Будь ласка, перевірте ваше підключення до мережі')
        }
        
      }
    } else {
      // Логіка входу
      if (!formData.email || !formData.password) {
        notifyEmailIsNecessaryWarning();
        return;
      }
      try {
        console.log('Відправка на /api/login...');
        const response = await axios.post('http://localhost:4000/api/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log('Відповідь від сервера:', response.data);
        notifySuccessLog();
        localStorage.setItem('accessToken', response.data.accessToken); // Збереження токенів
        localStorage.setItem('refreshToken', response.data.refreshToken);
        // TODO: Перенаправлення на іншу сторінку (наприклад, профіль)
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } catch (error) {
        const field = error.response?.data?.field;
        if(field === 'unknown') {
          notifyCurrentUserDoesntExist();
        } else if(field === 'serverLoginError'){
          notifyServerErr();
        } else if(field === 'wrongPassword'){
          notifyWrongPasswordErr();
        } else {
          toast.error('Виникла помилка при надсиланні даних. Будь ласка, перевірте ваше підключення до мережі')
        }
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
      // TODO: Замінити на реальний endpoint для скидання пароля
      console.log('Відправка email для скидання пароля:', resetEmail);
      // Приклад: await axios.post('http://localhost:4000/api/reset-password', { email: resetEmail });
      notifyLetterHasBeenSentOnEmail();
      setShowReset(false);
      setResetEmail('');
    } catch (error) {
      console.error('Помилка скидання пароля:', error.message);
      notifyPasswordRecoveryErr();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#F4EFFF] to-[#744ce9]/10">
      <ToastContainer />
      <h1 className="sr-only">Авторизація</h1>
      <form
        className="bg-white p-10 rounded-xl shadow-md w-full max-w-md transition-all duration-300"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-8 text-center text-[#744ce9] drop-shadow">
          {isRegister ? 'Реєстрація' : 'Вхід'}
        </h2>

        {isRegister && (
          <div className="relative mb-5">
            <FaUser className="absolute left-3 top-4 text-[#744ce9]" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Логін"
              className="w-full pl-10 pr-3 py-3 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
          </div>
        )}

        <div className="relative mb-5">
          <FaUser className="absolute left-3 top-4 text-[#744ce9]" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-3 py-3 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
        </div>

        <div className="relative mb-5">
          <FaLock className="absolute left-3 top-4 text-[#744ce9]" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Пароль"
            className="w-full pl-10 pr-3 py-3 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
          />
          <button
            type="button"
            className="absolute right-3 top-4 text-[#744ce9] focus:outline-none"
            onClick={() => setShowPassword((v) => !v)}
            tabIndex={-1}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {isRegister && (
          <div className="relative mb-5">
            <FaLock className="absolute left-3 top-4 text-[#744ce9]" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Підтвердіть пароль"
              className="w-full pl-10 pr-3 py-3 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-[#744ce9] focus:outline-none"
              onClick={() => setShowConfirmPassword((v) => !v)}
              tabIndex={-1}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <button
          type="submit"
          className="w-full bg-[#744ce9] text-base text-white py-3 rounded-lg font-semibold hover:bg-[#5d39b3] transition mb-4 shadow"
        >
          {isRegister ? 'Зареєструватися' : 'Увійти'}
        </button>

        <div className="flex gap-4 justify-center mb-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center bg-white border border-[#D1D5DB] p-3 rounded-full shadow text-xl hover:bg-[#f3f3f3] transition"
            aria-label="Увійти через Google"
          >
            <FaGoogle className="text-red-500" />
          </button>
          <LoginTelegramButton />
        </div>

        <div className="text-center">
          <button
            type="button"
            className="text-[#744ce9] hover:underline font-medium"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Вже є акаунт? Увійти' : 'Немає акаунта? Зареєструватися'}
          </button>
        </div>

        {!isRegister && (
          <div className="flex justify-center mb-4">
            <button
              type="button"
              className="text-sm font-semibold text-[#5d39b3] hover:underline transition-colors drop-shadow-sm"
              onClick={() => setShowReset(true)}
            >
              Забули пароль?
            </button>
          </div>
        )}
      </form>

      {/* Модальне вікно для відновлення пароля */}
      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
              onClick={() => setShowReset(false)}
              aria-label="Закрити модальне вікно"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#744ce9] text-center">Відновлення пароля</h3>
            <form onSubmit={handleResetPassword}>
              <input
                type="email"
                required
                placeholder="Уведіть ваш email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full mb-4 px-4 py-3 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] transition-all"
              />
              <button
                type="submit"
                className="w-full bg-[#744ce9] text-white py-3 rounded-lg font-semibold hover:bg-[#5d39b3] transition shadow"
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