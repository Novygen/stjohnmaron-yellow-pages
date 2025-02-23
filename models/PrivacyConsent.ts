// models/PrivacyConsent.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPrivacyConsent extends Document {
  display_in_yellow_pages: boolean;
  public_details: string[];
}

const PrivacyConsentSchema = new Schema<IPrivacyConsent>({
  display_in_yellow_pages: { type: Boolean, required: true },
  public_details: { type: [String], default: [] },
});

export default mongoose.models.PrivacyConsent ||
  mongoose.model<IPrivacyConsent>("PrivacyConsent", PrivacyConsentSchema);
