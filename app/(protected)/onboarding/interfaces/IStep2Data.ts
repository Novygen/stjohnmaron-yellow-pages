// app/(protected)/onboarding/interfaces/IStep2Data.ts

export interface IChurchMembership {
    is_registered_member: boolean;
    attending_duration: string;       // e.g. "2 years"
    attending_frequency: string;      // e.g. "Weekly"
    ministries_involved: string[];    // e.g. ["Choir", "Youth"]
    wants_to_volunteer: boolean;
    volunteer_roles: string[];        // e.g. ["Usher", "Teaching"]
  }
  
  export interface IVolunteerInvolvement {
    wants_to_volunteer: boolean;
    volunteer_roles: string[];
  }
  
  export interface IStep2Data {
    churchMembership: IChurchMembership;
    volunteerInvolvement: IVolunteerInvolvement;
  }
  