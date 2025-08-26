import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id, section } = params;
    const { isActive } = await req.json();

    const page = await Page.findById(id);
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const target = page.sections.find(s => s.name === section);
    if (!target) return NextResponse.json({ error: 'Section not found' }, { status: 404 });

    target.isActive = !!isActive;
    await page.save();

    return NextResponse.json({ success: true, section: target });
  } catch (error) {
    console.error('Error toggling section:', error);
    return NextResponse.json({ error: 'Failed to toggle section' }, { status: 500 });
  }
} 