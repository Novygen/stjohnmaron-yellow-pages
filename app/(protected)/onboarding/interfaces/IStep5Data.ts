// app/(protected)/onboarding/interfaces/IStep5Data.ts

export interface IAdditionalInterests {
    networking_interest: boolean;
    mentorship_preference: string; // e.g. "mentor", "mentee", "both"
  }
  
  export interface IStep5Data {
    additionalInterests: IAdditionalInterests;
  }
  