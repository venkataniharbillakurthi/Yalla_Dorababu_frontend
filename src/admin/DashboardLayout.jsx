import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen flex font-sans">
      <aside className="w-64 bg-orange-500 text-white flex flex-col shadow-lg">
        <h2 className="font-extrabold text-2xl tracking-wide p-6 border-b border-orange-400 bg-orange-600">Admin Panel</h2>
        <nav className="flex flex-col gap-1 p-4 text-base flex-1">
          <NavLink
            to="/dashboard/journey"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all font-medium ${isActive ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-400 hover:text-white'}`
            }
            end
          >
            Life Journey
          </NavLink>
          <NavLink
            to="/dashboard/speeches"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all font-medium ${isActive ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-400 hover:text-white'}`
            }
            end
          >
            Speeches
          </NavLink>
          <NavLink
            to="/dashboard/press-release"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all font-medium ${isActive ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-400 hover:text-white'}`
            }
            end
          >
            Press Release
          </NavLink>
          <NavLink
            to="/dashboard/gallery"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all font-medium ${isActive ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-400 hover:text-white'}`
            }
            end
          >
            Gallery
          </NavLink>
          <NavLink
            to="/dashboard/messages"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg transition-all font-medium ${isActive ? 'bg-white text-orange-600 shadow' : 'hover:bg-orange-400 hover:text-white'}`
            }
            end
          >
            Messages
          </NavLink>
        </nav>
        <button
          onClick={logout}
          className="m-4 mt-auto px-4 py-2 rounded-lg bg-white text-orange-600 font-bold shadow hover:bg-orange-100 border border-orange-200 transition-all"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-white min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
export default DashboardLayout;
