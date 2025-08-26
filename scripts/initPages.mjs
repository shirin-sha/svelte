import dbConnect from '../lib/database.js';
import Page from '../models/Page.js';

const defaultPages = [
  {
    name: 'Home Page',
    slug: 'home',
    metaTitle: {
      en: 'HOME | ENMAA',
      ar: 'الرئيسية | ENMAA'
    },
    metaDescription: {
      en: 'Discover the latest news, updates, and services offered by our company.',
      ar: 'اكتشف أحدث الأخبار والتحديثات والخدمات التي تقدمها شركتنا.'
    },
    sections: [
      { name: 'header', title: { en: 'Header' }, content: { en: '' }, image: '', isActive: true, order: 1, type: 'text' },
      { name: 'banner', title: { en: 'Banner' }, content: { en: '' }, image: '/assets/img/slider/slider-v1-img1.jpg', isActive: true, order: 2, type: 'hero' },
      { name: 'features', title: { en: 'Features' }, content: { en: '' }, image: '', isActive: true, order: 3, type: 'text' },
      { name: 'about', title: { en: 'About' }, content: { en: '' }, image: '/assets/img/about/about-v2-img1.jpg', isActive: true, order: 4, type: 'about' },
      { name: 'services', title: { en: 'Services' }, content: { en: '' }, image: '/assets/img/service/service-v2-single-bg.jpg', isActive: true, order: 5, type: 'services' },
      { name: 'projects', title: { en: 'Projects' }, content: { en: '' }, image: '/assets/img/project/project-v2-img1.jpg', isActive: true, order: 6, type: 'text' },
      { name: 'contact', title: { en: 'Contact' }, content: { en: '' }, image: '/assets/img/background/contact-v1-bg.jpg', isActive: true, order: 7, type: 'contact' },
      { name: 'brand', title: { en: 'Brand' }, content: { en: '' }, image: '/assets/img/brand/brand-v2-img1.png', isActive: true, order: 8, type: 'text' },
      { name: 'why-choose-us', title: { en: 'Why Choose Us' }, content: { en: '' }, image: '', isActive: true, order: 9, type: 'text' },
      { name: 'action', title: { en: 'Call To Action' }, content: { en: '' }, image: '/assets/img/background/call-to-action-v1-bg.jpg', isActive: true, order: 10, type: 'text' },
      { name: 'blog', title: { en: 'Blog' }, content: { en: '' }, image: '/assets/img/blog/blog-v2-img1.jpg', isActive: true, order: 11, type: 'text' },
    ]
  },
  {
    name: 'About',
    slug: 'about',
    metaTitle: {
      en: 'ABOUT | ENMAA',
      ar: 'من نحن | ENMAA'
    },
    metaDescription: {
      en: 'Learn more about our company, mission, and values.',
      ar: 'تعرف على المزيد عن شركتنا ورسالتنا وقيمنا.'
    },
    sections: [
      {
        name: 'about-hero',
        title: {
          en: 'About Our Company',
          ar: 'عن شركتنا'
        },
        content: {
          en: 'We are a leading real estate and property management company.',
          ar: 'نحن شركة رائدة في مجال العقارات وإدارة الممتلكات.'
        },
        image: '/assets/img/about/about-v1-img1.jpg',
        isActive: true,
        order: 1,
        type: 'hero'
      }
    ]
  },
  {
    name: 'Services',
    slug: 'services',
    metaTitle: {
      en: 'SERVICES | ENMAA',
      ar: 'الخدمات | ENMAA'
    },
    metaDescription: {
      en: 'Explore our comprehensive range of real estate and property management services.',
      ar: 'استكشف مجموعة شاملة من خدمات العقارات وإدارة الممتلكات.'
    },
    sections: [
      {
        name: 'services-hero',
        title: {
          en: 'Our Services',
          ar: 'خدماتنا'
        },
        content: {
          en: 'Comprehensive real estate and property management solutions.',
          ar: 'حلول شاملة للعقارات وإدارة الممتلكات.'
        },
        image: '/assets/img/service/service-v2-single-bg.jpg',
        isActive: true,
        order: 1,
        type: 'hero'
      }
    ]
  },
  {
    name: 'Contact',
    slug: 'contact',
    metaTitle: {
      en: 'CONTACT | ENMAA',
      ar: 'اتصل بنا | ENMAA'
    },
    metaDescription: {
      en: 'Get in touch with us for any inquiries or support.',
      ar: 'تواصل معنا لأي استفسارات أو دعم.'
    },
    sections: [
      {
        name: 'contact-hero',
        title: {
          en: 'Contact Us',
          ar: 'اتصل بنا'
        },
        content: {
          en: 'We are here to help you with all your real estate needs.',
          ar: 'نحن هنا لمساعدتك في جميع احتياجاتك العقارية.'
        },
        image: '/assets/img/background/contact-v1-bg.jpg',
        isActive: true,
        order: 1,
        type: 'hero'
      }
    ]
  }
];

async function initPages() {
  try {
    await dbConnect();
    
    for (const pageData of defaultPages) {
      const existingPage = await Page.findOne({ slug: pageData.slug });
      
      if (!existingPage) {
        await Page.create(pageData);
        console.log(`✅ Created page: ${pageData.name}`);
      } else {
        console.log(`⏭️  Page already exists: ${pageData.name}`);
      }
    }
    
    console.log('🎉 Pages initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing pages:', error);
    process.exit(1);
  }
}

initPages(); 