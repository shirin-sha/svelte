import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Enquiry from '@/models/Enquiry';

export async function GET() {
  try {
    await dbConnect();
    
    const enquiries = await Enquiry.find()
      .sort({ createdAt: -1 });

    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
} 