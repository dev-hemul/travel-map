import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    firstName: "Андрій",
    lastName: "Стегній",
    middleName: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:4000/profileChanges', formData);
      
      if (response.status === 200) {
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Помилка при відправці даних:", error);
      setError("Помилка при збереженні даних. Спробуйте ще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-indigo-900 mb-8">Персональні дані</h2>
      
      <form onSubmit={handleSubmit}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <div className="flex items-start space-x-8">
            {/* Ліва частина з аватаром та полями */}
            <div className="w-1/4">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="bg-indigo-100 rounded-full w-40 h-40 flex items-center justify-center mb-4"
              >
                <span className="text-indigo-500 text-4xl">АС</span>
              </motion.div>
              
              <div className="mb-6 space-y-4">
                {["firstName", "lastName", "middleName", "location"].map((field) => (
                  <motion.div 
                    key={field}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <label className="block text-sm text-gray-500 mb-1">
                      {field === "firstName" && "Ім'я"}
                      {field === "lastName" && "Прізвище"}
                      {field === "middleName" && "По батькові"}
                      {field === "location" && "Місце"}
                    </label>
                    <input 
                      type="text" 
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="w-full p-2 border border-indigo-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-indigo-600">test@gmail.com</p>
                <p className="text-indigo-600">38 (099) 999 99 99</p>
              </div>
            </div>

            {/* Права частина з фото та Google акаунтом */}
            <div className="w-3/4">
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="border-2 border-dashed border-indigo-300 rounded-lg p-6 mb-6"
              >
                <h4 className="text-lg font-semibold text-indigo-900 mb-2">Додати фото</h4>
                <p className="text-gray-500 text-sm mb-4">Jpg, png, розміром від 600×600 пікселів, до 10 МБ</p>
                <motion.button 
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all"
                >
                  Завантажити
                </motion.button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.01 }}
                className="bg-indigo-50 rounded-lg p-6"
              >
                <h4 className="text-lg font-semibold text-indigo-900 mb-4">Авторизуйтесь в один клік</h4>
                <motion.button 
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center space-x-2 bg-white border border-indigo-300 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 w-full"
                >
                  <span>Прив'язати Google акаунт</span>
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Кнопка відправки та статус */}
          <div className="mt-8 flex justify-end items-center space-x-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-600 font-medium"
              >
                {error}
              </motion.div>
            )}
            
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-600 font-medium"
              >
                Зміни успішно збережено!
              </motion.div>
            )}
            
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-6 py-2 rounded-lg transition-all ${
                isSubmitting 
                  ? "bg-indigo-400 cursor-not-allowed" 
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Збереження...
                </div>
              ) : (
                "Зберегти зміни"
              )}
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default ProfilePage;