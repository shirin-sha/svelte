'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function WhyChooseUs() {
    const [whyChooseUsData, setWhyChooseUsData] = useState({
        features: [
            {
                icon: 'icon-office-building',
                title: 'Architecture Design',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
            },
            {
                icon: 'icon-bed',
                title: 'The Joy of Best Living',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
            },
            {
                icon: 'icon-targeted',
                title: 'Professional Planning',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
            }
        ],
        leftImage1: 'assets/img/resource/why-choose-us-v1-img1.jpg',
        leftImage2: 'assets/img/resource/why-choose-us-v1-img2.jpg',
        shapeImage: 'assets/img/shape/why-choose-us-v1-shape1.png'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWhyChooseUsData();
    }, []);

    const fetchWhyChooseUsData = async () => {
        try {
            const response = await fetch('/api/content/home-sections?section=why-choose-us');
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const section = data[0];
                    setWhyChooseUsData({
                        features: section.features || [
                            {
                                icon: 'icon-office-building',
                                title: 'Architecture Design',
                                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
                            },
                            {
                                icon: 'icon-bed',
                                title: 'The Joy of Best Living',
                                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
                            },
                            {
                                icon: 'icon-targeted',
                                title: 'Professional Planning',
                                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
                            }
                        ],
                        leftImage1: section.leftImage1 || 'assets/img/resource/why-choose-us-v1-img1.jpg',
                        leftImage2: section.leftImage2 || 'assets/img/resource/why-choose-us-v1-img2.jpg',
                        shapeImage: section.shapeImage || 'assets/img/shape/why-choose-us-v1-shape1.png'
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching why choose us data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="why-choose-us-one">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6">
                            <div>Loading...</div>
                        </div>
                        <div className="col-xl-6">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <>            

        {/*Start Why Choose Us One */}
        <div className="why-choose-us-one">
            <div className="container">
                <div className="row">
                    {/*Start Why Choose Us One Img */}
                    <div className="col-xl-6 wow animated fadeInRight" data-wow-delay="0.1s">
                        <div className="why-choose-us-one__img">
                            <div className="shape1">
                                <img src={whyChooseUsData.shapeImage} alt=""/>
                            </div>
                            <ul>
                                <li>
                                    <div className="img-box">
                                        <img src={whyChooseUsData.leftImage1} alt=""/>
                                    </div>
                                </li>

                                <li>
                                    <div className="img-box">
                                        <img src={whyChooseUsData.leftImage2} alt=""/>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {/*End Why Choose Us One Img */}

                    {/*Start Why Choose Us Content */}
                    <div className="col-xl-6 wow animated fadeInLeft" data-wow-delay="0.1s">
                        <div className="why-choose-us-one__content">
                            <ul>
                                {whyChooseUsData.features.map((feature, index) => (
                                    <li key={index}>
                                        <div className="inner">
                                            <div className="icon-box">
                                                <span className={feature.icon}></span>
                                            </div>
                                            <div className="content-box">
                                                <h2>{feature.title}</h2>
                                                <p>{feature.description}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/*End Why Choose Us Content */}
                </div>
            </div>
        </div>
        {/*End Why Choose Us One */}

        </>
    )
}


