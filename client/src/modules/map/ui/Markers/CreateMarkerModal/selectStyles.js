export const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59,130,246,0.15)' : 'none',
    backgroundColor: '#fff',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
    },
  }),
  valueContainer: base => ({
    ...base,
    padding: '2px 12px',
  }),
  input: base => ({
    ...base,
    margin: 0,
    padding: 0,
  }),
  placeholder: base => ({
    ...base,
    color: '#9ca3af',
    fontSize: '0.95rem',
  }),
  singleValue: base => ({
    ...base,
    color: '#1f2937',
    fontSize: '0.95rem',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: base => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#374151',
    },
  }),
  clearIndicator: base => ({
    ...base,
    color: '#6b7280',
    ':hover': {
      color: '#374151',
    },
  }),
  menu: base => ({
    ...base,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
    zIndex: 20,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#eff6ff' : '#fff',
    color: '#111827',
    cursor: 'pointer',
    fontSize: '0.95rem',
  }),
  multiValue: base => ({
    ...base,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  }),
  multiValueLabel: base => ({
    ...base,
    color: '#1d4ed8',
    fontWeight: 500,
  }),
  multiValueRemove: base => ({
    ...base,
    color: '#1d4ed8',
    ':hover': {
      backgroundColor: '#dbeafe',
      color: '#1e40af',
    },
  }),
};
