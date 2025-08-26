import dbConnect from '@/lib/database';
import Blog from '@/models/Blog';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return Response.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return Response.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const updateData = await req.json();
    
    const blog = await Blog.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    
    if (!blog) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return Response.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return Response.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const blog = await Blog.findByIdAndDelete(id);
    
    if (!blog) {
      return Response.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return Response.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
} 