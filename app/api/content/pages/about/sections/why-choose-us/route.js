import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET() {
  try {
    await dbConnect();
    
    // Get about page sections
    let aboutPage = await Page.findOne({ slug: 'about' }).lean();
    
    if (!aboutPage) {
      // Create about page if it doesn't exist
      aboutPage = new Page({
        name: 'About',
        slug: 'about',
        metaTitle: { en: 'About' },
        metaDescription: { en: 'About page' },
        sections: [
          { name: 'about-section', title: { en: 'About Section' }, isActive: true, order: 1, type: 'about' },
          { name: 'call-to-action', title: { en: 'Call to Action' }, isActive: true, order: 2, type: 'action' },
          { name: 'why-choose-us', title: { en: 'Why Choose Us' }, isActive: true, order: 3, type: 'why-choose-us' }
        ],
        isActive: true
      });
      await aboutPage.save();
      aboutPage = aboutPage.toObject();
    }

    // Filter by section name
    const filteredSections = aboutPage.sections.filter(s => s.name === 'why-choose-us');
    return NextResponse.json(filteredSections);
  } catch (error) {
    console.error('Error fetching why choose us section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch why choose us section' },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const sectionData = await req.json();

    if (!sectionData.name) {
      return NextResponse.json(
        { error: 'Section name is required' },
        { status: 400 }
      );
    }

    // Find or create about page
    let aboutPage = await Page.findOne({ slug: 'about' });
    
    if (!aboutPage) {
      aboutPage = new Page({
        name: 'About',
        slug: 'about',
        metaTitle: { en: 'About' },
        metaDescription: { en: 'About page' },
        sections: []
      });
    }

    // Check if section already exists
    const existingSectionIndex = aboutPage.sections.findIndex(s => s.name === sectionData.name);
    
    if (existingSectionIndex !== -1) {
      // Update existing section
      aboutPage.sections[existingSectionIndex] = {
        ...aboutPage.sections[existingSectionIndex],
        ...sectionData
      };
    } else {
      // Add new section
      aboutPage.sections.push(sectionData);
    }

    await aboutPage.save();

    return NextResponse.json({ 
      success: true, 
      message: `Section ${sectionData.name} ${existingSectionIndex !== -1 ? 'updated' : 'created'} successfully` 
    });
  } catch (error) {
    console.error('Error saving why choose us section:', error);
    return NextResponse.json(
      { error: 'Failed to save why choose us section' },
      { status: 500 }
    );
  }
} 