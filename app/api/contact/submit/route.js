import dbConnect from '@/lib/database';
import Contact from '@/models/Contact';

export async function POST(req) {
  try {
    await dbConnect();
    const { name, email, phone, subject, message } = await req.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }
    
    // Get contact settings
    let contact = await Contact.findOne({});
    
    if (!contact) {
      // Create default contact settings if none exist
      contact = await Contact.create({
        address: "254, North City, Bulex Center, New York",
        phone: "09 (354) 587 874",
        email: "info@example.com",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4562.753041141002!2d-118.80123790098536!3d34.152323469614075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82469c2162619%3A0xba03efb7998eef6d!2sCostco+Wholesale!5e0!3m2!1sbn!2sbd!4v1562518641290!5m2!1sbn!2sbd"
      });
    }
    
    // Add submission to the contact settings
    contact.submissions.push({
      name,
      email,
      phone: phone || '',
      subject: subject || '',
      message,
      submittedAt: new Date(),
      status: 'new'
    });
    
    await contact.save();
    
    return Response.json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return Response.json({ error: 'Failed to submit form. Please try again.' }, { status: 500 });
  }
} 