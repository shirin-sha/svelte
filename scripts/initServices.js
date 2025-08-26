import dbConnect from '../lib/database.js';
import Service from '../models/Service.js';

async function initServices() {
  try {
    await dbConnect();
    
    // Check if services already exist
    const existingServices = await Service.find({});
    
    if (existingServices.length === 0) {
      // Create default services
      const defaultServices = [
        {
          title: "Building Architecture",
          description: "Professional architectural design services for residential and commercial buildings",
          shortDescription: "Professional architectural design services for residential and commercial buildings",
          icon: "icon-construction-machine",
          imageUrl: "assets/img/service/services-details-img1.jpg",
          content: `
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh finibus et. Aenean eu enim justo. Vestibulum aliquam hendrerit molestie. Mauris malesuada nisi sit amet augue accumsan tincidunt. Maecenas tincidunt, velit ac porttitor pulvinar, tortor eros facilisis libero, vitae commodo nunc quam et ligula</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas varius tortor nibh, sit amet tempor nibh finibus et. Aenean eu enim justo. Vestibulum aliquam hendrerit molestie.</p>
          `,
          features: [
            "Professional architectural design",
            "3D modeling and visualization",
            "Building code compliance",
            "Sustainable design principles"
          ],
          benefits: [
            "Expert architectural guidance",
            "Custom design solutions",
            "Cost-effective planning",
            "Timely project delivery"
          ],
          featured: true
        },
        {
          title: "Interior Design",
          description: "Creative interior design solutions for modern living spaces",
          shortDescription: "Creative interior design solutions for modern living spaces",
          icon: "icon-interior-design",
          imageUrl: "assets/img/service/services-details-img2.jpg",
          content: `
            <p>Transform your living spaces with our professional interior design services. We create beautiful, functional, and personalized environments that reflect your style and meet your needs.</p>
            <p>Our team of experienced designers works closely with you to understand your vision and bring it to life through innovative design solutions.</p>
          `,
          features: [
            "Space planning and layout",
            "Color scheme consultation",
            "Furniture selection",
            "Lighting design"
          ],
          benefits: [
            "Enhanced living experience",
            "Increased property value",
            "Personalized design solutions",
            "Professional guidance"
          ],
          featured: true
        },
        {
          title: "Construction Site Management",
          description: "Comprehensive construction site management and supervision services",
          shortDescription: "Comprehensive construction site management and supervision services",
          icon: "icon-construction",
          imageUrl: "assets/img/service/services-details-img3.jpg",
          content: `
            <p>Professional construction site management ensures your project is completed on time, within budget, and to the highest quality standards. Our experienced team oversees every aspect of the construction process.</p>
            <p>From initial planning to final inspection, we provide comprehensive supervision and management services to ensure your project's success.</p>
          `,
          features: [
            "Project planning and scheduling",
            "Quality control and inspection",
            "Safety management",
            "Progress monitoring"
          ],
          benefits: [
            "Timely project completion",
            "Cost control and efficiency",
            "Quality assurance",
            "Risk mitigation"
          ],
          featured: false
        },
        {
          title: "Building Renovation",
          description: "Expert renovation services to transform existing structures",
          shortDescription: "Expert renovation services to transform existing structures",
          icon: "icon-renovation",
          imageUrl: "assets/img/service/services-details-img4.jpg",
          content: `
            <p>Transform your existing building with our professional renovation services. We specialize in modernizing and upgrading structures while preserving their character and integrity.</p>
            <p>Our renovation experts work with you to create beautiful, functional spaces that meet modern standards and exceed your expectations.</p>
          `,
          features: [
            "Structural assessment",
            "Design consultation",
            "Modernization upgrades",
            "Quality craftsmanship"
          ],
          benefits: [
            "Increased property value",
            "Improved functionality",
            "Modern amenities",
            "Preserved character"
          ],
          featured: false
        },
        {
          title: "Security System Installation",
          description: "Advanced security system design and installation services",
          shortDescription: "Advanced security system design and installation services",
          icon: "icon-security",
          imageUrl: "assets/img/service/services-details-img5.jpg",
          content: `
            <p>Protect your property with our comprehensive security system solutions. We design and install advanced security systems tailored to your specific needs and requirements.</p>
            <p>From residential to commercial properties, our security experts provide reliable, cutting-edge solutions for peace of mind.</p>
          `,
          features: [
            "Security system design",
            "CCTV installation",
            "Access control systems",
            "24/7 monitoring"
          ],
          benefits: [
            "Enhanced security",
            "Peace of mind",
            "Remote monitoring",
            "Professional installation"
          ],
          featured: false
        },
        {
          title: "UI/UX Design",
          description: "Professional user interface and user experience design services",
          shortDescription: "Professional user interface and user experience design services",
          icon: "icon-design",
          imageUrl: "assets/img/service/services-details-img6.jpg",
          content: `
            <p>Create exceptional digital experiences with our UI/UX design services. We focus on creating intuitive, user-friendly interfaces that enhance user engagement and satisfaction.</p>
            <p>Our design team combines creativity with user-centered design principles to deliver solutions that meet both business goals and user needs.</p>
          `,
          features: [
            "User research and analysis",
            "Wireframing and prototyping",
            "Visual design",
            "Usability testing"
          ],
          benefits: [
            "Improved user experience",
            "Higher conversion rates",
            "Reduced development time",
            "Competitive advantage"
          ],
          featured: false
        }
      ];
      
      for (const serviceData of defaultServices) {
        await Service.create(serviceData);
      }
      
      console.log('✅ Services initialized successfully!');
      console.log('🛠️ Created', defaultServices.length, 'default services');
    } else {
      console.log('ℹ️ Services already exist');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing services:', error);
    process.exit(1);
  }
}

initServices(); 