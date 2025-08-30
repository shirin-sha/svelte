'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";
import CounterUp from "@/components/elements/CounterUp";

export default function AboutSection() {
    const [aboutData, setAboutData] = useState({
        subtitle: 'About Company',
        title: 'Find Architect to Building Your Vision & Passion',
        description: 'Arki features minimal and stylish design. The theme is well crafted for all the modern architect and interior design website. With Arki, it makes your website look even more attractive and impressive to',
        mainImage: 'assets/img/about/about-v1-img1.jpg',
        authorImage: 'assets/img/about/about-v1-img2.jpg',
        signatureImage: 'assets/img/about/signature-1.png',
        shapeImage: 'assets/img/shape/about-v1-shape1.png',
        experienceYears: 24,
        experienceText: 'YEARS WORKING EXPERIENCE',
        progressBars: [
            { title: 'Design', percentage: 80 },
            { title: 'Architect', percentage: 90 }
        ],
        buttonText: 'Discover More',
        buttonLink: 'about',
        phoneNumber: '+123 456789',
        phoneText: 'Do you have any project on your mind? Call Us:'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAboutData();
    }, []);

    const fetchAboutData = async () => {
        try {
            const response = await fetch('/api/content/pages/about/sections/about-section');
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const section = data[0];
                    setAboutData({
                        subtitle: section.subtitle?.en || 'About Company',
                        title: section.title?.en || 'Find Architect to Building Your Vision & Passion',
                        description: section.description?.en || 'Arki features minimal and stylish design. The theme is well crafted for all the modern architect and interior design website. With Arki, it makes your website look even more attractive and impressive to',
                        mainImage: section.mainImage || 'assets/img/about/about-v1-img1.jpg',
                        authorImage: section.authorImage || 'assets/img/about/about-v1-img2.jpg',
                        signatureImage: section.signatureImage || 'assets/img/about/signature-1.png',
                        shapeImage: section.shapeImage || 'assets/img/shape/about-v1-shape1.png',
                        experienceYears: section.experienceYears || 24,
                        experienceText: section.experienceText || 'YEARS WORKING EXPERIENCE',
                        progressBars: section.progressBars || [
                            { title: 'Design', percentage: 80 },
                            { title: 'Architect', percentage: 90 }
                        ],
                        buttonText: section.buttonText || 'Discover More',
                        buttonLink: section.buttonLink || 'about',
                        phoneNumber: section.phoneNumber || '+123 456789',
                        phoneText: section.phoneText || 'Do you have any project on your mind? Call Us:'
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching about data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="about-one about-one--about">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-5">
                            <div>Loading...</div>
                        </div>
                        <div className="col-xl-7">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="about-one about-one--about">
            <div className="shape1 float-bob-y">
                <img src={aboutData.shapeImage} alt=""/>
            </div>
            <div className="container">
                <div className="row">
                    {/*Start About One Img */}
                    <div className="col-xl-5 wow animated fadeInRight" data-wow-delay="0.1s">
                        <div className="about-one__img">
                            <div className="inner">
                                <img src={aboutData.mainImage} alt=""/>
                            </div>
                            <div className="experience-box">
                                <div className="counter-box">
                                    <h2 className="count">
                                        <CounterUp end={aboutData.experienceYears} />
                                    </h2>
                                </div>
                                <div className="text-box">
                                    <p>{aboutData.experienceText.split(' ').map((word, index) => (
                                        <span key={index}>
                                            {word}
                                            {index < aboutData.experienceText.split(' ').length - 1 && <br/>}
                                        </span>
                                    ))}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End About One Img */}

                    {/*Start About One Content */}
                    <div className="col-xl-7 wow animated fadeInLeft" data-wow-delay="0.1s">
                        <div className="about-one__content">
                            <div className="sec-title">
                                <div className="sub-title">
                                    <h5>{aboutData.subtitle}</h5>
                                </div>
                                <h2>{aboutData.title.split(' ').map((word, index) => (
                                    <span key={index}>
                                        {word}
                                        {index < aboutData.title.split(' ').length - 1 && <br/>}
                                    </span>
                                ))}</h2>
                            </div>

                            <div className="text-box">
                                <p>{aboutData.description}</p>
                            </div>

                            <div className="about-one__content-progress">
                                {aboutData.progressBars.map((bar, index) => (
                                    <div key={index} className={`about-one__content-progress-single ${index === aboutData.progressBars.length - 1 ? 'mb0' : ''}`}>
                                        <div className="title">
                                            <h4>{bar.title}</h4>
                                        </div>
                                        <div className="bar">
                                            <div className={`bar-inner${index + 1} count-bar`} data-percent={`${bar.percentage}%`}>
                                                <div className="count-text">{bar.percentage}%</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="about-one__content-bottom">
                                <div className="about-one__content-bottom-author-box">
                                    <div className="btn-box">
                                        <Link className="thm-btn" href={aboutData.buttonLink}>
                                            <span className="txt">{aboutData.buttonText}</span>
                                        </Link>
                                    </div>

                                    <div className="author-info">
                                        <div className="img-box">
                                            <img src={aboutData.authorImage} alt=""/>
                                        </div>
                                        <div className="signature-box">
                                            <img src={aboutData.signatureImage} alt=""/>
                                        </div>
                                    </div>
                                </div>
                                <div className="text">
                                    <h4>{aboutData.phoneText} <Link href={`tel:${aboutData.phoneNumber}`}>{aboutData.phoneNumber}</Link></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End About One Content */}
                </div>
            </div>
        </section>
    );
} 