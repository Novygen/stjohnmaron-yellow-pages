// models/Member.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMember extends Document {
  personal_details?: mongoose.Types.ObjectId;
  demographic_information?: mongoose.Types.ObjectId;
  contact_information: mongoose.Types.ObjectId;
  church_membership?: mongoose.Types.ObjectId;
  volunteer_involvement?: mongoose.Types.ObjectId;
  professional_info?: mongoose.Types.ObjectId;
  social_presence?: mongoose.Types.ObjectId;
  additional_interests?: mongoose.Types.ObjectId;
  privacy_consent?: mongoose.Types.ObjectId;
  member_meta_data: mongoose.Types.ObjectId;
}

const MemberSchema = new Schema<IMember>({
  personal_details: { type: mongoose.Schema.Types.ObjectId, ref: "PersonalDetails" },
  demographic_information: { type: mongoose.Schema.Types.ObjectId, ref: "DemographicInformation" },
  contact_information: { type: mongoose.Schema.Types.ObjectId, ref: "ContactInformation", required: true },
  church_membership: { type: mongoose.Schema.Types.ObjectId, ref: "ChurchMembership" },
  volunteer_involvement: { type: mongoose.Schema.Types.ObjectId, ref: "VolunteerInvolvement" },
  professional_info: { type: mongoose.Schema.Types.ObjectId, ref: "ProfessionalInfo" },
  social_presence: { type: mongoose.Schema.Types.ObjectId, ref: "SocialPresence" },
  additional_interests: { type: mongoose.Schema.Types.ObjectId, ref: "AdditionalInterests" },
  privacy_consent: { type: mongoose.Schema.Types.ObjectId, ref: "PrivacyConsent" },
  member_meta_data: { type: mongoose.Schema.Types.ObjectId, ref: "MemberMetaData", required: true },
});

export default mongoose.models.Member ||
  mongoose.model<IMember>("Member", MemberSchema);
