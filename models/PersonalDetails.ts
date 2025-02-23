// models/PersonalDetails.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPersonalDetails extends Document {
  first_name: string;
  last_name: string;
  middle_name?: string;
}

const PersonalDetailsSchema = new Schema<IPersonalDetails>({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  middle_name: { type: String },
});

export default mongoose.models.PersonalDetails ||
  mongoose.model<IPersonalDetails>("PersonalDetails", PersonalDetailsSchema);
