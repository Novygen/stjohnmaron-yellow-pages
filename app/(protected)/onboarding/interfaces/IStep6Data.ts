// app/(protected)/onboarding/interfaces/IStep6Data.ts

export interface IPrivacyConsent {
    display_in_yellow_pages: boolean;
    public_details: string[]; // e.g. ["ContactInformation", "Employment", ...]
  }
  
  export interface IStep6Data {
    privacyConsent: IPrivacyConsent;
  }
  