'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function AboutSection() {
    const [aboutData, setAboutData] = useState({
        subtitle: '',
        title: '',
        description: '',
        mainImage: '',
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
                        subtitle: section.subtitle?.en || '',
                        title: section.title?.en || '',
                        description: section.description?.en || '',
                        mainImage: section.mainImage || '',
                        progressBars: section.progressBars && section.progressBars.length >= 2 
                            ? section.progressBars.slice(0, 2)
                            : [
                                { title: 'Design', percentage: 80 },
                                { title: 'Architect', percentage: 90 }
                            ],
                        buttonText: section.buttonText || '',
                        buttonLink: section.buttonLink || '',
                        phoneNumber: section.phoneNumber || '',
                        phoneText: section.phoneText || ''
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
            {/* Shape image removed */}
            {/* <div className="shape1 float-bob-y">
                <img src={aboutData.shapeImage} alt=""/>
            </div> */}
            <div className="container">
                <div className="row">
                    {/*Start About One Img */}
                    <div className="col-xl-5 wow animated fadeInRight" data-wow-delay="0.1s">
                        <div className="about-one__img">
                            <div className="inner">
                                <img src={aboutData.mainImage} alt=""/>
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
                                <h2>{aboutData.title}</h2>
                            </div>

                            <div className="text-box">
                                <p>{aboutData.description}</p>
                            </div>

                            <div className="about-one__content-progress">
                                        <div className="about-one__content-progress-single">
                                            <div className="title">
                                                <h4>{aboutData.progressBars[0].title}</h4>
                                            </div>
                                            <div className="bar">
                                                <div className="bar-inner1 count-bar" data-percent="90%">
                                                    <div className="count-text">{aboutData.progressBars[0].percentage}%</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="about-one__content-progress-single mb0">
                                            <div className="title">
                                                <h4>{aboutData.progressBars[1].title}</h4>
                                            </div>
                                            <div className="bar">
                                                <div className="bar-inner2 count-bar" data-percent="95%">
                                                    <div className="count-text style2">{aboutData.progressBars[1].percentage}%</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                     
                            <div className="about-one__content-bottom">
                                        <div className="about-one__content-bottom-author-box">
                                            <div className="btn-box">
                                                <Link className="thm-btn" href={aboutData.buttonLink}>
                                                    <span className="txt">{aboutData.buttonText}</span>
                                                </Link>
                                            </div>

                                            <div className="author-info">
                                              
                                                <div className="signature-box">
                                                    <p style={{fontSize: '18px', lineHeight: '26px', fontWeight: '700',color:'#11161f'}}>  {aboutData.phoneText} <Link href={`tel:${aboutData.phoneNumber}`}>{aboutData.phoneNumber}</Link></p>
                                                </div>
                                            </div>
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