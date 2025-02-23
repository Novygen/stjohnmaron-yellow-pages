// models/Address.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IAddress extends Document {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const AddressSchema = new Schema<IAddress>({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  country: { type: String, required: true },
});

export default mongoose.models.Address ||
  mongoose.model<IAddress>("Address", AddressSchema);
