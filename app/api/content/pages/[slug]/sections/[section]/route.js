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

    return NextResponse.json({
      name: target.name,
      type: target.type,
      isActive: target.isActive,
      order: target.order,
      title: target.title,
      subtitle: target.subtitle,
      description: target.description,
      content: target.content
    });
  } catch (error) {
    console.error('Error fetching section:', error);
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

const prettifySlug = (slug) => {
  if (!slug) return 'Page'
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Page'
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { slug, section } = params;
    const body = await req.json();

    let page = await Page.findOne({ slug });
    if (!page) {
      const prettyName = prettifySlug(slug);
      page = new Page({
        name: prettyName,
        slug,
        metaTitle: { en: `${prettyName}`, ar: '' },
        metaDescription: { en: `Content for ${prettyName}`, ar: '' },
        sections: []
      });
    }

    const idx = page.sections.findIndex(s => s.name === section);
    if (idx === -1) {
      // Create the section if it does not exist
      const newSection = {
        name: section,
        type: body?.type || 'text',
        isActive: true,
        order: (page.sections?.length || 0) + 1,
        title: body?.title || { en: '' },
        subtitle: body?.subtitle || { en: '' },
        description: body?.description || { en: '' },
        content: body?.content || { en: '' },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      page.sections.push(newSection);
      page.markModified('sections');
      await page.save();
      return NextResponse.json(newSection);
    }

    const current = typeof page.sections[idx].toObject === 'function'
      ? page.sections[idx].toObject()
      : page.sections[idx];

    const updatedSection = { ...current, ...body, updatedAt: new Date() };
    page.sections[idx] = updatedSection;
    page.markModified('sections');
    await page.save();

    return NextResponse.json(updatedSection);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
} 