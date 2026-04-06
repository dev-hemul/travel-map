import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

export const FooterInfo = ({ offer }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-gray-500 text-sm md:text-base">
        <div className="flex items-center">
          <FiCalendar className="mr-2" size={16} />
          <span>{offer.date}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xl md:text-2xl font-bold text-[#e65000]">{offer.price}</div>
        <p className="text-gray-500 text-sm mt-1">Бартерний обмін / Вільний внесок</p>
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 md:px-6 md:py-3 bg-[#e65000] text-white rounded-xl font-medium cursor-pointer text-sm md:text-base"
        >
          Записатися
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 md:px-6 md:py-3 bg-white border-2 border-[#e65000] text-[#e65000] rounded-xl font-medium cursor-pointer text-sm md:text-base"
        >
          Запитати про бартер
        </motion.button>
      </div>
    </div>
  </div>
);
