import { useState, useRef, useEffect } from 'react';

import api from '@/api/api';

export const useProfileData = () => {
  const [formData, setFormData] = useState({
    firstName: 'Іван',
    lastName: 'Іванов',
    middleName: 'Іванович',
    location: 'Київ, Україна',
    email: 'ivanov@example.com',
    phone: '+380991234567',
    instagram: 'https://instagram.com/ivan_ivanov',
    facebook: 'https://facebook.com/ivan.ivanov',
    telegram: 'https://t.me/ivan_ivanov',
  });
  const [initialFormData, setInitialFormData] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setInitialFormData(formData);
  }, [formData]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Розмір файлу повинен бути менше 10 МБ');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Дозволені лише JPG/PNG/WEBP файли');
      return;
    }
    setAvatar(file);
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsSuccess(false);
    setError(null);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (avatar) formDataToSend.append('avatar', avatar);
      const response = await api.post('/profileChanges', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (response.status === 200) {
        setIsSuccess(true);
        setInitialFormData(formData);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Помилка при збереженні даних. Спробуйте ще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAvatar = () => {
    setAvatar(null);
    setAvatarPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const getInitials = () => {
    if (formData.firstName && formData.lastName) {
      return formData.firstName.charAt(0) + formData.lastName.charAt(0);
    }
    return 'ІП';
  };

  return {
    formData,
    setFormData,
    initialFormData,
    setInitialFormData,
    avatar,
    avatarPreview,
    isSubmitting,
    isSuccess,
    error,
    setError,
    fileInputRef,
    handleChange,
    handleAvatarChange,
    handleSubmit,
    resetAvatar,
    getInitials,
  };
};
