import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  icon: { type: String, required: true },
  imageUrl: { type: String, required: true },
  content: { type: String, required: true },
  features: [{ type: String }],
  benefits: [{ type: String }],
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema); 