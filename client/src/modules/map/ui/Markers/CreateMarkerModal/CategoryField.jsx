import CreatableSelect from 'react-select/creatable';

import { selectStyles } from './selectStyles';

const CategoryField = ({ options, selectedOption, onCategoryChange, onCreateCategory }) => {
  return (
    <div>
      <label className="mb-1.5 inline-block text-sm font-semibold uppercase text-gray-500">
        Категорія
      </label>
      <CreatableSelect
        styles={selectStyles}
        isClearable
        onChange={onCategoryChange}
        onCreateOption={onCreateCategory}
        options={options}
        value={selectedOption}
        placeholder="Виберіть або створіть категорію"
        noOptionsMessage={() => 'Поки не створено жодної категорії'}
        formatCreateLabel={inputValue => (
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Створити категорію `{inputValue}`
          </div>
        )}
      />
    </div>
  );
};

export default CategoryField;
