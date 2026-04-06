import { FiNavigation, FiTool, FiCode } from 'react-icons/fi';

const TAB_ICONS = {
  travel: <FiNavigation />,
  wellness: <FiTool />,
  websites: <FiCode />,
  spoons: <FiTool />,
};

export const TabNavigation = ({
  activeTab,
  activeSubTab,
  onTabChange,
  onSubTabChange,
  sections,
}) => {
  const mainTabs = [
    { id: 'travel', label: 'Подорожі' },
    { id: 'wellness', label: 'Оздоровлення' },
    { id: 'websites', label: 'Сайти' },
    { id: 'spoons', label: 'Ложки' },
  ];

  const getSubTabs = () => {
    const subTabs = [{ id: 'details', label: 'Детальніше' }];
    if (activeTab === 'travel') subTabs.push({ id: 'reports', label: 'Звіти' });
    subTabs.push({ id: 'reviews', label: 'Відгуки' });
    if (sections[activeTab]?.videos?.length) subTabs.push({ id: 'videos', label: 'Відео' });
    return subTabs;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 md:mb-8">
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {mainTabs.map(tab => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={TAB_ICONS[tab.id]}
              isActive={activeTab === tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onSubTabChange('details');
              }}
            />
          ))}
        </div>
      </div>

      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex min-w-max">
          {getSubTabs().map(tab => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeSubTab === tab.id}
              onClick={() => onSubTabChange(tab.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 font-medium text-sm border-b-2 transition-colors flex-shrink-0 ${
      isActive
        ? 'border-[#e65000] text-[#e65000]'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);
