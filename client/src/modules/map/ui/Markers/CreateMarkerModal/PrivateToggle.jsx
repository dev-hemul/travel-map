const PrivateToggle = ({ value, onChange }) => {
  return (
    <div className="pt-1">
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          name="private"
          checked={!!value}
          onChange={e => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-['']
          peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-checked:after:border-white
          peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
        ></div>
        <span className="ml-3 text-sm text-gray-700">Приватний маркер</span>
      </label>
    </div>
  );
};

export default PrivateToggle;
