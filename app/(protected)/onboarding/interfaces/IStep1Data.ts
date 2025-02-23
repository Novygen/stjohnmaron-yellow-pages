// app/(protected)/onboarding/interfaces/IStep1Data.ts

export interface IPersonalDetails {
    first_name: string;
    last_name: string;
    middle_name?: string;
  }
  
  export interface IDemographicInformation {
    date_of_birth: string;
    gender?: string;
  }
  
  export interface IAddress {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  }
  
  export interface IContactInformation {
    primary_phone_number: string;
    primary_email: string;
    address: IAddress;
  }
  
  /**
   * Step1Data aggregates Basic Info fields:
   * - PersonalDetails
   * - DemographicInformation
   * - ContactInformation
   */
  export interface IStep1Data {
    personalDetails: IPersonalDetails;
    demographicInformation: IDemographicInformation;
    contactInformation: IContactInformation;
  }
  