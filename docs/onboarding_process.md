# Member Onboarding

This document outlines the onboarding process for new members, detailing each step and sub-step involved. It includes sequence diagrams for each form interaction, from creating an account to submitting the final form. The steps cover:

1. Basic Information
2. Church Involvement & Volunteer Interests
3. Professional & Business Information
4. Social & Online Presence
5. Community Engagement
6. Privacy, Consent & Review
7. Success & Engagement Call-to-Action

Additionally, it specifies the requirements for the onboarding process, including user account creation, welcome message display, progress tracking, and data collection for various forms.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Firebase
    participant WelcomeScreen
    participant ProgressTracker
    participant BasicInfoForm
    participant ChurchInvolvementForm
    participant ProfessionalInfoForm
    participant SocialPresenceForm
    participant AdditionalInterestsForm
    participant PrivacyConsentForm
    participant SuccessScreen

    User->>Firebase: Create Account
    Firebase-->>User: Account Created
    User->>WelcomeScreen: Login
    WelcomeScreen-->>User: Display Welcome Message
    User->>ProgressTracker: Start Onboarding
    ProgressTracker-->>User: Show Step 1
    User->>BasicInfoForm: Fill Basic Information
    BasicInfoForm-->>User: Save Basic Information
    ProgressTracker-->>User: Show Step 2
    User->>ChurchInvolvementForm: Fill Church Involvement Details
    ChurchInvolvementForm-->>User: Save Church Involvement Details
    ProgressTracker-->>User: Show Step 3
    User->>ProfessionalInfoForm: Fill Professional & Business Information
    ProfessionalInfoForm-->>User: Save Professional & Business Information
    ProgressTracker-->>User: Show Step 4
    User->>SocialPresenceForm: Fill Social & Online Presence
    SocialPresenceForm-->>User: Save Social & Online Presence
    ProgressTracker-->>User: Show Step 5
    User->>AdditionalInterestsForm: Fill Additional Interests & Community Engagement
    AdditionalInterestsForm-->>User: Save Additional Interests & Community Engagement
    ProgressTracker-->>User: Show Step 6
    User->>PrivacyConsentForm: Fill Privacy, Consent & Review
    PrivacyConsentForm-->>User: Save Privacy, Consent & Review
    ProgressTracker-->>User: Show Step 7
    User->>SuccessScreen: Submit Form
    SuccessScreen-->>User: Display Success Message & Next Steps
```

## Step 1: Basic Information

### Sub-step 1.1: Personal Details

```mermaid
sequenceDiagram
    participant User
    participant BasicInfoForm

    User->>BasicInfoForm: Enter First Name
    User->>BasicInfoForm: Enter Last Name
    User->>BasicInfoForm: Enter Middle Name (optional)
    BasicInfoForm-->>User: Save Personal Details
```

### Sub-step 1.2: Demographic Information

```mermaid
sequenceDiagram
    participant User
    participant BasicInfoForm

    User->>BasicInfoForm: Enter Date of Birth
    User->>BasicInfoForm: Select Gender (optional)
    BasicInfoForm-->>User: Save Demographic Information
```

### Sub-step 1.3: Contact Information

```mermaid
sequenceDiagram
    participant User
    participant BasicInfoForm

    User->>BasicInfoForm: Enter Primary Phone Number
    User->>BasicInfoForm: Enter Primary Email
    User->>BasicInfoForm: Enter Home Address (Street, City, State, ZIP, Country)
    BasicInfoForm-->>User: Save Contact Information
```

## Step 2: Church Involvement & Volunteer Interests

### Sub-step 2.1: Church Membership

```mermaid
sequenceDiagram
    participant User
    participant ChurchInvolvementForm

    User->>ChurchInvolvementForm: Would you like to register as a church member? (Yes/No)
    User->>ChurchInvolvementForm: How long have you been attending? (Dropdown)
    User->>ChurchInvolvementForm: Do you attend regularly? (Dropdown)
    ChurchInvolvementForm-->>User: Save Church Membership Details
```

### Sub-step 2.2: Volunteer Involvement

```mermaid
sequenceDiagram
    participant User
    participant ChurchInvolvementForm

    User->>ChurchInvolvementForm: Would you like to volunteer? (Yes/No)
    alt User selects Yes
        User->>ChurchInvolvementForm: Select Volunteer Roles Interested In
    end
    ChurchInvolvementForm-->>User: Save Ministry Involvement Details
```

## Step 3: Professional & Business Information

### Sub-step 3.1: Employment Status

```mermaid
sequenceDiagram
    participant User
    participant ProfessionalInfoForm

    User->>ProfessionalInfoForm: Select Employment Status (Tile Selection)
    ProfessionalInfoForm-->>User: Save Employment Status
