import { Route, Routes } from 'react-router';

import AdminRouter from './AdminRouter.jsx';
import PrivateRouter from './PrivateRouter';
import AnnouncementModal from '../../components/announcements/announcementModal';
import NotFoundPage from '../../components/NotFoundPage';
import SidebarLayout from '../../components/sidebarLayout/sidebarLayout';
import SupportModalWrapper from '../../modules/support/components/supportModalWrapper';
import AdminPage from '../../pages/adminPage.jsx';
import AnnouncementDetailPage from '../../pages/announcementDetailPage';
import CreateAnnouncementPage from '../../pages/createAnnouncementPage';
import GoogleCallback from '../../pages/googleCallback.jsx';
import LoginPage from '../../pages/loginPage';
import MapView from '../../pages/MapView';
import ProfilePage from '../../pages/profilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <MapView />
            <SupportModalWrapper />
            <AnnouncementModal />
          </>
        }
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallback />} />
      <Route path="/announcement/:id" element={<AnnouncementDetailPage />} />
      <Route path="/create-announcement" element={<CreateAnnouncementPage />} />

      <Route element={<PrivateRouter />}>
          <Route element={<SidebarLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route element={<AdminRouter />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
          <Route path="/announcements" element={<div>Оголошення</div>} />
          <Route path="/routes" element={<div>Маршрути</div>} />
          <Route path="/support" element={<div>Підтримка</div>} />
          <Route path="/settings" element={<div>Налаштування</div>} />
          <Route path="/auth" element={<div>Налаштування авторизації</div>} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
