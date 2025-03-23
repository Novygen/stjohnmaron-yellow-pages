// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, RefreshCw, Building, Briefcase, GraduationCap, UserPlus, LogIn } from "lucide-react";

interface Industry {
  id: string;
  name: string;
}

interface Specialization {
  id: string;
  name: string;
  industryId: string;
}

interface MemberEmployment {
  type: string;
  companyName?: string;
  jobTitle?: string;
  specialization?: string;
  businessName?: string;
  industry?: string;
  schoolName?: string;
  fieldOfStudy?: string;
}

interface MemberItem {
  id: string;
  uid: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImage?: string;
  employmentStatus?: MemberEmployment;
  employmentStatuses: MemberEmployment[];
}

interface FilterOptions {
  industry: string;
  specialization: string;
  search: string;
}

export default function Home() {
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<MemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    industry: "",
    specialization: "",
    search: ""
  });
  
  // Fetch industries and specializations
  useEffect(() => {
    const fetchFilterData = async () => {
      setIsLoadingFilters(true);
      try {
        // Fetch industries
        const industriesResponse = await fetch('/api/industries');
        if (!industriesResponse.ok) {
          throw new Error('Failed to fetch industries');
        }
        const industriesData = await industriesResponse.json();
        setIndustries(industriesData);

        // Fetch all specializations
        const specializationsResponse = await fetch('/api/specializations/all');
        if (!specializationsResponse.ok) {
          throw new Error('Failed to fetch specializations');
        }
        const specializationsData = await specializationsResponse.json();
        setSpecializations(specializationsData);
      } catch (err) {
        console.error('Error loading filter data:', err);
      } finally {
        setIsLoadingFilters(false);
      }
    };

    fetchFilterData();
  }, []);
  
  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        
        // Build URL with filter parameters
        let url = '/api/directory';
        const params = new URLSearchParams();
        
        if (filters.industry) {
          params.append('industry', filters.industry);
        }
        
        if (filters.specialization) {
          params.append('specialization', filters.specialization);
        }
        
        if (filters.search) {
          params.append('search', filters.search);
        }
        
        // Add query parameters if any exist
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }
        
        const data = await response.json();
        setMembers(data);
        setFilteredMembers(data);
      } catch (err) {
        setError('Failed to load members. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMembers();
  }, [filters]); // Re-fetch when filters change
  
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    // If changing industry, reset specialization
    if (key === 'industry' && value !== filters.industry) {
      setFilters(prev => ({ ...prev, [key]: value, specialization: '' }));
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };
  
  const resetFilters = () => {
    setFilters({
      industry: "",
      specialization: "",
      search: ""
    });
  };
  
  // Get industry-specific specializations
  const getFilteredSpecializations = () => {
    if (!filters.industry) return specializations;
    return specializations.filter(spec => spec.industryId === filters.industry);
  };
  
  // Get appropriate icon for employment type
  const getEmploymentIcon = (type: string) => {
    switch (type) {
      case 'employed':
        return <Briefcase className="h-5 w-5 text-gray-400" />;
      case 'business_owner':
        return <Building className="h-5 w-5 text-gray-400" />;
      case 'student':
        return <GraduationCap className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  // Get employment description for display
  const getEmploymentDescription = (employment: MemberEmployment) => {
    if (!employment?.type) return '';
    
    switch (employment.type) {
      case 'employed':
        return `${employment.jobTitle} at ${employment.companyName}`;
      case 'business_owner':
        return `Owner at ${employment.businessName}`;
      case 'student':
        return `Student at ${employment.schoolName}`;
      default:
        return '';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <h1 className="text-xl font-bold text-gray-900">St. John Maron Community</h1>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 w-full sm:w-auto sm:space-x-4">
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Member Access
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Hero section */}
        <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <h2 className="text-2xl font-bold">Community Directory</h2>
            <p className="mt-1 text-sm">Connect with members of our community</p>
          </div>
          
          {/* Search and filters */}
          <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* Search input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, company, job title, school..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              {/* Filter options - always visible */}
              <div className="p-4 bg-gray-50 rounded-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Industry filter */}
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={filters.industry}
                      onChange={(e) => handleFilterChange('industry', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      disabled={isLoadingFilters}
                    >
                      <option value="">All Industries</option>
                      {industries.map((industry) => (
                        <option key={industry.id} value={industry.id}>
                          {industry.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Specialization filter */}
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialization
                    </label>
                    <select
                      id="specialization"
                      value={filters.specialization}
                      onChange={(e) => handleFilterChange('specialization', e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      disabled={isLoadingFilters || (!!filters.industry && getFilteredSpecializations().length === 0)}
                    >
                      <option value="">All Specializations</option>
                      {getFilteredSpecializations().map((specialization) => (
                        <option key={specialization.id} value={specialization.id}>
                          {specialization.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Reset filters button */}
                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      disabled={!filters.industry && !filters.specialization && !filters.search}
                      className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Members listing */}
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                    <div className="p-4 flex items-center space-x-4">
                      <div className="rounded-full bg-gray-200 h-12 w-12 flex-shrink-0"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try Again
                </button>
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No members found matching your filters.</p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
                  </p>
                  
                  {filteredMembers.length < members.length && (
                    <p className="text-xs text-gray-500">
                      Filtered from {members.length} total members
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMembers.map((member) => (
                    <Link 
                      href={`/directory/${member.id}`}
                      key={member.id}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
                    >
                      <div className="p-4 flex items-start space-x-4 flex-grow">
                        <div className="flex-shrink-0">
                          {member.profileImage ? (
                            <Image
                              src={member.profileImage}
                              alt={member.fullName}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                              {member.firstName.charAt(0)}
                              {member.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.fullName}
                          </p>
                          {member.employmentStatuses.length > 0 && (
                            <div className="flex items-center mt-1">
                              {getEmploymentIcon(member.employmentStatuses[0]?.type || '')}
                              <p className="text-sm text-gray-500 truncate ml-1">
                                {getEmploymentDescription(member.employmentStatuses[0])}
                                {member.employmentStatuses.length > 1 && (
                                  <span className="ml-1 text-xs text-blue-600">
                                    +{member.employmentStatuses.length - 1} more
                                  </span>
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} St. John Maron Community. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
