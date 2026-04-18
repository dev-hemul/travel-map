const BASE_LINK_STYLES =
  'py-2 px-4 rounded-lg flex items-center transition-all duration-200 ease-in-out';

export const useSidebarStyles = (windowWidth, isSidebarOpen) => {
  const breakPoint768 = 768;

  const getLinkStyles = ({ isActive }) => {
    if (windowWidth < breakPoint768 && isSidebarOpen) {
      return `${BASE_LINK_STYLES} ${isActive ? 'bg-[#744ce9] text-white' : 'text-[#797979] hover:bg-[#744CE9] hover:text-white'}`;
    } else if (isSidebarOpen) {
      return `${BASE_LINK_STYLES} ${isActive ? 'bg-[#744ce9] text-white' : 'text-[#797979] hover:bg-[#744CE9] hover:text-white'}`;
    } else {
      return `${BASE_LINK_STYLES} ${isActive ? 'text-[#744ce9]' : 'text-[#797979] hover:text-[#744CE9]'} justify-center`;
    }
  };

  return { getLinkStyles };
};
