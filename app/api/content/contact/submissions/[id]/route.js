import dbConnect from '@/lib/database';
import Contact from '@/models/Contact';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();
    
    const contact = await Contact.findOne({});
    if (!contact) {
      return Response.json({ error: 'Contact settings not found' }, { status: 404 });
    }
    
    // Update the specific submission status
    if (contact.submissions[id]) {
      contact.submissions[id].status = status;
      await contact.save();
      return Response.json({ success: true });
    } else {
      return Response.json({ error: 'Submission not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating submission status:', error);
    return Response.json({ error: 'Failed to update submission status' }, { status: 500 });
  }
} 