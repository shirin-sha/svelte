import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { slug, section } = params;
    const page = await Page.findOne({ slug });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const target = page.sections.find(s => s.name === section);
    if (!target) return NextResponse.json({ error: 'Section not found' }, { status: 404 });

    return NextResponse.json(target);
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { slug, section } = params;
    const body = await req.json();

    const page = await Page.findOne({ slug });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const idx = page.sections.findIndex(s => s.name === section);
    if (idx === -1) return NextResponse.json({ error: 'Section not found' }, { status: 404 });

    page.sections[idx] = { ...page.sections[idx]._doc, ...body, updatedAt: new Date() };
    await page.save();

    return NextResponse.json(page.sections[idx]);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
} 