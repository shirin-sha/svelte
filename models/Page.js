import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  metaTitle: {
    en: { type: String, required: true },
    ar: { type: String, default: '' }
  },
  metaDescription: {
    en: { type: String, required: true },
    ar: { type: String, default: '' }
  },
  sections: [{
    name: {
      type: String,
      required: true
    },
    title: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' }
    },
    subtitle: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' }
    },
    content: {
      en: { type: String, default: '' },
      ar: { type: String, default: '' }
    },
    image: {
      type: String,
      default: ''
    },
    backgroundImage: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: ''
    },
    buttonLink: {
      type: String,
      default: ''
    },
    features: [{
      icon: { type: String, default: '' },
      title: { type: String, default: '' },
      description: { type: String, default: '' }
    }],
    leftImage1: {
      type: String,
      default: ''
    },
    leftImage2: {
      type: String,
      default: ''
    },
    shapeImage: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
    },
    order: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ['text', 'image', 'hero', 'about', 'services', 'counter', 'contact', 'action', 'why-choose-us', 'banner', 'features', 'projects', 'brand', 'blog'],
      default: 'text'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Page || mongoose.model('Page', pageSchema); 