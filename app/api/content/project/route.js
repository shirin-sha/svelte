import dbConnect from '@/lib/database';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({ isActive: true }).sort({ order: 1 });
    return Response.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const data = await req.json();
    
    if (!data.title || !data.shortDescription || !data.longDescription || !data.category || !data.mainImage) {
      return Response.json({ error: 'Title, descriptions, category and main image are required' }, { status: 400 });
    }

    const project = await Project.create(data);
    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return Response.json({ error: 'Failed to create project' }, { status: 500 });
  }
} 