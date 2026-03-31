import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import api from '@/api/api';
import AvatarSection from '@/components/profile/AvatarSection';
import MobileMenu from '@/components/profile/MobileMenu';
import ProfileForm from '@/components/profile/ProfileForm';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { useProfileData } from '@/hooks/useProfileData';
import { useWindowSize } from '@/hooks/useWindowSize';

const ProfilePage = () => {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    initialFormData,
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
  } = useProfileData();

  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { windowWidth, isLargeScreen, isMediumScreen, isSmallScreen, isXSmallScreen } =
    useWindowSize();

  const getAvatarSize = () => {
    if (isXSmallScreen) return 'w-20 h-20';
    if (isSmallScreen) return 'w-24 h-24';
    if (isMediumScreen) return 'w-32 h-32';
    return 'w-40 h-40';
  };

  const getAvatarTextSize = () => {
    if (isXSmallScreen) return 'text-2xl';
    if (isSmallScreen) return 'text-3xl';
    if (isMediumScreen) return 'text-4xl';
    return 'text-5xl';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const toggleEditMode = () => {
    if (isEditing) setFormData(initialFormData);
    setIsEditing(!isEditing);
    setError(null);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    try {
      await api.post('/logout', {}, { withCredentials: true });
    } finally {
      navigate('/');
    }
  };

  const openSocialLink = platform => {
    const url = formData[platform];
    if (url?.startsWith('http')) window.open(url, '_blank');
  };

  return (
    <div
      className={`min-h-full mx-auto px-4 py-8 rounded-lg mb-10 container sm:ml-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
    >
      <ProfileHeader
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleLogout={handleLogout}
        getInitials={getInitials}
        firstName={formData.firstName}
        lastName={formData.lastName}
        isMobileMenuOpen={isMobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        isLargeScreen={isLargeScreen}
        windowWidth={windowWidth}
      />

      {isMobileMenuOpen && windowWidth < 1200 && (
        <MobileMenu
          toggleDarkMode={toggleDarkMode}
          handleLogout={handleLogout}
          getInitials={getInitials}
          firstName={formData.firstName}
          lastName={formData.lastName}
        />
      )}

      <form onSubmit={handleSubmit}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`grid gap-8 ${isLargeScreen ? 'grid-cols-[1fr_2fr]' : 'grid-cols-1'}`}
        >
          <AvatarSection
            avatarPreview={avatarPreview}
            getInitials={getInitials}
            isEditing={isEditing}
            triggerFileInput={triggerFileInput}
            resetAvatar={resetAvatar}
            getAvatarSize={getAvatarSize}
            getAvatarTextSize={getAvatarTextSize}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
          />

          <ProfileForm
            formData={formData}
            handleChange={handleChange}
            isEditing={isEditing}
            isLargeScreen={isLargeScreen}
            openSocialLink={openSocialLink}
            isSubmitting={isSubmitting}
            error={error}
            isSuccess={isSuccess}
            toggleEditMode={toggleEditMode}
            handleSubmit={handleSubmit}
          />
        </motion.div>
      </form>
    </div>
  );
};

export default ProfilePage;
