import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { slug } = params;
    const page = await Page.findOne({ slug });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { slug } = params;
    const body = await req.json();

    const page = await Page.findOneAndUpdate({ slug }, { ...body, updatedAt: new Date() }, { new: true });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
} 