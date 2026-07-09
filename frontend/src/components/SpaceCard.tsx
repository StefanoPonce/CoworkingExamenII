import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, Wifi, Monitor, Coffee, LayoutGrid, MapPin, Users, ArrowRight } from 'lucide-react';
import type { Space } from '../types';
import { api } from '../api/client';

const amenityIcons: Record<string, typeof Wifi> = {
  Wifi: Wifi,
  Proyector: Monitor,
  Café: Coffee,
};

const typeLabels: Record<string, string> = {
  SALA: 'SALA',
  ESCRITORIO: 'ESCRITORIO',
  AUDITORIO: 'AUDITORIO',
};

const typeColors: Record<string, string> = {
  SALA: 'bg-blue-100 text-blue-700',
  ESCRITORIO: 'bg-purple-100 text-purple-700',
  AUDITORIO: 'bg-orange-100 text-orange-700',
};

interface SpaceCardProps {
  space: Space;
  onFavoriteToggle?: () => void;
}

export function SpaceCard({ space, onFavoriteToggle }: SpaceCardProps) {
  const [isFavorite, setIsFavorite] = useState(space.isFavorite);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (isFavorite) {
        await api.removeFavorite(space.id);
        setIsFavorite(false);
      } else {
        await api.addFavorite(space.id);
        setIsFavorite(true);
      }
      onFavoriteToggle?.();
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link
      to={`/espacios/${space.id}`}
      className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-nido-green/30 transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-gradient-to-br from-nido-green-light to-nido-green-light/50 h-44 flex items-center justify-center relative overflow-hidden">
        {space.imageUrl ? (
          <>
            <img 
              src={space.imageUrl} 
              alt={space.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-nido-green/5 group-hover:bg-nido-green/10 transition-colors duration-300" />
            <LayoutGrid className="w-16 h-16 text-nido-green/40 group-hover:scale-110 transition-transform duration-300" />
          </>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${typeColors[space.type]} backdrop-blur-sm`}>
            {typeLabels[space.type]}
          </span>
        </div>

        <button
          onClick={toggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 ${
            isFavorite ? 'scale-110' : 'hover:scale-110'
          } ${isHovered ? 'opacity-100' : 'opacity-90'}`}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-300 ${
              isFavorite 
                ? 'fill-red-500 text-red-500 scale-110' 
                : 'text-gray-400 hover:text-red-400'
            }`}
          />
        </button>

        {space.avgRating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-gray-900">{space.avgRating}</span>
            <span className="text-xs text-gray-500">({space.reviewCount})</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-nido-green transition-colors duration-300">
          {space.name}
        </h3>
        
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{space.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{space.capacity} pers.</span>
          </div>
        </div>

        {space.description && (
          <p className="text-sm text-gray-600 mt-3 line-clamp-2 group-hover:text-gray-700 transition-colors">
            {space.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          {space.amenities.slice(0, 4).map((a) => {
            const Icon = amenityIcons[a.name] || Wifi;
            return (
              <span
                key={a.id}
                className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-nido-green-light flex items-center justify-center transition-colors duration-200"
                title={a.name}
              >
                <Icon className="w-4 h-4 text-gray-500 hover:text-nido-green transition-colors" />
              </span>
            );
          })}
          {space.amenities.length > 4 && (
            <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-500">
              +{space.amenities.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Precio por hora</span>
            <span className="text-lg font-bold text-nido-green">
              L {space.pricePerHour}
            </span>
          </div>
          
          <div className={`flex items-center gap-2 text-sm font-medium text-nido-green transition-all duration-300 ${
            isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
          }`}>
            Ver detalles
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
