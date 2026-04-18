import { Outlet } from 'react-router';

import { useSidebarLogic } from './hooks/useSidebarLogic';
import { MobileMenuButton } from './mobileMenuButton';
import { Sidebar } from './Sidebar';
import { SidebarToggle } from './sidebarToggle';

const SidebarLayout = () => {
  const { isSidebarOpen, setIsSidebarOpen, showToggleButton, windowWidth, breakpoints } =
    useSidebarLogic();

  const handleMainContentClick = () => {
    if (windowWidth < breakpoints.MOBILE && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <MobileMenuButton
        isVisible={windowWidth < breakpoints.MOBILE && !isSidebarOpen}
        onClick={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        windowWidth={windowWidth}
        breakpoints={breakpoints}
      />

      {showToggleButton && windowWidth >= breakpoints.MOBILE && (
        <SidebarToggle
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          sidebarWidth={isSidebarOpen ? 256 : 64}
        />
      )}

      <main
        className="flex-1 min-h-screen bg-white p-4 sm:p-6 lg:p-8 transition-all duration-300"
        style={{
          paddingLeft: windowWidth < breakpoints.MOBILE ? '64px' : isSidebarOpen ? '256px' : '64px',
          paddingRight: '16px',
        }}
        onClick={handleMainContentClick}
      >
        <div className="w-full max-w-[1280px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
