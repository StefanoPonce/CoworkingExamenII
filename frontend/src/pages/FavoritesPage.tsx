import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SpaceCard } from '../components/SpaceCard';
import type { Space } from '../types';

export function FavoritesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .getFavorites()
      .then((favs) => setSpaces(favs.map((f) => ({ ...f.space, isFavorite: true }))))
      .catch(() => setSpaces([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <p className="text-sm text-nido-green font-medium mb-1">Guardados</p>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis favoritos</h1>
      <p className="text-gray-500 mb-8">
        Espacios que marcaste para reservar rápido la próxima vez.
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-nido-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No tienes favoritos guardados.</p>
          <p className="text-sm mt-1">Marca espacios con el corazón al explorar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} onFavoriteToggle={load} />
          ))}
        </div>
      )}
    </div>
  );
}
