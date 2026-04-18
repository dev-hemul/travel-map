import { CgProfile } from 'react-icons/cg';
import { FaRoute, FaBullhorn, FaUserShield } from 'react-icons/fa';
import { IoMdSettings } from 'react-icons/io';

export const SIDEBAR_LINKS = [
  { to: '/profile', icon: <CgProfile size={29} />, label: 'Профіль' },
  { to: '/announcements', icon: <FaBullhorn size={25} />, label: 'Оголошення' },
  { to: '/routes', icon: <FaRoute size={25} />, label: 'Маршрути' },
  { to: '/settings', icon: <IoMdSettings size={25} />, label: 'Налаштування' },
  { to: '/admin', icon: <FaUserShield size={25} />, label: 'Адміністрування' },
];

export const BREAKPOINTS = {
  MOBILE: 768,
  TABLET: 1200,
};
