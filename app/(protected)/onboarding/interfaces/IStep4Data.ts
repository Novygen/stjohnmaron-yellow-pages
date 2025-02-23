// app/(protected)/onboarding/interfaces/IStep4Data.ts

export interface ISocialPresence {
    personal_website?: string;
    linked_in_profile?: string;
    facebook_profile?: string;
    instagram_handle?: string;
    other_social_media_links: string[];
  }
  
  export interface IStep4Data {
    socialPresence: ISocialPresence;
  }
  