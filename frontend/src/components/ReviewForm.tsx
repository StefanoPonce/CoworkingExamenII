import { useState } from 'react';
import { Star, X } from 'lucide-react';
import type { Reservation } from '../types';
import { api } from '../api/client';

interface ReviewFormProps {
  reservation: Reservation;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({ reservation, onClose, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.createReview({
        reservationId: reservation.id,
        rating,
        comment: comment.trim(),
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al publicar reseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-nido-green-light/50 rounded-xl border border-nido-green/20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-gray-700">
          Tu calificación para {reservation.space.name}
        </p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            <Star
              className={`w-6 h-6 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
            />
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia..."
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-nido-green/30"
          required
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex gap-2 mt-3">
          <button
            type="submit"
            disabled={loading}
            className="text-sm px-4 py-2 bg-nido-green text-white rounded-lg hover:bg-nido-green-dark disabled:opacity-50"
          >
            Publicar reseña
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-2 border border-gray-200 rounded-lg hover:bg-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
