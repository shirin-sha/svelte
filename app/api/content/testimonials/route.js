import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await dbConnect();
    
    const testimonials = await Testimonial.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(10);
    
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const testimonial = new Testimonial(body);
    await testimonial.save();
    
    return NextResponse.json({ success: true, data: testimonial });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
} 