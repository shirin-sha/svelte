import dbConnect from '@/lib/database';
import Blog from '@/models/Blog';

export async function GET() {
  try {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return Response.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { title, content, excerpt, author, imageUrl, tags, status, category, featured } = await req.json();
    
    if (!title || !content || !author || !imageUrl) {
      return Response.json({ error: 'Title, content, author, and image are required' }, { status: 400 });
    }

    const blogData = {
      title,
      content,
      excerpt,
      author,
      imageUrl,
      category: category || 'Development',
      tags: tags || [],
      status: status || 'draft',
      featured: featured || false
    };

    if (status === 'published') {
      blogData.publishedAt = new Date();
    }

    const blog = await Blog.create(blogData);
    return Response.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
} 