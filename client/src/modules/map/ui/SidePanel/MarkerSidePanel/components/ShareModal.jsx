import { MdClose } from 'react-icons/md';

const ShareModal = ({
  show,
  onClose,
  shareUrl,
  onShareTelegram,
  onShareFacebook,
  onCopyLink,
  shareInputRef,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[1400] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-gray-900">Поділитися маркером</h3>
              <p className="mt-1 text-sm text-gray-500">
                Надішли посилання або швидко поділись у соцмережах
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Закрити"
            >
              <MdClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onShareTelegram}
              className="flex items-center justify-center gap-2 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold text-sky-700 transition-all hover:bg-sky-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M21.4 4.6c.4-.2.8.2.7.6l-3 14.2c-.1.6-.8.9-1.3.6l-4.6-3.4-2.3 2.2c-.3.3-.9.1-.9-.4v-3.3l8.1-7.3c.3-.3 0-.8-.4-.6l-10 6.3-4.2-1.4c-.7-.2-.7-1.2 0-1.5z" />
              </svg>
              Telegram
            </button>

            <button
              type="button"
              onClick={onShareFacebook}
              className="flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 font-semibold text-blue-700 transition-all hover:bg-blue-100"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.2-.1-2.4-.1-2.4 0-4 1.4-4 4.1V10H8v3h2.2v8z" />
              </svg>
              Facebook
            </button>

            <button
              type="button"
              onClick={onCopyLink}
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-[#744ce9] px-4 py-3 font-semibold text-white transition-all hover:bg-[#5d39b3]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M16 1H6a2 2 0 00-2 2v12h2V3h10V1zm3 4H10a2 2 0 00-2 2v14a2 2 0 002 2h9a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H10V7h9v14z" />
              </svg>
              Копіювати посилання
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-gray-700">Посилання на маркер</span>
              <span className="text-xs text-gray-400">Клікни, щоб виділити</span>
            </div>

            <input
              ref={shareInputRef}
              type="text"
              value={shareUrl}
              readOnly
              onClick={e => e.target.select()}
              onFocus={e => e.target.select()}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-700 outline-none"
            />

            <p className="mt-3 text-xs leading-relaxed text-gray-500">
              Посилання відкриє карту на потрібному маркері та поточному масштабі.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
