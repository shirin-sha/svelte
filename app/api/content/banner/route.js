import  dbConnect  from '@/lib/database';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    return Response.json(banners);
  } catch (error) {
    console.error('Error fetching banners:', error);
    return Response.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { title, subtitle, imageUrl, topText, primaryText, primaryUrl, secondaryText, secondaryVideoId } = await req.json();
    
    if ( !imageUrl) {
      return Response.json({ error: 'Image is required' }, { status: 400 });
    }
    if ( !title) {
      return Response.json({ error: 'Title is required' }, { status: 400 });
    }
    if ( !subtitle) {
      return Response.json({ error: 'Subtitle is required' }, { status: 400 });
    }
    

    const banner = await Banner.create({
      title,
      subtitle,
      imageUrl,
      topText,
      primaryText,
      primaryUrl,
      secondaryText,
      secondaryVideoId
    });

    return Response.json(banner, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return Response.json({ error: 'Failed to create banner' }, { status: 500 });
  }
} 