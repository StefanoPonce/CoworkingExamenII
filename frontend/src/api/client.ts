const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }

  getToken() {
    if (!this.token) this.token = localStorage.getItem('token');
    return this.token;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(Array.isArray(err.message) ? err.message[0] : err.message || 'Error en la solicitud');
    }

    return res.json();
  }

  login(email: string, password: string) {
    return this.request<{ accessToken: string; user: import('./types').User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  register(name: string, email: string, password: string) {
    return this.request<import('./types').User>('/users', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  me() {
    return this.request<import('./types').User>('/auth/me');
  }

  getSpaces(params?: { search?: string; type?: string; amenities?: string }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.type) query.set('type', params.type);
    if (params?.amenities) query.set('amenities', params.amenities);
    const qs = query.toString();
    return this.request<import('./types').Space[]>(`/spaces${qs ? `?${qs}` : ''}`);
  }

  getSpace(id: number) {
    return this.request<import('./types').Space>(`/spaces/${id}`);
  }

  getAvailability(id: number, date: string) {
    return this.request<{ date: string; slots: import('./types').TimeSlot[] }>(
      `/spaces/${id}/availability?date=${date}`,
    );
  }

  getAmenities() {
    return this.request<import('./types').Amenity[]>('/amenities');
  }

  getMyReservations() {
    return this.request<import('./types').Reservation[]>('/reservations/me');
  }

  createReservation(data: { spaceId: number; startTime: string; endTime: string }) {
    return this.request<import('./types').Reservation>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateReservationStatus(id: number, status: string) {
    return this.request<import('./types').Reservation>(`/reservations/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  getFavorites() {
    return this.request<import('./types').Favorite[]>('/favorites');
  }

  addFavorite(spaceId: number) {
    return this.request(`/favorites/${spaceId}`, { method: 'POST' });
  }

  removeFavorite(spaceId: number) {
    return this.request(`/favorites/${spaceId}`, { method: 'DELETE' });
  }

  createReview(data: { reservationId: number; rating: number; comment: string }) {
    return this.request<import('./types').Review>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getNotifications() {
    return this.request<import('./types').Notification[]>('/notifications');
  }

  markNotificationAsRead(id: number) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export const api = new ApiClient();
