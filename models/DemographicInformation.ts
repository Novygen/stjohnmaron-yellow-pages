// models/DemographicInformation.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IDemographicInformation extends Document {
  date_of_birth: string;
  gender?: string;
}

const DemographicInformationSchema = new Schema<IDemographicInformation>({
  date_of_birth: { type: String, required: true },
  gender: { type: String },
});

export default mongoose.models.DemographicInformation ||
  mongoose.model<IDemographicInformation>("DemographicInformation", DemographicInformationSchema);
