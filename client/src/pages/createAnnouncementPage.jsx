import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaPlus, FaTrash, FaMapMarkerAlt, FaTag, FaImage, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import CreatableSelect from 'react-select/creatable';

export default function CreateAnnouncementPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [category, setCategory] = useState(null);
  const [images, setImages] = useState([]);

  // існуючі категорії
  const [categories, setCategories] = useState([
    { value: 'Консультація', label: 'Консультація' },
    { value: 'Чистка криниці', label: 'Чистка криниці' },
    { value: 'Ремонт обладнання', label: 'Ремонт обладнання' },
    { value: 'Монтаж систем', label: 'Монтаж систем' },
    { value: 'Обслуговування', label: 'Обслуговування' },
    { value: 'Діагностика', label: 'Діагностика' },
    { value: 'Профілактика', label: 'Профілактика' },
    { value: 'Екстрена допомога', label: 'Екстрена допомога' },
  ]);

  const handleImageChange = e => {
    const files = Array.from(e.target.files);
    const newImages = files.slice(0, 6 - images.length);
    const previews = newImages.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages([...images, ...previews]);
  };

  const removeImage = index => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Пропозицію збережено! (поки що тільки в консолі)');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
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
              <p className="text-blue-100 mt-1 text-sm">Заповніть інформацію про вашу пропозицію</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-4 left-0 right-0 h-8 bg-white"></div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto relative">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Назва */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Назва пропозиції
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
              placeholder="Введіть назву вашої пропозиції..."
              required
            />
          </motion.div>

          {/* Опис */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
          >
            <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
              <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
              Детальний опис
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-4 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-32"
              placeholder="Опишіть детально вашу пропозицію..."
              required
            />
          </motion.div>

          {/* Регіон і категорія */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Регіон */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
              whileHover={{ scale: 1.01 }}
            >
              <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />
                Регіон надання послуги
              </label>
              <input
                type="text"
                value={region}
                onChange={e => setRegion(e.target.value)}
                className="w-full p-4 outline-none rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Київська область, м. Київ"
              />
            </motion.div>

            {/* Категорія (React Select) */}
            <div className="relative z-30">
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
                whileHover={{ scale: 1.01 }}
              >
                <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
                  <FaTag className="text-green-500" />
                  Категорія
                </label>
                <CreatableSelect
                  isClearable
                  options={categories}
                  value={category}
                  onChange={newValue => setCategory(newValue)}
                  onCreateOption={newOption => {
                    const newCategory = { value: newOption, label: newOption };
                    setCategories(prev => [newCategory, ...prev]);
                    setCategory(newCategory);
                  }}
                  placeholder="Оберіть або створіть категорію..."
                  classNamePrefix="react-select"
                  styles={{
                    control: base => ({
                      ...base,
                      borderRadius: '0.75rem',
                      borderColor: '#d1d5db',
                      backgroundColor: '#f9fafb',
                      padding: '4px',
                      boxShadow: 'none',
                      ':hover': { borderColor: '#60a5fa' },
                    }),
                    menu: base => ({
                      ...base,
                      borderRadius: '0.75rem',
                      marginTop: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      zIndex: 50,
                    }),
                    menuPortal: base => ({
                      ...base,
                      zIndex: 50,
                    }),
                  }}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
              </motion.div>
            </div>
          </div>

          {/* Фото */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-blue-300 transition-all duration-200"
            whileHover={{ scale: 1.01 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <label className="block text-lg font-semibold mb-3 flex items-center gap-2">
              <FaImage className="text-purple-500" />
              Фотографії ({images.length}/6)
            </label>

            <label className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-blue-50">
              <FaPlus className="text-blue-500 text-xl" />
              <span className="text-gray-700 font-medium">Додати фотографії</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
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
              className="flex-1 py-4 rounded-xl cursor-pointer font-semibold text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 bg-white"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Скасувати
            </motion.button>

            <motion.button
              type="submit"
              className="flex-1 py-4 rounded-xl cursor-pointer font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              whileHover={{
                scale: 1.02,
                boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)',
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