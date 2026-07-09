import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { api } from '../api/client';

export function Layout() {
  const [reservationCount, setReservationCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    api.getMyReservations().then((r) => setReservationCount(r.length)).catch(() => {});
    api.getFavorites().then((f) => setFavoriteCount(f.length)).catch(() => {});
    api.getNotifications().then((n) => setNotificationCount(n.filter((notif) => !notif.readAt).length)).catch(() => {});
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      <Sidebar reservationCount={reservationCount} favoriteCount={favoriteCount} notificationCount={notificationCount} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
