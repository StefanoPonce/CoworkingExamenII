import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Star,
  Users,
  MapPin,
  Wifi,
  Monitor,
  Coffee,
  CheckCircle,
} from 'lucide-react';
import { api } from '../api/client';
import type { Space, TimeSlot } from '../types';

const amenityIcons: Record<string, typeof Wifi> = {
  Wifi,
  Proyector: Monitor,
  Café: Coffee,
};

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('es-HN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatReviewDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-HN', { day: 'numeric', month: 'short' });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getSpace(Number(id))
      .then((s) => {
        setSpace(s);
        setIsFavorite(s.isFavorite);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    api
      .getAvailability(Number(id), selectedDate)
      .then((res) => setSlots(res.slots))
      .catch(() => setSlots([]));
    setSelectedHour(null);
    setBooked(false);
  }, [id, selectedDate]);

  const toggleFavorite = async () => {
    if (!space) return;
    try {
      if (isFavorite) {
        await api.removeFavorite(space.id);
        setIsFavorite(false);
      } else {
        await api.addFavorite(space.id);
        setIsFavorite(true);
      }
    } catch {
      /* ignore */
    }
  };

  const handleBook = async () => {
    if (!space || selectedHour === null) return;
    setBooking(true);
    try {
      const startTime = `${selectedDate}T${String(selectedHour).padStart(2, '0')}:00:00`;
      const endTime = `${selectedDate}T${String(selectedHour + 1).padStart(2, '0')}:00:00`;
      await api.createReservation({ spaceId: space.id, startTime, endTime });
      setBooked(true);
      const res = await api.getAvailability(space.id, selectedDate);
      setSlots(res.slots);
      setSelectedHour(null);
    } catch {
      /* ignore */
    } finally {
      setBooking(false);
    }
  };

  if (loading || !space) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-nido-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-nido-green mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a explorar
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{space.name}</h1>
                <p className="text-gray-500 mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {space.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {space.capacity} personas
                  </span>
                </p>
              </div>
              <button
                onClick={toggleFavorite}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:scale-110 transition-transform shrink-0"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
              </button>
            </div>
            {space.description && (
              <p className="text-gray-600 mt-4 leading-relaxed">{space.description}</p>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Comodidades</h3>
            <div className="flex flex-wrap gap-3">
              {space.amenities.map((a) => {
                const Icon = amenityIcons[a.name] || Wifi;
                return (
                  <span
                    key={a.id}
                    className="flex items-center gap-2 px-4 py-2 bg-nido-green-light rounded-xl text-sm text-nido-green"
                  >
                    <Icon className="w-4 h-4" />
                    {a.name}
                  </span>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reseñas</h3>
              {space.avgRating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{space.avgRating}</span>
                  <span className="text-sm text-gray-400">{space.reviewCount} reseñas</span>
                </div>
              )}
            </div>

            {space.reviews && space.reviews.length > 0 ? (
              <div className="space-y-4">
                {space.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-nido-green-light flex items-center justify-center text-xs font-semibold text-nido-green">
                        {getInitials(review.user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                        <p className="text-xs text-gray-400">{formatReviewDate(review.createdAt)}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Aún no hay reseñas para este espacio.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
            <p className="text-2xl font-bold text-nido-green">
              L {space.pricePerHour}
              <span className="text-base font-normal text-gray-400">/ hora</span>
            </p>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nido-green/30"
              />
              <p className="text-xs text-gray-400 mt-1 capitalize">{formatDateLabel(selectedDate)}</p>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Horario disponible
              </label>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.hour}
                    disabled={!slot.available}
                    onClick={() => setSelectedHour(slot.hour)}
                    className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                      !slot.available
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        : selectedHour === slot.hour
                          ? 'bg-nido-green text-white'
                          : 'bg-nido-green-light text-nido-green hover:bg-nido-green/20'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {booked ? (
              <div className="mt-6 flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm">
                <CheckCircle className="w-4 h-4 shrink-0" />
                Solicitud enviada — revisa &quot;Mis reservas&quot;
              </div>
            ) : (
              <button
                onClick={handleBook}
                disabled={selectedHour === null || booking}
                className="w-full mt-6 py-3 bg-nido-green text-white rounded-xl font-medium hover:bg-nido-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {booking ? 'Reservando...' : 'Reservar este horario'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
