import  dbConnect  from '@/lib/database';
import Service from '@/models/Service';

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({}).sort({ createdAt: -1 });
    return Response.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { title, description, shortDescription, icon, imageUrl, content, features, benefits, featured } = await req.json();
    
    if (!title || !description || !shortDescription || !icon || !imageUrl || !content) {
      return Response.json({ error: 'Title, description, short description, icon, image, and content are required' }, { status: 400 });
    }

    const serviceData = {
      title,
      description,
      shortDescription,
      icon,
      imageUrl,
      content,
      features: features || [],
      benefits: benefits || [],
      featured: featured || false
    };

    const service = await Service.create(serviceData);
    return Response.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return Response.json({ error: 'Failed to create service' }, { status: 500 });
  }
} 