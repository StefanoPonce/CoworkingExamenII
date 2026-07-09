import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { ExplorePage } from './pages/ExplorePage';
import { SpaceDetailPage } from './pages/SpaceDetailPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { NotificationsPage } from './pages/NotificationsPage';

function LoginRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <LoginPage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginRedirect />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ExplorePage />} />
            <Route path="espacios/:id" element={<SpaceDetailPage />} />
            <Route path="reservas" element={<ReservationsPage />} />
            <Route path="favoritos" element={<FavoritesPage />} />
            <Route path="notificaciones" element={<NotificationsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
