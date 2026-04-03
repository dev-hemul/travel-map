const ModalFooter = ({ count }) => {
  return (
    <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 bg-white">
      <p className="text-center text-xs sm:text-sm text-gray-500">Всього пропозицій: {count}</p>
    </div>
  );
};

export default ModalFooter;
