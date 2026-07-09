import { useEffect, useState } from 'react';
import { Search, Building2, Monitor, Users, Briefcase } from 'lucide-react';
import { api } from '../api/client';
import { SpaceCard } from '../components/SpaceCard';
import type { Amenity, Space } from '../types';

const categoryFilters = [
  { value: '', label: 'Todos', icon: Building2, color: 'bg-gray-100 text-gray-700' },
  { value: 'SALA', label: 'Salas', icon: Briefcase, color: 'bg-blue-100 text-blue-700' },
  { value: 'ESCRITORIO', label: 'Escritorios', icon: Monitor, color: 'bg-purple-100 text-purple-700' },
  { value: 'AUDITORIO', label: 'Auditorios', icon: Users, color: 'bg-orange-100 text-orange-700' },
];

export function ExplorePage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAmenities().then(setAmenities).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getSpaces({
        search: search || undefined,
        type: type || undefined,
        amenities: selectedAmenities.length ? selectedAmenities.join(',') : undefined,
      })
      .then(setSpaces)
      .catch(() => setSpaces([]))
      .finally(() => setLoading(false));
  }, [search, type, selectedAmenities]);

  const toggleAmenity = (name: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-nido-green font-medium mb-1">Nido · Coworking</p>
        <h1 className="text-3xl font-bold text-gray-900">Encuentra tu espacio ideal</h1>
        <p className="text-gray-500 mt-2">
          {spaces.length} espacio{spaces.length !== 1 ? 's' : ''} disponible
          {spaces.length !== 1 ? 's' : ''} hoy en el campus. Filtra por tipo o por lo que necesites en la sala.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {categoryFilters.map((f) => {
          const Icon = f.icon;
          const isActive = type === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-nido-green text-white shadow-md shadow-nido-green/30'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-nido-green/50 hover:shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-8">
        {amenities.map((a) => (
          <button
            key={a.id}
            onClick={() => toggleAmenity(a.name)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedAmenities.includes(a.name)
                ? 'bg-nido-green-light text-nido-green border-2 border-nido-green'
                : 'bg-white border border-gray-200 text-gray-600 hover:border-nido-green/50'
            }`}
          >
            {a.name}
          </button>
        ))}
        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar espacio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-nido-green/30 focus:border-nido-green/50 transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-nido-green border-t-transparent rounded-full animate-spin" />
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p>No se encontraron espacios con esos filtros.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <SpaceCard key={space.id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
