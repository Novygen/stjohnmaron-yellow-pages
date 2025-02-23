// models/AdditionalInterests.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAdditionalInterests extends Document {
  networking_interest: boolean;
  mentorship_preference: string;
}

const AdditionalInterestsSchema = new Schema<IAdditionalInterests>({
  networking_interest: { type: Boolean, required: true },
  mentorship_preference: { type: String, required: true },
});

export default mongoose.models.AdditionalInterests ||
  mongoose.model<IAdditionalInterests>("AdditionalInterests", AdditionalInterestsSchema);
