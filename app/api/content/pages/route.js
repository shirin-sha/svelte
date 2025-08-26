import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET() {
  try {
    await dbConnect();
    
    const pages = await Page.find({ isActive: true })
      .sort({ createdAt: -1 });

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { name, slug, metaTitle, metaDescription, sections } = await req.json();
    
    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const page = await Page.create({
      name,
      slug,
      metaTitle,
      metaDescription,
      sections: sections || []
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
} 