import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Enquiry from '@/models/Enquiry';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error marking enquiry as read:', error);
    return NextResponse.json(
      { error: 'Failed to mark enquiry as read' },
      { status: 500 }
    );
  }
} 