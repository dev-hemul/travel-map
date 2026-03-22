import { motion } from 'framer-motion';
import { FiX, FiCheck, FiEdit2 } from 'react-icons/fi';

const FormActions = ({ isEditing, isSubmitting, error, isSuccess, toggleEditMode }) => {
  if (isEditing) {
    return (
      <div className="flex flex-col items-stretch sm:flex-row sm:justify-end gap-3 mt-6">
        {error && (
          <p className="text-red-500 text-sm text-center sm:text-left order-first">{error}</p>
        )}
        {isSuccess && (
          <p className="text-green-600 text-sm text-center sm:text-left order-first">
            Зміни успішно збережено!
          </p>
        )}

        <motion.button
          type="button"
          onClick={toggleEditMode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all bg-gray-300 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer order-2 sm:order-1"
        >
          <FiX size={16} />
          <span>Скасувати</span>
        </motion.button>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all order-1 sm:order-2 ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#32CD32] hover:bg-[#2EB94D] text-white'
          } focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer border-none font-semibold`}
        >
          <FiCheck size={16} />
          {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
        </motion.button>
      </div>
    );
  }

  return (
    <div className="flex justify-center sm:justify-end mt-6">
      <motion.button
        type="button"
        onClick={toggleEditMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg transition-all bg-[#744ce9] hover:bg-[#5d39b3] text-white focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:ring-offset-2 cursor-pointer w-full sm:w-auto"
      >
        <FiEdit2 size={16} />
        <span>Редагувати профіль</span>
      </motion.button>
    </div>
  );
};

export default FormActions;
