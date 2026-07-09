import { useEffect, useState } from 'react';
import { Bell, Check, CheckCheck, Info, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import { api } from '../api/client';
import type { Notification } from '../types';

const typeIcons: Record<string, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle,
  WARNING: AlertCircle,
  ERROR: XCircle,
};

const typeColors: Record<string, string> = {
  INFO: 'bg-blue-50 text-blue-600 border-blue-200',
  SUCCESS: 'bg-green-50 text-green-600 border-green-200',
  WARNING: 'bg-amber-50 text-amber-600 border-amber-200',
  ERROR: 'bg-red-50 text-red-600 border-red-200',
};

function formatNotificationDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  return d.toLocaleDateString('es-HN', { day: 'numeric', month: 'short' });
}

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  useEffect(() => {
    api
      .getNotifications()
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
      );
    } catch {
      /* ignore */
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() })),
      );
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-nido-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-nido-green font-medium mb-1">Nido · Coworking</p>
          <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
          <p className="text-gray-500 mt-2">
            {unreadCount === 0
              ? 'No tienes notificaciones sin leer'
              : `${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-nido-green hover:bg-nido-green-light rounded-lg transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = typeIcons[notification.type] || Info;
            const isUnread = !notification.readAt;

            return (
              <div
                key={notification.id}
                className={`bg-white rounded-xl border p-4 transition-all ${
                  isUnread
                    ? 'border-nido-green bg-nido-green/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      typeColors[notification.type] || typeColors.INFO
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`font-medium ${isUnread ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        {notification.message && (
                          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        )}
                      </div>
                      {isUnread && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="shrink-0 p-1.5 text-gray-400 hover:text-nido-green hover:bg-nido-green-light rounded-lg transition-colors"
                          title="Marcar como leída"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{formatNotificationDate(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
