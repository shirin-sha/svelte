import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  topText: { type: String }, // Dynamic text above the banner
  // Primary CTA button
  primaryText: { type: String },
  primaryUrl: { type: String },
  // Secondary (play) button
  secondaryText: { type: String },
  secondaryVideoId: { type: String }, // e.g., YouTube video ID
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema); 