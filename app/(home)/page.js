'use client';
import { useEffect, useState } from 'react';
import Layout from "@/components/layout/Layout"
import About from "@/components/sections/home2/About"
import Banner from "@/components/sections/home2/Banner"
import Services from "@/components/sections/home2/Services"
import Projects from "@/components/sections/home2/Projects"
import Features from "@/components/sections/home2/Features"
import News from "@/components/sections/home2/News"
import Action from "@/components/sections/home2/Action"
import Contact from "@/components/sections/home2/Contact"
import Brand from "@/components/sections/home2/Brand"
import WhyChooseUs from "@/components/sections/home2/WhyChooseUs"

export default function Home() {
    const [sectionVisibility, setSectionVisibility] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSectionVisibility();
    }, []);

    const fetchSectionVisibility = async () => {
        try {
            const response = await fetch('/api/content/home-sections');
            if (response.ok) {
                const sections = await response.json();
                const visibilityMap = {};
                sections.forEach(section => {
                    visibilityMap[section.name] = section.isActive;
                });
                setSectionVisibility(visibilityMap);
            }
        } catch (error) {
            console.error('Error fetching section visibility:', error);
            // Default to showing all sections if API fails
            setSectionVisibility({
                header: true,
                banner: true,
                features: true,
                about: true,
                services: true,
                projects: true,
                contact: true,
                brand: true,
                'why-choose-us': true,
                action: true,
                blog: true
            });
        } finally {
            setLoading(false);
        }
    };

    // Component mapping for sections
    const sectionComponents = {
        banner: <Banner key="banner" />,
        features: <Features key="features" />,
        about: <About key="about" />,
        services: <Services key="services" />,
        projects: <Projects key="projects" />,
        contact: <Contact key="contact" />,
        brand: <Brand key="brand" />,
        'why-choose-us': <WhyChooseUs key="why-choose-us" />,
        action: <Action key="action" />,
        blog: <News key="blog" />
    };

    // Section order for proper rendering sequence
    const sectionOrder = [
        'banner', 'features', 'about', 'services', 
        'projects', 'contact', 'brand', 'why-choose-us', 
        'action', 'blog'
    ];

    if (loading) {
        return (
            <Layout headerStyle={2} footerStyle={1}>
                <div style={{ 
                    minHeight: '60vh', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: '#f8f9fa'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                            width: 50, 
                            height: 50, 
                            border: '4px solid #e5e7eb',
                            borderTop: '4px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading page sections...</p>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </Layout>
        );
    }

    return (
        <>
            <Layout headerStyle={2} footerStyle={1}>
                {sectionOrder.map(sectionName => {
                    // Only render section if it's active
                    if (sectionVisibility[sectionName] === false) {
                        return null;
                    }
                    return sectionComponents[sectionName] || null;
                })}
            </Layout>
        </>
    );
}   