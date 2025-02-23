// models/ProfessionalInfo.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProfessionalInfo extends Document {
  employment_status: mongoose.Types.ObjectId;
  employment_details: mongoose.Types.ObjectId;
  employment_history: mongoose.Types.ObjectId;
  business_ids: mongoose.Types.ObjectId[];
  service_provider_ids: mongoose.Types.ObjectId[];
  student_ids: mongoose.Types.ObjectId[];
}

const ProfessionalInfoSchema = new Schema<IProfessionalInfo>({
  employment_status: { type: mongoose.Schema.Types.ObjectId, ref: "EmploymentStatus", required: true },
  employment_details: { type: mongoose.Schema.Types.ObjectId, ref: "EmploymentDetails", required: true },
  employment_history: { type: mongoose.Schema.Types.ObjectId, ref: "EmploymentHistory", required: true },
  business_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Business" }],
  service_provider_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "ServiceProvider" }],
  student_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
});

export default mongoose.models.ProfessionalInfo ||
  mongoose.model<IProfessionalInfo>("ProfessionalInfo", ProfessionalInfoSchema);
