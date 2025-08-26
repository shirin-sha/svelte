import dbConnect from '@/lib/database';
import Banner from '@/models/Banner';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { title, subtitle, imageUrl, topText } = await req.json();
    
    if (!imageUrl) {
      return Response.json({ error: 'Image is required' }, { status: 400 });
    }
    if (!title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!subtitle) {
      return Response.json({ error: 'Subtitle is required' }, { status: 400 });
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        title,
        subtitle,
        imageUrl,
        topText,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!banner) {
      return Response.json({ error: 'Banner not found' }, { status: 404 });
    }

    return Response.json(banner);
  } catch (error) {
    console.error('Error updating banner:', error);
    return Response.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const banner = await Banner.findByIdAndDelete(id);
    
    if (!banner) {
      return Response.json({ error: 'Banner not found' }, { status: 404 });
    }

    return Response.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return Response.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
} 