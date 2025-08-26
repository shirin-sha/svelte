import mongoose from 'mongoose';

const footerSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['company', 'services', 'contact', 'social']
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  links: [{
    text: String,
    url: String
  }],
  contactInfo: {
    address: String,
    phone: String,
    email: String
  },
  socialLinks: [{
    platform: String,
    url: String,
    icon: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Footer || mongoose.model('Footer', footerSchema); 