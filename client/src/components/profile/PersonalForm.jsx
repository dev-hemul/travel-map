const PersonalInfoForm = ({ formData, handleChange, isEditing, isLargeScreen }) => {
  const fields = [
    { name: 'firstName', label: "Ім'я", type: 'text', placeholder: "Введіть ім'я" },
    { name: 'lastName', label: 'Прізвище', type: 'text', placeholder: 'Введіть прізвище' },
    { name: 'middleName', label: 'По батькові', type: 'text', placeholder: 'Введіть по батькові' },
    {
      name: 'location',
      label: 'Місце проживання',
      type: 'text',
      placeholder: 'Введіть місце проживання',
    },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Введіть email' },
    { name: 'phone', label: 'Телефон', type: 'tel', placeholder: 'Введіть телефон' },
  ];

  return (
    <div className={`grid gap-4 ${isLargeScreen ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {fields.map(field => (
        <div key={field.name} className="relative w-full">
          <label htmlFor={field.name} className="block text-sm sm:text-base text-gray-500 mb-1">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.name]}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full p-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#744ce9] focus:border-transparent ${
              !isEditing ? 'bg-gray-50 cursor-not-allowed text-gray-600' : 'bg-white text-[#744ce9]'
            }`}
          />
        </div>
      ))}
    </div>
  );
};

export default PersonalInfoForm;
