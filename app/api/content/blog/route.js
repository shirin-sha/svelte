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
    const { title, content, category, imageUrl, publishedAt } = await req.json();
    
    if (!title || !content || !category || !imageUrl || !publishedAt) {
      return Response.json({ error: 'Title, content, category, image, and date are required' }, { status: 400 });
    }

    const parsedDate = new Date(publishedAt);
    if (Number.isNaN(parsedDate.getTime())) {
      return Response.json({ error: 'Invalid published date' }, { status: 400 });
    }

    const blogData = {
      title,
      content,
      imageUrl,
      category,
      publishedAt: parsedDate
    };

    const blog = await Blog.create(blogData);
    return Response.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return Response.json({ error: 'Failed to create blog' }, { status: 500 });
  }
} 