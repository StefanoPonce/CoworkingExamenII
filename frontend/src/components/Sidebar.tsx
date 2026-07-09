import { NavLink } from 'react-router-dom';
import { Search, CalendarDays, Heart, LogOut, Building2, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  reservationCount?: number;
  favoriteCount?: number;
  notificationCount?: number;
}

export function Sidebar({ reservationCount = 0, favoriteCount = 0, notificationCount = 0 }: SidebarProps) {
  const { user, logout } = useAuth();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-nido-green-light text-nido-green'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`;

  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-nido-green flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Nido</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavLink to="/" end className={linkClass}>
          <Search className="w-4 h-4" />
          Explorar
        </NavLink>
        <NavLink to="/reservas" className={linkClass}>
          <CalendarDays className="w-4 h-4" />
          Mis reservas
          {reservationCount > 0 && (
            <span className="ml-auto bg-nido-green text-white text-xs px-2 py-0.5 rounded-full">
              {reservationCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/favoritos" className={linkClass}>
          <Heart className="w-4 h-4" />
          Favoritos
          {favoriteCount > 0 && (
            <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              {favoriteCount}
            </span>
          )}
        </NavLink>
        <NavLink to="/notificaciones" className={linkClass}>
          <Bell className="w-4 h-4" />
          Notificaciones
          {notificationCount > 0 && (
            <span className="ml-auto bg-nido-green text-white text-xs px-2 py-0.5 rounded-full">
              {notificationCount}
            </span>
          )}
        </NavLink>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-nido-green-light flex items-center justify-center text-nido-green text-sm font-semibold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
