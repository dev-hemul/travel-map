const ModalActions = ({ onClose }) => {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onClose}
        className="order-2 cursor-pointer rounded-lg border-0 bg-[#E0E0E0] px-5 py-2.5 text-base font-semibold text-black transition-colors duration-200 hover:bg-[#CCCCCC] sm:order-1 sm:flex-1"
      >
        Скасувати
      </button>

      <button
        type="submit"
        className="order-1 flex cursor-pointer items-center justify-center rounded-lg border-0 bg-[#32CD32] px-5 py-2.5 text-base font-semibold text-white transition-colors duration-200 hover:bg-[#2EB94D] sm:order-2 sm:flex-1"
      >
        Зберегти
      </button>
    </div>
  );
};

export default ModalActions;
