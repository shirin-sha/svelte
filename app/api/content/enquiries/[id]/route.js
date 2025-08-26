import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Enquiry from '@/models/Enquiry';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const { status } = await req.json();
    
    const enquiry = await Enquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!enquiry) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json(enquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
} 