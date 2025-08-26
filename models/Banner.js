import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  imageUrl: { type: String, required: true },
  topText: { type: String }, // Dynamic text above the banner
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema); 