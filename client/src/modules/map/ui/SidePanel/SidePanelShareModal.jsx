import { AnimatePresence, motion } from 'framer-motion';
import { MdCheck, MdClose, MdContentCopy } from 'react-icons/md';

const SidePanelShareModal = ({ isOpen, copied, shareUrl, onClose, onCopy, onShare }) => (
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
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Поділитися маркером</h3>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Посилання на маркер
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
              />
              <button
                onClick={onCopy}
                className="flex items-center rounded-lg bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700"
              >
                {copied ? <MdCheck className="h-4 w-4" /> : <MdContentCopy className="h-4 w-4" />}
              </button>
            </div>
            {copied && <p className="mt-1 text-sm text-green-600">Посилання скопійовано!</p>}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Поділитися в:</p>

            <button
              onClick={() => onShare('telegram')}
              className="w-full rounded-lg bg-blue-500 p-3 text-white transition-colors hover:bg-blue-600"
            >
              Telegram
            </button>

            <button
              onClick={() => onShare('whatsapp')}
              className="w-full rounded-lg bg-green-500 p-3 text-white transition-colors hover:bg-green-600"
            >
              WhatsApp
            </button>

            <button
              onClick={() => onShare('facebook')}
              className="w-full rounded-lg bg-blue-700 p-3 text-white transition-colors hover:bg-blue-800"
            >
              Facebook
            </button>

            <button
              onClick={() => onShare('twitter')}
              className="w-full rounded-lg bg-black p-3 text-white transition-colors hover:bg-gray-900"
            >
              X / Twitter
            </button>

            <button
              onClick={() => onShare('viber')}
              className="w-full rounded-lg bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700"
            >
              Viber
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default SidePanelShareModal;
