const ModalHeader = () => {
  return (
    <div className="relative rounded-none bg-gradient-to-r from-blue-600 to-indigo-700 p-5 pb-7 sm:p-6 md:rounded-t-2xl">
      <h3 className="text-2xl font-semibold leading-tight text-white">Створення маркера</h3>
      <p className="mt-1 text-base text-blue-100">Додайте інформацію про нову локацію</p>
      <div className="absolute -bottom-4 left-0 right-0 hidden h-8 rounded-full bg-white md:block" />
    </div>
  );
};

export default ModalHeader;
