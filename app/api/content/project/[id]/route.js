import dbConnect from '@/lib/database';
import Project from '@/models/Project';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const data = await req.json();
    
    if (!data.title || !data.shortDescription || !data.longDescription || !data.category || !data.mainImage) {
      return Response.json({ error: 'Title, descriptions, category and main image are required' }, { status: 400 });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return Response.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return Response.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 