'use client'
import { useState, useEffect } from 'react'
import BrandSlider2 from '@/components/slider/BrandSlider2'
import AboutSection from '@/components/sections/about/AboutSection'
import Layout from "@/components/layout/Layout"
import TestimonialSlider4 from "@/components/slider/TestimonialSlider4"
import WhyChooseUs from "@/components/sections/home2/WhyChooseUs"
import Action from "@/components/sections/home2/Action"
import OurApproach from '@/components/sections/about/OurApproach'
import OurPromise from '@/components/sections/about/OurPromise'

export default function Home() {
    const [testimonialsSectionData, setTestimonialsSectionData] = useState({
        subtitle: '',
        title: '',
        description: ''
    });

    useEffect(() => {
        fetchTestimonialsSectionData();
    }, []);

    const fetchTestimonialsSectionData = async () => {
        try {
            const response = await fetch('/api/content/pages/about/sections/testimonials', { cache: 'no-store' });
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setTestimonialsSectionData({
                        subtitle: data.subtitle?.en || '',
                        title: data.title?.en || '',
                        description: data.description?.en || ''
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching testimonials section data:', error);
        }
    };
    
    return (
        <>
            <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="About Us">
                <div>
                {/*Start About One - Dynamic Content */}
                <AboutSection />
                {/*End About One */}

                {/*Start Testimonials Two */}
                <section className="testimonials-two">
                    <div className="testimonials-two__pattern"
                        style={{backgroundImage: 'url(assets/img/pattern/testimonials-v2-pattern.png)'}}></div>
                    <div className="shape1 float-bob-x"><img src="assets/img/shape/testimonials-v2-shape1.png" alt=""/></div>
                    <div className="container">
                        {(testimonialsSectionData.subtitle || testimonialsSectionData.title || testimonialsSectionData.description) && (
                            <div className="sec-title text-center">
                                {testimonialsSectionData.subtitle && (
                                    <div className="sub-title">
                                        <h5>{testimonialsSectionData.subtitle}</h5>
                                    </div>
                                )}
                                {testimonialsSectionData.title && (
                                    <h2>{testimonialsSectionData.title}</h2>
                                )}
                                {testimonialsSectionData.description && (
                                    <p>{testimonialsSectionData.description}</p>
                                )}
                            </div>
                        )}

                        <TestimonialSlider4/>
                        {/*If we need navigation buttons */}
                        
                    </div>
                </section>
                {/*End Testimonials Two */}


                {/*Start Brand Two */}
                <div className="brand-one brand-one--two about">
                    <div className="container">
                        <BrandSlider2/>
                    </div>
                </div>
                {/*End Brand Two */}
                <WhyChooseUs/>
<Action/>

                {/*Start Our Promise     */}
                <OurPromise />
                {/*End Our Promise */}
                {/*Start Our Approach */}
                <OurApproach />
                {/*End Our Approach */}
                </div>
            </Layout>
        </>
    )
}


