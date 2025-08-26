import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Service from '@/models/Service';

export async function GET() {
  try {
    await dbConnect();
    
    const services = await Service.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title shortDescription icon imageUrl');

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching latest services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
} 