import { AnimatePresence, motion } from 'framer-motion';

const SidePanelDeleteModal = ({ isOpen, onCancel, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1002] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="mx-auto w-full max-w-sm rounded-lg border border-gray-200 bg-white p-6 shadow-2xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Видалити маркер?</h3>
          <p className="mb-6 text-gray-600">Ця дія незворотна. Маркер буде видалено назавжди.</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 cursor-pointer rounded-lg border-0 bg-[#E0E0E0] px-4 py-2 font-semibold text-black transition-colors duration-200 hover:bg-[#CCCCCC]"
            >
              Скасувати
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 cursor-pointer rounded-lg border-0 bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700"
            >
              Видалити
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SidePanelDeleteModal;
