import FormActions from './FormActions.jsx';
import PersonalInfoForm from './PersonalForm.jsx';
import SocialLinksForm from './socialLinksForm.jsx';

const ProfileForm = ({
  formData,
  handleChange,
  isEditing,
  isLargeScreen,
  openSocialLink,
  isSubmitting,
  error,
  isSuccess,
  toggleEditMode,
  handleSubmit,
}) => {
  return (
    <div className="space-y-6 bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#744ce9]">
          Особисті дані
        </h2>
      </div>

      <PersonalInfoForm
        formData={formData}
        handleChange={handleChange}
        isEditing={isEditing}
        isLargeScreen={isLargeScreen}
      />

      <SocialLinksForm
        formData={formData}
        handleChange={handleChange}
        isEditing={isEditing}
        openSocialLink={openSocialLink}
      />

      <FormActions
        isEditing={isEditing}
        isSubmitting={isSubmitting}
        error={error}
        isSuccess={isSuccess}
        toggleEditMode={toggleEditMode}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProfileForm;
