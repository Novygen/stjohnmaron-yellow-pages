import { useState, useEffect } from 'react';

export interface MemberProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  isApproved: boolean;
}

export function useMemberProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/member/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<MemberProfile>) => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating profile:', err);
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
} 