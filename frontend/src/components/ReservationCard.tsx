import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import type { Reservation } from '../types';
import { api } from '../api/client';
import { ReviewForm } from './ReviewForm';

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pendiente', className: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Confirmada', className: 'bg-green-100 text-green-700' },
  COMPLETED: { label: 'Finalizada', className: 'bg-blue-100 text-blue-700' },
  CANCELLED: { label: 'Cancelada', className: 'bg-gray-100 text-gray-500' },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-HN', { day: 'numeric', month: 'short' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit', hour12: false });
}

interface ReservationCardProps {
  reservation: Reservation;
  onUpdate: () => void;
}

export function ReservationCard({ reservation, onUpdate }: ReservationCardProps) {
  const [showReview, setShowReview] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const status = statusConfig[reservation.status];

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await api.updateReservationStatus(reservation.id, 'CANCELLED');
      onUpdate();
    } catch {
      /* ignore */
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{reservation.space.name}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            {reservation.space.location}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {formatDate(reservation.startTime)} · {formatTime(reservation.startTime)}–
            {formatTime(reservation.endTime)}
          </p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="flex gap-2 mt-4">
        {reservation.status === 'PENDING' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}
        {reservation.status === 'CONFIRMED' && (
          <button className="text-sm px-4 py-2 border border-gray-200 rounded-lg text-gray-600">
            Detalles
          </button>
        )}
        {reservation.status === 'COMPLETED' && !reservation.review && (
          <button
            onClick={() => setShowReview(true)}
            className="text-sm px-4 py-2 bg-nido-green text-white rounded-lg hover:bg-nido-green-dark transition-colors flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5" />
            Dejar reseña
          </button>
        )}
        {reservation.review && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            Reseña publicada
          </span>
        )}
      </div>

      {showReview && (
        <ReviewForm
          reservation={reservation}
          onClose={() => setShowReview(false)}
          onSuccess={() => {
            setShowReview(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
