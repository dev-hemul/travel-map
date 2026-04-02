import { useEffect, useState } from 'react';

import AdminToolbar from '../modules/admin/components/AdminToolbar.jsx';
import UsersTable from '../modules/admin/components/UsersTable.jsx';
import { useAdminUsers } from '../modules/admin/hooks/useAdminUsers.jsx';

export default function AdminPage() {
  const {
    users,
    loading,
    search,
    setSearch,
    showUsers,
    toggleUsers,
    sortBy,
    sortOrder,
    handleSort,
    banUser,
    unbanUser,
    updateRole,
    page,
    setPage,
    pages,
  } = useAdminUsers();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () =>
      setIsMobile(window.innerWidth < 768);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="mb-4 text-2xl font-semibold">
        Адміністрування
      </h1>

      <AdminToolbar
        showUsers={showUsers}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        onToggleUsers={toggleUsers}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => {
          if (field !== sortBy) {
            handleSort(field);
          } 
        }}
      />
      {showUsers && (
        <>
          <UsersTable
            users={users}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onBan={banUser}
            onUnban={unbanUser}
            onUpdateRole={updateRole}
            isMobile={isMobile} 
          />

          {/* пагінація */}
            {pages > 1 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {Array.from({ length: pages }, (_, i) => {
                  const isActive = page === i + 1;

                  return (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`
                        px-3 py-1
                        rounded-lg
                        font-semibold
                        border-0
                        transition-colors duration-200
                        ${
                          isActive
                            ? 'bg-[#5d39b3] text-white'
                            : 'bg-[#744ce9] text-white hover:bg-[#5d39b3]'
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            )}
        </>
      )}
    </div>
  );
}