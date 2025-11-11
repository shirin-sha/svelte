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
          { name: 'testimonials', title: { en: 'Testimonials' }, subtitle: { en: 'OUR CLIENT TESTIMONIALS' }, description: { en: '' }, isActive: true, order: 2, type: 'testimonials' },
          { name: 'call-to-action', title: { en: 'Call to Action' }, isActive: true, order: 3, type: 'action' },
          { name: 'why-choose-us', title: { en: 'Why Choose Us' }, isActive: true, order: 4, type: 'why-choose-us' }
        ],
        isActive: true
      });
      await aboutPage.save();
      aboutPage = aboutPage.toObject();
    }

    // Filter by section name
    const filteredSections = aboutPage.sections.filter(s => s.name === 'testimonials');
    const testimonialsSection = filteredSections[0];
    
    // Return only title, subtitle, and description
    if (testimonialsSection) {
      // Handle both object format { en: 'value' } and string format
      const normalizeField = (field) => {
        if (!field) return { en: '' };
        if (typeof field === 'string') return { en: field };
        if (typeof field === 'object' && field.en !== undefined) return field;
        return { en: '' };
      };

      return NextResponse.json({
        title: normalizeField(testimonialsSection.title),
        subtitle: normalizeField(testimonialsSection.subtitle),
        description: normalizeField(testimonialsSection.description)
      });
    }
    
    return NextResponse.json({
      title: { en: '' },
      subtitle: { en: '' },
      description: { en: '' }
    });
  } catch (error) {
    console.error('Error fetching testimonials section:', error);
    return NextResponse.json(
      { error: 'Failed to fetch testimonials section' },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Find or create about page
    let page = await Page.findOne({ slug: 'about' });
    
    if (!page) {
      page = new Page({
        name: 'About',
        slug: 'about',
        metaTitle: { en: 'About' },
        metaDescription: { en: 'About page' },
        sections: []
      });
    }

    // Ensure sections is an array
    if (!page.sections || !Array.isArray(page.sections)) {
      page.sections = [];
    }

    // Check if testimonials section exists
    const idx = page.sections.findIndex(s => s && s.name === 'testimonials');
    
    // Prepare the updated section data
    const updatedSection = {
      name: 'testimonials',
      title: body.title || { en: 'Testimonials' },
      subtitle: body.subtitle || { en: 'OUR CLIENT TESTIMONIALS' },
      description: body.description || { en: '' },
      isActive: true,
      order: 2,
      type: 'testimonials',
      updatedAt: new Date()
    };

    // If section exists, preserve other fields
    if (idx !== -1 && page.sections[idx]) {
      updatedSection.isActive = page.sections[idx].isActive !== undefined ? page.sections[idx].isActive : true;
      updatedSection.order = page.sections[idx].order !== undefined ? page.sections[idx].order : 2;
      // Remove the old section and add the new one
      page.sections.splice(idx, 1);
    }
    
    // Add the updated section
    page.sections.push(updatedSection);

    // Mark the sections array as modified
    page.markModified('sections');
    await page.save();

    // Reload from database to get the updated section
    const savedPage = await Page.findOne({ slug: 'about' });
    const testimonialsSection = savedPage.sections.find(s => s && s.name === 'testimonials');
    
    if (!testimonialsSection) {
      return NextResponse.json({ error: 'Section not found after save' }, { status: 500 });
    }

    return NextResponse.json({
      title: testimonialsSection.title || { en: '' },
      subtitle: testimonialsSection.subtitle || { en: '' },
      description: testimonialsSection.description || { en: '' }
    });
  } catch (error) {
    console.error('Error updating testimonials section:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to update testimonials section',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
