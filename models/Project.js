import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  images: [{
    url: String,
    alt: String,
    size: {
      width: Number,
      height: Number
    }
  }],
  mainImage: {
    type: String,
    required: true
  },
  client: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  completionDate: {
    type: Date
  },
  technologies: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['completed', 'ongoing', 'planned'],
    default: 'completed'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema); 