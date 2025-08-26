import dbConnect from '@/lib/database';
import Footer from '@/models/Footer';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await req.json();
    
    if (!data.section || !data.title || !data.content) {
      return Response.json({ error: 'Section, title and content are required' }, { status: 400 });
    }

    const footerSection = await Footer.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!footerSection) {
      return Response.json({ error: 'Footer section not found' }, { status: 404 });
    }

    return Response.json(footerSection);
  } catch (error) {
    console.error('Error updating footer section:', error);
    return Response.json({ error: 'Failed to update footer section' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const footerSection = await Footer.findByIdAndDelete(id);
    
    if (!footerSection) {
      return Response.json({ error: 'Footer section not found' }, { status: 404 });
    }

    return Response.json({ message: 'Footer section deleted successfully' });
  } catch (error) {
    console.error('Error deleting footer section:', error);
    return Response.json({ error: 'Failed to delete footer section' }, { status: 500 });
  }
} 