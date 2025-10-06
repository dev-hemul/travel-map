import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaTrash, FaMapMarkerAlt, FaTag, FaImage, FaArrowLeft, FaChevronDown, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [images, setImages] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const dropdownRef = useRef(null);

  // Список існуючих категорій
  const [existingCategories, setExistingCategories] = useState([
    'Консультація',
    'Чистка криниці',
    'Ремонт обладнання',
    'Монтаж систем',
    'Обслуговування',
    'Діагностика',
    'Профілактика',
    'Екстрена допомога'
  ]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 6 - images.length);
    const previews = newImages.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...previews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Додавання нової категорії
  const addNewCategory = () => {
    if (customCategory.trim() && !existingCategories.includes(customCategory.trim())) {
      const newCategory = customCategory.trim();
      setExistingCategories(prev => [newCategory, ...prev]);
      setCategory(newCategory);
      setCustomCategory('');
      setIsCreatingCustom(false);
      setShowCategoryDropdown(false);
    }
  };

  // Вибір існуючої категорії
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoryDropdown(false);
    setIsCreatingCustom(false);
  };

  // Перемикач між вибором і створенням категорії
  const toggleCreateMode = () => {
    setIsCreatingCustom(!isCreatingCustom);
    setCustomCategory('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      description,
      region,
      category,
      images: images.map((img) => img.file),
    };
    console.log('Нова пропозиція:', formData);
    alert('Пропозицію збережено! (поки що тільки в консолі)');
    setTitle('');
    setDescription('');
    setRegion('');
    setCategory('');
    setImages([]);
    setIsCreatingCustom(false);
  };

  // Закриття dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-b-3xl shadow-lg">
        <div className="p-6 pb-8">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-white cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="text-lg" />
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold leading-tight">Створення пропозиції</h1>
              <p className="text-blue-100 mt-1 text-sm">
                Заповніть інформацію про вашу пропозицію
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 left-0 right-0 h-8 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-900/20 rounded-full"></div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Назва */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Назва пропозиції
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Введіть назву вашої пропозиції..."
              required
            />
          </motion.div>

          {/* Опис */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Детальний опис
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-32"
              placeholder="Опишіть детально вашу пропозицію..."
              required
            />
          </motion.div>

          {/* Регіон та Категорія */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Регіон */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Регіон надання послуги
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Київська область, м. Київ"
              />
            </motion.div>

            {/* Категорія */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 relative"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
                <FaTag className="text-green-500" />
                Категорія
              </label>
              
              <div className="relative" ref={dropdownRef}>
                {/* Поле вибору категорії */}
                <div 
                  className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer flex justify-between items-center"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <span className={category ? 'text-gray-900 dark:text-white' : 'text-gray-500'}>
                    {category || 'Оберіть категорію...'}
                  </span>
                  <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown меню */}
                {showCategoryDropdown && (
                  <motion.div 
                    className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Режим вибору існуючої категорії */}
                    {!isCreatingCustom ? (
                      <>
                        <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                              Існуючі категорії
                            </span>
                            <motion.button
                              type="button"
                              onClick={toggleCreateMode}
                              className="text-xs px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              + Нова
                            </motion.button>
                          </div>
                        </div>
                        
                        {existingCategories.map((cat, index) => (
                          <motion.div
                            key={cat}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            onClick={() => handleCategorySelect(cat)}
                            whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700 dark:text-gray-300">{cat}</span>
                            </div>
                          </motion.div>
                        ))}
                      </>
                    ) : (
                      /* Режим створення нової категорії */
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Нова категорія
                          </span>
                          <motion.button
                            type="button"
                            onClick={toggleCreateMode}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <FaTimes className="text-gray-500" />
                          </motion.button>
                        </div>
                        
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Введіть назву категорії..."
                            autoFocus
                          />
                          <motion.button
                            type="button"
                            onClick={addNewCategory}
                            disabled={!customCategory.trim()}
                            className="px-4 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            whileHover={{ scale: !customCategory.trim() ? 1 : 1.05 }}
                            whileTap={{ scale: !customCategory.trim() ? 1 : 0.95 }}
                          >
                            <FaPlus />
                          </motion.button>
                        </div>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Категорія буде додана до списку доступних
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Вибрана категорія */}
              {category && (
                <motion.div 
                  className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex justify-between items-center"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <div className="flex items-center gap-2">
                    <FaTag className="text-blue-500" />
                    <span className="text-blue-700 dark:text-blue-300 font-medium">{category}</span>
                  </div>
                  <motion.button
                    type="button"
                    onClick={() => setCategory('')}
                    className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaTimes className="text-blue-500 text-sm" />
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Фотографії */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <label className="block text-lg font-semibold mb-3 text-gray-800 dark:text-white flex items-center gap-2">
              <FaImage className="text-purple-500" />
              Фотографії ({images.length}/6)
            </label>
            
            <div className="mb-4">
              <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <FaPlus className="text-blue-500 text-xl" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Додати фотографії</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Максимум 6 фотографій
              </p>
            </div>

            {/* Preview images */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <img 
                      src={img.url} 
                      alt={`preview-${index}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaTrash className="text-xs" />
                    </motion.button>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200"></div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Кнопки */}
          <div className="flex gap-4 pt-4">
            <motion.button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 bg-white dark:bg-gray-800"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Скасувати
            </motion.button>
            
            <motion.button
              type="submit"
              className="flex-1 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.98 }}
            >
              Опублікувати пропозицію
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}