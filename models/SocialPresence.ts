// models/SocialPresence.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ISocialPresence extends Document {
  personal_website?: string;
  linked_in_profile?: string;
  facebook_profile?: string;
  instagram_handle?: string;
  other_social_media_links: string[];
}

const SocialPresenceSchema = new Schema<ISocialPresence>({
  personal_website: { type: String },
  linked_in_profile: { type: String },
  facebook_profile: { type: String },
  instagram_handle: { type: String },
  other_social_media_links: { type: [String], default: [] },
});

export default mongoose.models.SocialPresence ||
  mongoose.model<ISocialPresence>("SocialPresence", SocialPresenceSchema);
