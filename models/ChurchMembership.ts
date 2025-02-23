// models/ChurchMembership.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IChurchMembership extends Document {
  is_registered_member: boolean;
  attending_duration: string;
  attending_frequency: string;
  ministries_involved: string[];
  wants_to_volunteer: boolean;
  volunteer_roles: string[];
}

const ChurchMembershipSchema = new Schema<IChurchMembership>({
  is_registered_member: { type: Boolean, required: true },
  attending_duration: { type: String, required: true },
  attending_frequency: { type: String, required: true },
  ministries_involved: { type: [String], default: [] },
  wants_to_volunteer: { type: Boolean, required: true },
  volunteer_roles: { type: [String], default: [] },
});

export default mongoose.models.ChurchMembership ||
  mongoose.model<IChurchMembership>("ChurchMembership", ChurchMembershipSchema);
