import dbConnect from '../lib/database.js';
import Page from '../models/Page.js';

async function addTestimonialsSection() {
  try {
    await dbConnect();
    
    const aboutPage = await Page.findOne({ slug: 'about' });
    
    if (aboutPage) {
      // Check if testimonials section already exists
      const hasTestimonials = aboutPage.sections.some(s => s.name === 'testimonials');
      
      if (!hasTestimonials) {
        // Add testimonials section
        aboutPage.sections.push({
          name: 'testimonials',
          title: { en: 'Testimonials' },
          subtitle: { en: 'OUR CLIENT TESTIMONIALS' },
          isActive: true,
          order: 2,
          type: 'testimonials'
        });
        
        await aboutPage.save();
        console.log('✅ Testimonials section added to about page');
      } else {
        console.log('ℹ️ Testimonials section already exists');
      }
    } else {
      console.log('❌ About page not found');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestimonialsSection();
