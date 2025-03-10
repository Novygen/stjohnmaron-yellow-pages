import { store } from '@/store';
import { selectAdminToken } from '@/store/slices/adminSlice';

export async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = selectAdminToken(store.getState());

  if (!token) {
    throw new Error('No admin token available');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to fetch');
  }

  return response.json();
} 