```

### Sub-step 3.2: Employment Details

```mermaid
sequenceDiagram
    participant User
    participant ProfessionalInfoForm

    alt User selects Employed
        User->>ProfessionalInfoForm: Enter Company Name
        User->>ProfessionalInfoForm: Enter Job Title/Role
        User->>ProfessionalInfoForm: Select Industry (Dropdown)
        User->>ProfessionalInfoForm: Enter Years of Experience in the Field
    else User selects Business Owner or Service Provider
        User->>ProfessionalInfoForm: Enter Business Name
        User->>ProfessionalInfoForm: Select Business Type (Dropdown)
        User->>ProfessionalInfoForm: Do you have a physical store/location? (Yes/No)
        alt User selects Yes
            User->>ProfessionalInfoForm: Enter Business Address
        end
    else User selects Retired or Unemployed
        User->>ProfessionalInfoForm: Enter Previous Occupation (if applicable)
        User->>ProfessionalInfoForm: Mentorship Interest (Yes/No)
    else User selects Student
        User->>ProfessionalInfoForm: Enter School/University Name
        User->>ProfessionalInfoForm: Enter Field of Study
        User->>ProfessionalInfoForm: Enter Expected Graduation Year
    end
    ProfessionalInfoForm-->>User: Save Employment Details
```

## Step 4: Social & Online Presence

### Sub-step 4.1: Social Media Links

```mermaid
sequenceDiagram
    participant User
    participant SocialPresenceForm

    User->>SocialPresenceForm: Enter Personal Website / Blog (if applicable)
    User->>SocialPresenceForm: Enter LinkedIn Profile (optional)
    User->>SocialPresenceForm: Enter Facebook Profile (optional)
    User->>SocialPresenceForm: Enter Instagram Handle (optional)
    User->>SocialPresenceForm: Enter Other Social Media Links (optional)
    SocialPresenceForm-->>User: Save Social Media Links
```

## Step 5: Community Engagement

```mermaid
sequenceDiagram
    participant User
    participant AdditionalInterestsForm

    User->>AdditionalInterestsForm: Are you interested in networking with other parishioners? (Yes/No)
    User->>AdditionalInterestsForm: Would you like to mentor or be mentored in your professional field?
    AdditionalInterestsForm-->>User: Save Community Engagement Details
```

## Step 6: Privacy, Consent & Review

### Sub-step 6.1: Privacy Settings

```mermaid
sequenceDiagram
    participant User
    participant PrivacyConsentForm

    User->>PrivacyConsentForm: Do you want your information displayed in the church’s Yellow Pages? (Yes/No)
    alt User selects Yes
        User->>PrivacyConsentForm: Select which details should be public (Multi-select, all sensitive information (listened one by one) + Socials + Employment)
    end
    PrivacyConsentForm-->>User: Save Privacy Settings
```

### Sub-step 6.2: Review & Confirm

```mermaid
sequenceDiagram
    participant User
    participant PrivacyConsentForm

    User->>PrivacyConsentForm: Review & Confirm
    PrivacyConsentForm-->>User: Save Review & Confirmation
```

## Step 7: Success & Engagement Call-to-Action

### Sub-step 7.1: Success Message

```mermaid
sequenceDiagram
    participant User
    participant SuccessScreen

    User->>SuccessScreen: Submit Form
    SuccessScreen-->>User: Display Success Message
```

### Sub-step 7.2: Next Steps

```mermaid
sequenceDiagram
    participant User
    participant SuccessScreen

    SuccessScreen-->>User: Display Navigate to Profile
