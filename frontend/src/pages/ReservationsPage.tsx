import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ReservationCard } from '../components/ReservationCard';
import type { Reservation } from '../types';

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getMyReservations()
      .then(setReservations)
      .catch(() => setReservations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const active = reservations.filter((r) => r.status !== 'CANCELLED');
  const cancelled = reservations.filter((r) => r.status === 'CANCELLED');

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <p className="text-sm text-nido-green font-medium mb-1">Mi actividad</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis reservas</h1>
      <p className="text-gray-500 mb-8">
        Historial y próximas reservas. Las confirmadas y ya finalizadas pueden reseñarse.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-nido-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No tienes reservas aún.</p>
          <p className="text-sm mt-1">Explora los espacios y reserva tu primer horario.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {active.map((r) => (
            <ReservationCard key={r.id} reservation={r} onUpdate={load} />
          ))}
          {cancelled.length > 0 && (
            <>
              <p className="text-sm text-gray-400 pt-4">Canceladas</p>
              {cancelled.map((r) => (
                <ReservationCard key={r.id} reservation={r} onUpdate={load} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
