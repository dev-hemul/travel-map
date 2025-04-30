import React, { useState } from 'react';
import axios from 'axios';
import { FaTimes, FaAdjust } from 'react-icons/fa';

export default function SupportModal({ onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [theme, setTheme] = useState('dark'); // dark або light

  const isDark = theme === 'dark';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/support', form);
      if (response.status === 200) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Помилка при надсиланні:', error);
      alert('Щось пішло не так. Спробуйте пізніше.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
      <div className={`relative w-full max-w-md p-6 rounded-xl shadow-lg transition-colors duration-300
        ${isDark ? 'bg-[#1e1b4b] text-white' : 'bg-[#d1fae5] text-[#065f46]'}`}>

        {/* Перемикач теми */}
        <button
          className="absolute top-3 left-3 text-xl hover:opacity-80"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title="Змінити тему"
        >
          <FaAdjust />
        </button>

        {/* Кнопка закриття */}
        <button
          className="absolute top-3 right-3 text-xl hover:opacity-80"
          onClick={onClose}
          title="Закрити"
        >
          <FaTimes />
        </button>

        {submitted ? (
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">Дякуємо за звернення!</h2>
            <p>Ми зв’яжемося з вами якнайшвидше.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <h2 className="text-2xl font-bold text-center mb-4">Звернення до підтримки</h2>

            <div>
              <label className="block mb-1">Ім'я:</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full p-2 rounded border border-gray-400 bg-transparent outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full p-2 rounded border border-gray-400 bg-transparent outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Тема:</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full p-2 rounded border border-gray-400 bg-transparent outline-none"
              />
            </div>

            <div>
              <label className="block mb-1">Повідомлення:</label>
              <textarea
                name="message"
                rows="4"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full p-2 rounded border border-gray-400 bg-transparent outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-2 rounded font-semibold transition ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              Надіслати
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
