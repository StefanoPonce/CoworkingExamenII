export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Amenity {
  id: number;
  name: string;
  icon?: string;
}

export interface Space {
  id: number;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  type: 'SALA' | 'ESCRITORIO' | 'AUDITORIO';
  imageUrl?: string;
  pricePerHour: number;
  amenities: Amenity[];
  avgRating: number | null;
  reviewCount: number;
  isFavorite: boolean;
  reviews?: Review[];
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: number; name: string };
}

export interface Reservation {
  id: number;
  userId: number;
  spaceId: number;
  startTime: string;
  endTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  reason?: string;
  space: Space;
  review?: Review | null;
}

export interface TimeSlot {
  hour: number;
  label: string;
  available: boolean;
}

export interface Favorite {
  spaceId: number;
  createdAt: string;
  space: Space;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Notification {
  id: number;
  title: string;
  message?: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  readAt?: string;
  createdAt: string;
}
