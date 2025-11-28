import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  publishedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Blog || mongoose.model('Blog', blogSchema); 