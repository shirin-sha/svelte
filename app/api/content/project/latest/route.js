import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Project from '@/models/Project';

export async function GET() {
  try {
    await dbConnect();
    
    const projects = await Project.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title shortDescription mainImage location category');

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching latest projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
} 