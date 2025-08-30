import { NextResponse } from 'next/server';
import dbConnect from '@/lib/database';
import Page from '@/models/Page';

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    
    // Get home page sections
    let homePage = await Page.findOne({ slug: 'home' }).lean();
    
    if (!homePage) {
      // Create home page if it doesn't exist
      homePage = new Page({
        name: 'Home',
        slug: 'home',
        metaTitle: { en: 'Home' },
        metaDescription: { en: 'Home page' },
        sections: [
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
        ],
        isActive: true
      });
      await homePage.save();
      homePage = homePage.toObject();
    }

    // If section parameter is provided, filter by section name
    if (section) {
      const filteredSections = homePage.sections.filter(s => s.name === section);
      return NextResponse.json(filteredSections);
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

    // Find or create home page
    let homePage = await Page.findOne({ slug: 'home' });
    
    if (!homePage) {
      homePage = new Page({
        name: 'Home',
        slug: 'home',
        metaTitle: { en: 'Home' },
        metaDescription: { en: 'Home page' },
        sections: []
      });
    }

    // Check if section already exists
    const existingSectionIndex = homePage.sections.findIndex(s => s.name === sectionData.name);
    
    if (existingSectionIndex !== -1) {
      // Update existing section
      homePage.sections[existingSectionIndex] = {
        ...homePage.sections[existingSectionIndex],
        ...sectionData
      };
    } else {
      // Add new section
      homePage.sections.push(sectionData);
    }

    await homePage.save();

    return NextResponse.json({ 
      success: true, 
      message: `Section ${sectionData.name} ${existingSectionIndex !== -1 ? 'updated' : 'created'} successfully` 
    });
  } catch (error) {
    console.error('Error saving section:', error);
    return NextResponse.json(
      { error: 'Failed to save section' },
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