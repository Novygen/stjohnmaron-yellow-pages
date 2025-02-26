// models/Specialization.ts
import { Schema, model, models } from 'mongoose';

const SpecializationSchema = new Schema(
  {
    name: { type: String, required: true },
    industry: { type: Schema.Types.ObjectId, ref: 'Industry', required: true },
  },
  { timestamps: true },
);

export const Specialization =
  models.Specialization || model('Specialization', SpecializationSchema);
