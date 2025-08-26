import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET() {
  try {
    await dbConnect();
    
    // Get home page sections
    const homePage = await Page.findOne({ slug: 'home' }).lean();
    
    if (!homePage) {
      // Return default sections if no home page exists
      const defaultSections = [
        { name: 'header', title: { en: 'Header' }, isActive: true },
        { name: 'banner', title: { en: 'Banner' }, isActive: true },
        { name: 'features', title: { en: 'Features' }, isActive: true },
        { name: 'about', title: { en: 'About' }, isActive: true },
        { name: 'services', title: { en: 'Services' }, isActive: true },
        { name: 'projects', title: { en: 'Projects' }, isActive: true },
        { name: 'contact', title: { en: 'Contact' }, isActive: true },
        { name: 'brand', title: { en: 'Brand' }, isActive: true },
        { name: 'why-choose-us', title: { en: 'Why Choose Us' }, isActive: true },
        { name: 'action', title: { en: 'Call to Action' }, isActive: true },
        { name: 'blog', title: { en: 'Blog' }, isActive: true }
      ];
      return NextResponse.json(defaultSections);
    }

    return NextResponse.json(homePage.sections || []);
  } catch (error) {
    console.error('Error fetching home sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch home sections' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const { sectionName, isActive } = await req.json();

    if (!sectionName || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'Section name and isActive status are required' },
        { status: 400 }
      );
    }

    // Find and update the home page section
    const result = await Page.updateOne(
      { slug: 'home', 'sections.name': sectionName },
      { $set: { 'sections.$.isActive': isActive } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Section ${sectionName} ${isActive ? 'enabled' : 'disabled'}` 
    });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
} 