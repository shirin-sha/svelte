import dbConnect from '@/lib/database';
import Contact from '@/models/Contact';

export async function GET() {
  try {
    await dbConnect();
    let contact = await Contact.findOne({});
    
    // If no contact settings exist, create default ones
    if (!contact) {
      contact = await Contact.create({
        address: "254, North City, Bulex Center, New York",
        phone: "09 (354) 587 874",
        email: "info@example.com",
        secondaryPhone: "10 (698) 852 741",
        secondaryEmail: "info@example.com",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4562.753041141002!2d-118.80123790098536!3d34.152323469614075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82469c2162619%3A0xba03efb7998eef6d!2sCostco+Wholesale!5e0!3m2!1sbn!2sbd!4v1562518641290!5m2!1sbn!2sbd"
      });
    }
    
    return Response.json(contact);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return Response.json({ error: 'Failed to fetch contact settings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    // Check if contact settings already exist
    let contact = await Contact.findOne({});
    
    if (contact) {
      // Update existing contact settings
      contact = await Contact.findByIdAndUpdate(
        contact._id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
    } else {
      // Create new contact settings
      contact = await Contact.create({ ...data, updatedAt: new Date() });
    }
    
    return Response.json(contact, { status: 201 });
  } catch (error) {
    console.error('Error saving contact settings:', error);
    return Response.json({ error: 'Failed to save contact settings' }, { status: 500 });
  }
} 