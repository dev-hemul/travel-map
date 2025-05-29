import react from "react";

const ProfilePage = () => {
  return (
    <>
      <h2 className="text-3xl font-bold text-indigo-900 mb-8">Персональні дані</h2>
      
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-start space-x-8">
          {/* Avatar Section */}
          <div className="w-1/4">
            <div className="bg-indigo-100 rounded-full w-40 h-40 flex items-center justify-center mb-4">
              <span className="text-indigo-500 text-4xl">АС</span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-indigo-900">Андрій</h3>
              <h3 className="text-xl font-semibold text-indigo-900">Стегній</h3>
              <p className="text-gray-500">По батькові</p>
              <p className="text-gray-500">Місце</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-indigo-600">test@gmail.com</p>
              <p className="text-indigo-600">38 (099) 999 99 99</p>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="w-3/4">
            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 mb-6">
              <h4 className="text-lg font-semibold text-indigo-900 mb-2">Додати фото</h4>
              <p className="text-gray-500 text-sm mb-4">Jpg, png, розміром від 600×600 пікселів, до 10 МБ</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 ease-in-out">
                Завантажити
              </button>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-indigo-900 mb-4">Авторизуйтесь в один клік</h4>
              <button className="flex items-center justify-center space-x-2 bg-white border border-indigo-300 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-50 w-full">
                <span>Прив'язати Google акаунт</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;