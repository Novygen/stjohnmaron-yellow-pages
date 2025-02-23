// models/ContactInformation.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IContactInformation extends Document {
  primary_phone_number: string;
  primary_email: string;
  address: mongoose.Types.ObjectId;
}

const ContactInformationSchema = new Schema<IContactInformation>({
  primary_phone_number: { type: String, required: true },
  primary_email: { type: String, required: true },
  address: { type: Schema.Types.ObjectId, ref: "Address", required: true },
});

export default mongoose.models.ContactInformation ||
  mongoose.model<IContactInformation>("ContactInformation", ContactInformationSchema);
