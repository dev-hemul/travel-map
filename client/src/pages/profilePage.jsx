import axios from "axios";
import { motion } from "framer-motion";
import React, { useState, useRef } from "react";
import { FiUpload, FiTrash, FiLogOut, FiSearch } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    location: "",
    email: "",
    phone: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Розмір файлу повинен бути менше 10 МБ");
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError("Дозволені лише JPG/PNG/WEBP файли");
      return;
    }

    setAvatar(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (avatar) {
        formDataToSend.append('avatar', avatar);
      }
      const response = await axios.post('http://localhost:4000/profileChanges', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError("Помилка при збереженні даних. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between bg-[#F4EFFF] rounded-xl px-4 py-2 mb-6 shadow gap-4">
        <Link to="/" className="text-[#744ce9] text-sm hover:underline">← Повернутись до карти</Link>
        <div className="relative w-full max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Пошук..."
            className="bg-white text-sm text-gray-700 placeholder-gray-400 pl-10 pr-4 py-2 rounded-md w-full shadow-sm"
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-700">Ім’я Прізвище</p>
          <img src={avatarPreview || '/default-avatar.png'} alt="avatar" className="w-8 h-8 rounded-full" />
          <button title="Вихід" className="text-[#744ce9] text-xl"><FiLogOut /></button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="bg-[#744ce9] text-white px-4 py-2 rounded-md shadow hover:bg-[#5c3bc7] transition"
        >
          Авторизуватись в один клік
        </motion.button>
      </div>

      <h2 className="text-3xl font-bold text-[#744ce9] mb-8">Персональні дані</h2>

      <form onSubmit={handleSubmit}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-3 gap-8">
            {/* Left Avatar Section */}
            <div className="col-span-1">
              <div className="relative group w-40 h-40 m-auto rounded-full overflow-hidden bg-[#F4EFFF] flex items-center justify-center">
                {avatarPreview ? <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-[#744ce9] text-4xl">ІП</span>}
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center space-x-4">
                  <button type="button" onClick={triggerFileInput} className="text-white text-xl"><FiUpload /></button>
                  <button type="button" onClick={() => { setAvatar(null); setAvatarPreview(null); fileInputRef.current.value = null; }} className="text-white text-xl"><FiTrash /></button>
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 mt-2">Підтримка: JPG, PNG, WEBP. До 10 МБ</p>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/jpeg, image/png, image/webp" className="hidden" />
              <p className="text-center text-sm text-gray-400 mt-4">Ваш ID: 22222</p>
              <p className="text-center text-sm text-gray-400">Дата реєстрації: 2024-06-20</p>
            </div>

            {/* Right Form Section */}
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {["firstName", "lastName", "middleName", "location", "email", "phone"].map((name) => (
                  <div key={name} className="relative w-full">
                    <label htmlFor={name} className="block text-sm text-gray-500 mb-1">
                      {name === "firstName" ? "Ім'я" : name === "lastName" ? "Прізвище" : name === "middleName" ? "По батькові" : name === "location" ? "Місце" : name === "email" ? "Email" : "Телефон"}
                    </label>
                    <input
                      id={name}
                      name={name}
                      type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                      placeholder={`Уведіть ваше ${name === "firstName" ? "ім'я" : name === "lastName" ? "прізвище" : name === "middleName" ? "по батькові" : name === "location" ? "місце проживання" : name === "email" ? "email" : "телефон"}`}
                      value={formData[name]}
                      onChange={handleChange}
                      onFocus={() => setFocusedField(name)}
                      onBlur={() => setFocusedField(null)}
                      className="w-full p-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end items-center gap-4">
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {isSuccess && <p className="text-green-600 text-sm">Зміни успішно збережено!</p>}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-6 py-2 rounded-lg transition-all ${isSubmitting ? "bg-indigo-400 cursor-not-allowed" : "bg-[#744ce9] text-white"}`}
                >
                  {isSubmitting ? "Збереження..." : "Зберегти зміни"}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default ProfilePage;