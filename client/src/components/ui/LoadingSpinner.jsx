const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900 z-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#744ce9] mx-auto"></div>
        <p className="mt-4 text-lg text-[#744ce9] font-medium">Завантаження...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
