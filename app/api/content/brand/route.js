import dbConnect from '@/lib/database';
import Brand from '@/models/Brand';

export async function GET() {
  try {
    await dbConnect();
    const brands = await Brand.find({ isActive: true }).sort({ order: 1 });
    return Response.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return Response.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    if (!data.name || !data.logo) {
      return Response.json({ error: 'Name and logo are required' }, { status: 400 });
    }

    const brand = await Brand.create(data);
    return Response.json(brand, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return Response.json({ error: 'Failed to create brand' }, { status: 500 });
  }
} 