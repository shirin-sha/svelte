import dbConnect from '@/lib/database';
import Footer from '@/models/Footer';

export async function GET() {
  try {
    await dbConnect();
    const footerSections = await Footer.find({ isActive: true }).sort({ order: 1 });
    return Response.json(footerSections);
  } catch (error) {
    console.error('Error fetching footer sections:', error);
    return Response.json({ error: 'Failed to fetch footer sections' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    if (!data.section || !data.title || !data.content) {
      return Response.json({ error: 'Section, title and content are required' }, { status: 400 });
    }

    const footerSection = await Footer.create(data);
    return Response.json(footerSection, { status: 201 });
  } catch (error) {
    console.error('Error creating footer section:', error);
    return Response.json({ error: 'Failed to create footer section' }, { status: 500 });
  }
} 