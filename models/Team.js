import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  image: { type: String, required: true },
  bio: { type: String },
  experience: { type: String },
  education: { type: String },
  skills: [String],
  socialLinks: {
    linkedin: String,
    instagram: String,
    facebook: String,
    twitter: String,
    website: String
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema); 