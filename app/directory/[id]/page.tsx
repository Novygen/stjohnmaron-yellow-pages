"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Building, Briefcase, GraduationCap, Mail, Phone, MapPin, Globe, Linkedin, Instagram, Facebook, Twitter } from 'lucide-react';

interface EmploymentInfo {
  type: string;
  companyName?: string;
  jobTitle?: string;
  specialization?: string;
  businessName?: string;
  industry?: string;
  description?: string;
  website?: string;
  schoolName?: string;
  fieldOfStudy?: string;
}

interface MemberDetails {
  id: string;
  personalDetails: {
    firstName: string;
    lastName: string;
    fullName: string;
    profileImage?: string;
  };
  contactInformation?: {
    email?: string;
    phone?: string;
    address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
    };
  };
  employmentStatus?: EmploymentInfo; // For backward compatibility
  employmentStatuses?: EmploymentInfo[];
  socialPresence?: {
    linkedInProfile?: string;
    personalWebsite?: string;
    instagramProfile?: string;
    facebookProfile?: string;
    xProfile?: string;
  };
}

export default function MemberDirectoryPage() {
  const params = useParams();
  const memberId = params.id as string;
  
  const [member, setMember] = useState<MemberDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/directory/${memberId}`);
        
        if (!response.ok) {
          throw new Error(response.statusText || 'Failed to fetch member details');
        }
        
        const data = await response.json();
        setMember(data);
      } catch (err) {
        setError('Could not load member information. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMemberDetails();
  }, [memberId]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-pulse flex flex-col items-center w-full max-w-2xl">
          <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded mb-8"></div>
          <div className="w-full bg-white shadow rounded-lg overflow-hidden">
            <div className="h-12 bg-gray-200 w-full mb-4"></div>
            <div className="px-4 py-5 space-y-4 w-full">
              <div className="h-40 bg-gray-100 rounded w-full"></div>
              <div className="h-24 bg-gray-100 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-10">
        <h1 className="text-2xl font-bold mb-4">Member Not Found</h1>
        <p className="text-gray-600 mb-6 max-w-md">{error || 'This member profile is not available or does not exist.'}</p>
        <Link 
          href="/" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to Directory
        </Link>
      </div>
    );
  }
  
  // Format address if available
  const formattedAddress = () => {
    if (!member.contactInformation?.address) return null;
    
    const address = member.contactInformation.address;
    const parts = [
      address.line1,
      address.line2,
      [address.city, address.state].filter(Boolean).join(', '),
      address.zip,
      address.country
    ].filter(Boolean);
    
    return parts.join(', ');
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
  
  // Get employment title for display in the header
  const getEmploymentTitle = (employment: EmploymentInfo) => {
    if (!employment?.type) return null;
    
    switch (employment.type) {
      case 'employed':
        return `${employment.jobTitle} at ${employment.companyName}`;
      case 'business_owner':
        return `Owner at ${employment.businessName}`;
      case 'student':
        return `Student at ${employment.schoolName}`;
      default:
        return null;
    }
  };
  
  // Get employments to display
  const getEmploymentsToDisplay = (): EmploymentInfo[] => {
    if (member.employmentStatuses && member.employmentStatuses.length > 0) {
      return member.employmentStatuses;
    } else if (member.employmentStatus) {
      return [member.employmentStatus];
    }
    return [];
  };
  
  const employments = getEmploymentsToDisplay();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link
              href="/"
              className="inline-flex items-center mr-4 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Directory
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">Member Profile</h1>
          </div>
        </div>
      </div>
      
      {/* Profile content */}
      <div className="flex-grow">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Profile header */}
            <div className="px-4 py-5 sm:px-6 flex flex-col sm:flex-row items-center sm:items-start">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                {member.personalDetails.profileImage ? (
                  <Image
                    src={member.personalDetails.profileImage}
                    alt={member.personalDetails.fullName}
                    width={128}
                    height={128}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl font-medium text-gray-500">
                      {member.personalDetails.firstName.charAt(0)}
                      {member.personalDetails.lastName.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left w-full">
                <h2 className="text-2xl font-bold text-gray-900 sm:mt-2">{member.personalDetails.fullName}</h2>
                
                {employments.length > 0 && (
                  <div className="mt-2 flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                    {getEmploymentIcon(employments[0].type)}
                    <span className={getEmploymentIcon(employments[0].type) ? "ml-0 sm:ml-2 mt-1 sm:mt-0" : ""}>
                      {getEmploymentTitle(employments[0])}
                    </span>
                    {employments.length > 1 && (
                      <span className="ml-2 text-blue-600 text-xs">
                        +{employments.length - 1} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Profile details */}
            <div className="border-t border-gray-200">
              <dl>
                {/* Employment section */}
                {employments.length > 0 && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2 sm:mb-0">Professional Information</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <div className="space-y-6">
                        {employments.map((employment, index) => (
                          <div key={index} className={index > 0 ? "pt-6 border-t border-gray-200" : ""}>
                            {employment.type === 'employed' && (
                              <>
                                <div className="flex items-center">
                                  <Briefcase className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="font-medium">{employment.jobTitle}</p>
                                </div>
                                <p className="mt-1">Company: {employment.companyName}</p>
                                {employment.specialization && (
                                  <p>Specialization: {employment.specialization}</p>
                                )}
                              </>
                            )}
                            
                            {employment.type === 'business_owner' && (
                              <>
                                <div className="flex items-center">
                                  <Building className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="font-medium break-words">{employment.businessName}</p>
                                </div>
                                {employment.industry && (
                                  <p className="mt-1">Industry: {employment.industry}</p>
                                )}
                                {employment.description && (
                                  <p className="mt-1 break-words">{employment.description}</p>
                                )}
                                {employment.website && (
                                  <a 
                                    href={employment.website.startsWith('http') ? employment.website : `https://${employment.website}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500 break-all"
                                  >
                                    <Globe className="h-4 w-4 mr-1 flex-shrink-0" />
                                    Website
                                  </a>
                                )}
                              </>
                            )}
                            
                            {employment.type === 'student' && (
                              <>
                                <div className="flex items-center">
                                  <GraduationCap className="h-5 w-5 text-gray-400 mr-2 flex-shrink-0" />
                                  <p className="font-medium">Student</p>
                                </div>
                                <p className="mt-1">School: {employment.schoolName}</p>
                                {employment.fieldOfStudy && (
                                  <p>Field of Study: {employment.fieldOfStudy}</p>
                                )}
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </dd>
                  </div>
                )}
                
                {/* Contact information */}
                {(member.contactInformation?.email || member.contactInformation?.phone || formattedAddress()) && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2 sm:mb-0">Contact Information</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 space-y-2">
                      {member.contactInformation?.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a href={`mailto:${member.contactInformation.email}`} className="text-blue-600 hover:text-blue-500 break-all">
                            {member.contactInformation.email}
                          </a>
                        </div>
                      )}
                      
                      {member.contactInformation?.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a href={`tel:${member.contactInformation.phone}`} className="text-blue-600 hover:text-blue-500">
                            {member.contactInformation.phone}
                          </a>
                        </div>
                      )}
                      
                      {formattedAddress() && (
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{formattedAddress()}</span>
                        </div>
                      )}
                    </dd>
                  </div>
                )}
                
                {/* Social presence */}
                {member.socialPresence && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500 mb-2 sm:mb-0">Social Presence</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0 space-y-2">
                      {member.socialPresence.linkedInProfile && (
                        <div className="flex items-center">
                          <Linkedin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a 
                            href={member.socialPresence.linkedInProfile.startsWith('http') ? member.socialPresence.linkedInProfile : `https://${member.socialPresence.linkedInProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 break-all"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      
                      {member.socialPresence.personalWebsite && (
                        <div className="flex items-center">
                          <Globe className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a 
                            href={member.socialPresence.personalWebsite.startsWith('http') ? member.socialPresence.personalWebsite : `https://${member.socialPresence.personalWebsite}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 break-all"
                          >
                            Personal Website
                          </a>
                        </div>
                      )}
                      
                      {member.socialPresence.instagramProfile && (
                        <div className="flex items-center">
                          <Instagram className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a 
                            href={member.socialPresence.instagramProfile.startsWith('http') ? member.socialPresence.instagramProfile : `https://${member.socialPresence.instagramProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 break-all"
                          >
                            Instagram Profile
                          </a>
                        </div>
                      )}
                      
                      {member.socialPresence.facebookProfile && (
                        <div className="flex items-center">
                          <Facebook className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a 
                            href={member.socialPresence.facebookProfile.startsWith('http') ? member.socialPresence.facebookProfile : `https://${member.socialPresence.facebookProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 break-all"
                          >
                            Facebook Profile
                          </a>
                        </div>
                      )}
                      
                      {member.socialPresence.xProfile && (
                        <div className="flex items-center">
                          <Twitter className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                          <a 
                            href={member.socialPresence.xProfile.startsWith('http') ? member.socialPresence.xProfile : `https://${member.socialPresence.xProfile}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-500 break-all"
                          >
                            X Profile
                          </a>
                        </div>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </div>
      
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