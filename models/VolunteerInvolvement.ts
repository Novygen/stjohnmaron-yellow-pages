// models/VolunteerInvolvement.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IVolunteerInvolvement extends Document {
  wants_to_volunteer: boolean;
  volunteer_roles: string[];
}

const VolunteerInvolvementSchema = new Schema<IVolunteerInvolvement>({
  wants_to_volunteer: { type: Boolean, required: true },
  volunteer_roles: { type: [String], default: [] },
});

export default mongoose.models.VolunteerInvolvement ||
  mongoose.model<IVolunteerInvolvement>("VolunteerInvolvement", VolunteerInvolvementSchema);
