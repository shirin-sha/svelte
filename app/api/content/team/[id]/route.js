import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Team from '@/models/Team';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const team = await Team.findById(id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team member' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();
    
    const team = await Team.findByIdAndUpdate(
      id,
      { ...body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const team = await Team.findByIdAndDelete(id);
    if (!team) {
      return NextResponse.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
} 