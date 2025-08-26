import dbConnect from '@/lib/database';
import Brand from '@/models/Brand';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await req.json();
    
    if (!data.name || !data.logo) {
      return Response.json({ error: 'Name and logo are required' }, { status: 400 });
    }

    const brand = await Brand.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!brand) {
      return Response.json({ error: 'Brand not found' }, { status: 404 });
    }

    return Response.json(brand);
  } catch (error) {
    console.error('Error updating brand:', error);
    return Response.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const brand = await Brand.findByIdAndDelete(id);
    
    if (!brand) {
      return Response.json({ error: 'Brand not found' }, { status: 404 });
    }

    return Response.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    return Response.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
} 