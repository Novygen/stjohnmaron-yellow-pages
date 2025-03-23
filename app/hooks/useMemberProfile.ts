import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';

// Employment interface for different employment types
export interface IEmployment {
  type: 'employed' | 'business_owner' | 'student';
  details: {
    // For employed
    companyName?: string;
    jobTitle?: string;
    specialization?: string;
    
    // For business owner
    businessName?: string;
    industry?: string;
    description?: string;
    website?: string;
    phoneNumber?: string;
    businessEmail?: string;
    
    // For student
    schoolName?: string;
    fieldOfStudy?: string;
    expectedGraduationYear?: string;
  };
  isActive: boolean;
}

// Visibility settings interface
export interface IVisibility {
  profile: 'private' | 'public';
  contact: {
    email: 'private' | 'public';
    phone: 'private' | 'public';
    address: 'private' | 'public';
  };
  employment: {
    current: 'private' | 'public';
    history: 'private' | 'public';
  };
  social: 'private' | 'public';
  phoneNumber?: 'private' | 'public'; // Legacy field
}

// Skills interface
export interface ISkills {
  skills: string;
  description: string;
}

// Social presence interface
export interface ISocialPresence {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  website?: string;
  twitter?: string;
}

export interface MemberProfile {
  // Personal Details
  firstName: string;
  lastName: string;
  middleName?: string;
  ageRange?: string;
  state?: string;
  profileImage?: string;
  parishStatus?: string;
  
  // Contact Information
  email: string;
  phone: string;
  address: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  
  // Professional Information
  employments: IEmployment[];
  skills: ISkills;
  
  // Social Presence
  socialPresence: ISocialPresence;
  
  // Visibility Settings
  visibility: IVisibility;
  
  // Approval Status
  isApproved: boolean;
}

export function useMemberProfile() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setError('User is not authenticated');
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = await user?.getIdToken();
      const response = await fetch('/api/member/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError(typeof error === 'string' ? error : (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<MemberProfile>) => {
    if (!user) {
      setError('User is not authenticated');
      return null;
    }

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/member/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(typeof error === 'string' ? error : (error as Error).message);
      return null;
    }
  };

  const refreshProfile = () => {
    fetchProfile();
  };

  return { profile, loading, error, updateProfile, refreshProfile };
} 