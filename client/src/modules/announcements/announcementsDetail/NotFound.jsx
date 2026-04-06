import { motion } from 'framer-motion';

export const NotFound = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Пропозицію не знайдено</h2>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#e65000] text-white px-6 py-3 rounded-lg cursor-pointer"
        >
          Повернутись назад
        </motion.button>
      </div>
    </div>
  );
};