```

## Requirements

```mermaid
requirementDiagram
    requirement UserAccount {
        id: 1
        text: "User must be able to create an account"
        risk: high
        verifymethod: test
    }
    functionalRequirement WelcomeMessage {
        id: 1.1
        text: "Display a welcome message after login"
        risk: low
        verifymethod: inspection
    }
    functionalRequirement ProgressTracker {
        id: 1.2
        text: "Show progress tracker during onboarding"
        risk: medium
        verifymethod: demonstration
    }
    functionalRequirement BasicInfo {
        id: 1.2.1
        text: "Collect basic information from the user"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement ChurchInvolvement {
        id: 1.2.2
        text: "Collect church involvement and volunteer interests"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement ProfessionalInfo {
        id: 1.2.3
        text: "Collect professional and business information"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement SocialPresence {
        id: 1.2.4
        text: "Collect social and online presence information"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement AdditionalInterests {
        id: 1.2.5
        text: "Collect additional interests and community engagement"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement PrivacyConsent {
        id: 1.2.6
        text: "Collect privacy, consent, and review information"
        risk: medium
        verifymethod: analysis
    }
    functionalRequirement SuccessMessage {
        id: 1.2.7
        text: "Display success message and next steps after form submission"
        risk: medium
        verifymethod: analysis
    }

    UserAccount - traces -> WelcomeMessage
    UserAccount - contains -> ProgressTracker
    ProgressTracker - contains -> BasicInfo
    BasicInfo - contains -> ChurchInvolvement
    ChurchInvolvement - contains -> ProfessionalInfo
    ProfessionalInfo - contains -> SocialPresence
    SocialPresence - contains -> AdditionalInterests
    AdditionalInterests - contains -> PrivacyConsent
    PrivacyConsent - contains -> SuccessMessage
```

## State Management

```mermaid
stateDiagram-v2
    [*] --> AccountCreation
    AccountCreation --> WelcomeScreen: Account Created
    WelcomeScreen --> Onboarding: Login
    Onboarding --> BasicInfo: Start Onboarding
    BasicInfo --> ChurchInvolvement: Save Basic Information
    ChurchInvolvement --> ProfessionalInfo: Save Church Involvement Details
    ProfessionalInfo --> SocialPresence: Save Professional & Business Information
    SocialPresence --> AdditionalInterests: Save Social & Online Presence
    AdditionalInterests --> PrivacyConsent: Save Additional Interests & Community Engagement
    PrivacyConsent --> Review: Save Privacy, Consent & Review
    Review --> Success: Submit Form
    Success --> [*]: Display Success Message & Next Steps
```

## Object Diagram

```mermaid
classDiagram

    class Member {
        +PersonalDetails personalDetails
        +DemographicInformation demographicInformation
        +ContactInformation contactInformation
        +ChurchMembership ChurchMembership
        +VolunteerInvolvement volunteerInvolvement
        +ProfessionalInfo professionalInfo
        +SocialPresence socialPresence
        +AdditionalInterests additionalInterests
        +PrivacyConsent privacyConsent
    }

    Member --> PersonalDetails
    Member --> DemographicInformation
    Member --> ContactInformation
    Member --> ChurchMembership
    Member --> VolunteerInvolvement
    Member --> ProfessionalInfo
    Member --> SocialPresence
    Member --> AdditionalInterests
    Member --> PrivacyConsent

    class PersonalDetails {
        +String firstName
        +String lastName
        +String middleName
    }

    class DemographicInformation {
        +String dateOfBirth
        +String gender
    }

    class Address {
        +String line1
        +String line2
        +String city
        +String state
        +String zip
        +String country
    }

    class ContactInformation {
        +String primaryPhoneNumber
        +String primaryEmail
        +Address address
    }

    class ChurchMembership {
        +Boolean isRegisteredMember
        +String attendingDuration
        +String attendingFrequency
        +String[] ministriesInvolved
        +Boolean wantsToVolunteer
        +String[] volunteerRoles
    }

    class VolunteerInvolvement {
        +Boolean wantsToVolunteer
        +String[] volunteerRoles
    }

    class Business {
        +String businessName
        +String businessType
        +Boolean hasPhysicalStore
        +Address businessAddress
    }

    ContactInformation --> Address
    Business --> Address

    class ServiceProvider {
        +String serviceName
        +String[] serviceDetails
    }

    class EmploymentStatus {
        +String status
    }

    class EmploymentDetails {
        +String companyName
        +String jobTitle
        +String industry
        +int yearsOfExperience
    }

    class EmploymentHistory {
        +String previousOccupation
        +Boolean mentorshipInterest
    }

    class Student {
        +String schoolName
        +String fieldOfStudy
        +int expectedGraduationYear
    }

    class ProfessionalInfo {
        +EmploymentStatus employmentStatus
        +EmploymentDetails employmentDetails
        +EmploymentHistory employmentHistory
        +Business[] businesses
        +ServiceProvider[] services
        +Student[] educationHistory
    }

    ProfessionalInfo --> EmploymentStatus
    ProfessionalInfo --> EmploymentDetails
    ProfessionalInfo --> EmploymentHistory
    ProfessionalInfo --> Business
    ProfessionalInfo --> ServiceProvider
    ProfessionalInfo --> Student

    class SocialPresence {
        +String personalWebsite
        +String linkedInProfile
        +String facebookProfile
        +String instagramHandle
        +String[] otherSocialMediaLinks
    }

    class AdditionalInterests {
        +Boolean networkingInterest
        +String mentorshipPreference
    }

    class PrivacyConsent {
        +Boolean displayInYellowPages
        +String[] publicDetails
    }
```