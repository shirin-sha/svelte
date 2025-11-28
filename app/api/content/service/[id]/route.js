import dbConnect from '@/lib/database';
import Service from '@/models/Service';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const service = await Service.findById(id);
    
    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    return Response.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await req.json();
    
    if (!updateData.title || !updateData.shortDescription || !updateData.icon || !updateData.imageUrl || !updateData.content) {
      return Response.json({ error: 'Title, short description, icon, image, and content are required' }, { status: 400 });
    }

    const service = await Service.findByIdAndUpdate(
      id,
      { ...updateData, description: updateData.description || '', updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return Response.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const service = await Service.findByIdAndDelete(id);
    
    if (!service) {
      return Response.json({ error: 'Service not found' }, { status: 404 });
    }

    return Response.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return Response.json({ error: 'Failed to delete service' }, { status: 500 });
  }
} 