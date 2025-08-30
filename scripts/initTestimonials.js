import dbConnect from '../lib/database.js';
import Testimonial from '../models/Testimonial.js';

const sampleTestimonials = [
  {
    name: "Janes Cooper",
    position: "Designer",
    company: "Design Studio Co.",
    image: "assets/img/testimonial/testimonials-v2-img1.jpg",
    testimonial: "Bring to the table win-win strategies to ensure proactive domination. At the end of the day going forward normal that has evolved from operational excellence.",
    rating: 5,
    isActive: true,
    order: 1
  },
  {
    name: "Anonna Aivi",
    position: "Architect",
    company: "Modern Architecture Ltd.",
    image: "assets/img/testimonial/testimonials-v2-img1.jpg",
    testimonial: "Through a unique combination of construction and design disciplines expertise, we deliver exceptional results that exceed client expectations.",
    rating: 5,
    isActive: true,
    order: 2
  },
  {
    name: "Danish Berlow",
    position: "Project Manager",
    company: "Construction Pro",
    image: "assets/img/testimonial/testimonials-v2-img1.jpg",
    testimonial: "The team's attention to detail and commitment to quality is outstanding. They transformed our vision into reality with precision and creativity.",
    rating: 5,
    isActive: true,
    order: 3
  },
  {
    name: "Sarah Johnson",
    position: "Interior Designer",
    company: "Style Interiors",
    image: "assets/img/testimonial/testimonials-v2-img1.jpg",
    testimonial: "Working with this team was an absolute pleasure. Their innovative approach and technical expertise resulted in a stunning final product.",
    rating: 5,
    isActive: true,
    order: 4
  },
  {
    name: "Michael Chen",
    position: "Real Estate Developer",
    company: "Urban Development Corp",
    image: "assets/img/testimonial/testimonials-v2-img1.jpg",
    testimonial: "The architectural solutions provided were both innovative and practical. They delivered on time and within budget, exceeding our expectations.",
    rating: 5,
    isActive: true,
    order: 5
  }
];

async function initTestimonials() {
  try {
    await dbConnect();
    console.log('Connected to database');

    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');

    // Insert sample testimonials
    const result = await Testimonial.insertMany(sampleTestimonials);
    console.log(`Inserted ${result.length} testimonials`);

    console.log('Testimonials initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing testimonials:', error);
    process.exit(1);
  }
}

initTestimonials(); 