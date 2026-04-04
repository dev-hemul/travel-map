import { useState } from 'react';

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  category: '',
  tags: [],
  private: false,
  files: [],
  fileUrls: [],
};

export const useMarkerForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const resetForm = () => {
    formData.fileUrls.forEach(url => URL.revokeObjectURL(url));
    setFormData(INITIAL_FORM_DATA);
    setSelectedOption(null);
  };

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = newValue => {
    setSelectedOption(newValue);
    setFormData(prev => ({
      ...prev,
      category: newValue ? newValue.value : '',
    }));
  };

  const handleCreateCategory = inputValue => {
    const newOption = {
      label: inputValue,
      value: inputValue.toLowerCase(),
    };
    setOptions(prev => [...prev, newOption]);
    setSelectedOption(newOption);
    setFormData(prev => ({
      ...prev,
      category: newOption.value,
    }));
  };

  const handleTagsChange = tags => {
    setFormData(prev => ({ ...prev, tags }));
  };

  const handlePrivateChange = checked => {
    setFormData(prev => ({ ...prev, private: checked }));
  };

  const handleFilesChange = files => {
    const fileUrls = files.map(file => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, files, fileUrls }));
  };

  const handleRemoveFile = indexToRemove => {
    setFormData(prev => {
      const nextFiles = prev.files.filter((_, index) => index !== indexToRemove);
      const nextFileUrls = prev.fileUrls.filter((_, index) => index !== indexToRemove);
      const removedUrl = prev.fileUrls[indexToRemove];
      if (removedUrl) URL.revokeObjectURL(removedUrl);
      return { ...prev, files: nextFiles, fileUrls: nextFileUrls };
    });
  };

  return {
    formData,
    options,
    selectedOption,
    resetForm,
    handleFormChange,
    handleCategoryChange,
    handleCreateCategory,
    handleTagsChange,
    handlePrivateChange,
    handleFilesChange,
    handleRemoveFile,
    setOptions,
  };
};
