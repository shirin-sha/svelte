import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  // Contact Information
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  secondaryPhone: { type: String },
  secondaryEmail: { type: String },
  
  // Contact Form Settings
  formTitle: { type: String, default: "Let's Get in Touch" },
  formSubtitle: { type: String, default: "Your email address will not be published. Required fields are marked *" },
  
  // Google Maps
  mapUrl: { type: String, required: true },
  
  // Page Content
  pageTitle: { type: String, default: "Get in Touch" },
  pageDescription: { type: String, default: "A vast majority of the app marketers mainly concent post-launch app marketing techniques and measures while completely missing pre-launch campaign." },
  
  // Form Fields Configuration
  showNameField: { type: Boolean, default: true },
  showEmailField: { type: Boolean, default: true },
  showPhoneField: { type: Boolean, default: true },
  showSubjectField: { type: Boolean, default: true },
  showMessageField: { type: Boolean, default: true },
  
  // Field Labels
  nameLabel: { type: String, default: "Your Name*" },
  emailLabel: { type: String, default: "Your Email*" },
  phoneLabel: { type: String, default: "Phone*" },
  subjectLabel: { type: String, default: "Subject*" },
  messageLabel: { type: String, default: "Write Message*" },
  submitButtonText: { type: String, default: "SEND MESSAGE" },
  
  // Form Submissions
  submissions: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema); 