import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Team from '@/models/Team';

export async function GET() {
  try {
    await dbConnect();
    
    const team = await Team.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .limit(10);
    
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('Error fetching team:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const team = new Team(body);
    await team.save();
    
    return NextResponse.json({ success: true, data: team });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create team member' },
      { status: 500 }
    );
  }
} 