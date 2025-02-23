// models/MemberMetaData.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMemberMetaData extends Document {
  is_public: boolean;
  is_approved: boolean;
}

const MemberMetaDataSchema = new Schema<IMemberMetaData>(
  {
    is_public: { type: Boolean, default: false },
    is_approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.MemberMetaData ||
  mongoose.model<IMemberMetaData>("MemberMetaData", MemberMetaDataSchema);
