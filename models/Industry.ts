// models/Industry.ts
import { Schema, model, models } from 'mongoose';

const IndustrySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export const Industry = models.Industry || model('Industry', IndustrySchema);
