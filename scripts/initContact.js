import dbConnect from '../lib/database.js';
import Contact from '../models/Contact.js';

async function initContact() {
  try {
    await dbConnect();
    
    // Check if contact data already exists
    const existingContact = await Contact.findOne({});
    
    if (!existingContact) {
      // Create default contact data
      const defaultContact = await Contact.create({
        address: "254, North City, Bulex Center, New York",
        phone: "09 (354) 587 874",
        email: "info@example.com",
        secondaryPhone: "10 (698) 852 741",
        secondaryEmail: "info@example.com",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4562.753041141002!2d-118.80123790098536!3d34.152323469614075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82469c2162619%3A0xba03efb7998eef6d!2sCostco+Wholesale!5e0!3m2!1sbn!2sbd!4v1562518641290!5m2!1sbn!2sbd",
        pageTitle: "Get in Touch",
        pageDescription: "A vast majority of the app marketers mainly concent post-launch app marketing techniques and measures while completely missing pre-launch campaign. This prevents the",
        formTitle: "Let's Get in Touch",
        formSubtitle: "Your email address will not be published. Required fields are marked *",
        showNameField: true,
        showEmailField: true,
        showPhoneField: true,
        showSubjectField: true,
        showMessageField: true,
        nameLabel: "Your Name*",
        emailLabel: "Your Email*",
        phoneLabel: "Phone*",
        subjectLabel: "Subject*",
        messageLabel: "Write Message*",
        submitButtonText: "SEND MESSAGE"
      });
      
      console.log('✅ Contact data initialized successfully!');
      console.log('📞 Contact ID:', defaultContact._id);
    } else {
      console.log('ℹ️ Contact data already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing contact data:', error);
    process.exit(1);
  }
}

initContact(); 