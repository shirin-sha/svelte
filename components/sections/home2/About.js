'use client'
import { useState, useEffect } from 'react'
import ModalVideo from 'react-modal-video'
import React from 'react';
import Link from "next/link"

export default function About() {
    const [isOpen, setOpen] = useState(false)
    const [data, setData] = useState({
        title: 'We Take Care of Everything for Your Goals',
        subtitle: 'KNOW ABOUT SVELTE',
        description: 'Nullam eu nibh vitae est tempor molestie id sed ex. Quisque dignissim maximus ipsum, sed rutrum metus tincidunt et. Sed eget tincidunt ipsum. Eget tincidunt',
        image1: 'assets/img/about/about-v2-img1.jpg',
        image2: 'assets/img/about/about-v2-img2.jpg',
        videoId: 'vfhzo499OeA',
        bullets: [
            'Feasiblity Studies',
            'Conceptual Design',
            'Custom design & feauture'
        ]
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/pages/home/sections/about')
            if (res.ok) {
                const section = await res.json()
                let parsed = null
                try {
                    parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                } catch (_) {
                    parsed = null
                }
                if (parsed) {
                    setData(prev => ({
                        ...prev,
                        title: parsed.title || prev.title,
                        subtitle: parsed.subtitle || prev.subtitle,
                        description: parsed.description || prev.description,
                        image1: parsed.image1 || prev.image1,
                        image2: parsed.image2 || prev.image2,
                        videoId: parsed.videoId || prev.videoId,
                        bullets: Array.isArray(parsed.bullets) && parsed.bullets.length ? parsed.bullets : prev.bullets
                    }))
                }
            }
        } catch (e) {
            console.error('Error fetching about data:', e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="about-two" style={{ minHeight: '600px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="about-two__img">
                                <div className="about-two__img1" style={{ opacity: 0.7 }}>
                                    <div className="inner">
                                        <div style={{ 
                                            width: '100%', 
                                            height: '300px', 
                                            background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                                            backgroundSize: '200% 100%',
                                            animation: 'shimmer 2s infinite',
                                            borderRadius: '8px'
                                        }}></div>
                                    </div>
                                </div>
                                <div className="about-two__img2" style={{ opacity: 0.7 }}>
                                    <div style={{ 
                                        width: '100%', 
                                        height: '200px', 
                                        background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 2s infinite',
                                        borderRadius: '8px'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="about-two__content">
                                <div className="sec-title">
                                    <div style={{ height: 20, width: 200, background: '#e5e7eb', borderRadius: 4, marginBottom: 16 }}></div>
                                    <div style={{ height: 40, width: '80%', background: '#e5e7eb', borderRadius: 6, marginBottom: 20 }}></div>
                                </div>
                                <div style={{ height: 80, background: '#e5e7eb', borderRadius: 6, marginBottom: 20 }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    {[0,1,2].map(i => (
                                        <div key={i} style={{ height: 20, width: '70%', background: '#e5e7eb', borderRadius: 4 }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style jsx>{`
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}</style>
            </section>
        )
    }

    return (
        <> 
        <section className="about-two">
            <div className="container">
                <div className="row">
                    <div className="col-xl-6">
                        <div className="about-two__img">
                            <div className="about-two__img1 wow fadeInLeft" data-wow-delay="200ms" data-wow-duration="1500ms">
                                <div className="inner">
                                    <img src={data.image1} alt="About us" />
                                </div>
                            </div>
                            <div className="about-two__img2 wow fadeInRight" data-wow-delay="200ms" data-wow-duration="1500ms">
                                <img src={data.image2} alt="About us" />
                                <div className="about-two__video-btn">
                                    <a onClick={() => setOpen(true)} className="about-two__icon video-popup">
                                        <span className="icon-play-button-1"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-xl-6">
                        <div className="about-two__content">
                            <div className="sec-title">
                                <div className="sub-title">
                                    <h5>{data.subtitle}</h5>
                                </div>
                                <h2 dangerouslySetInnerHTML={{ __html: data.title.replace(/\n/g, '<br/>') }} />
                            </div>

                            <div className="about-two__content-text">
                                <p>{data.description}</p>
                            </div>

                            <div className="about-two__content-list">
                                <ul>
                                    {data.bullets.map((bullet, i) => (
                                        <li key={i}>
                                            <p><span className="icon-verified"></span> {bullet}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="about-two__content-bottom">
                                <div className="btn-box">
                                    <Link className="thm-btn" href="/about">
                                        <span className="txt">Discover More</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <ModalVideo 
            channel='youtube' 
            autoplay 
            isOpen={isOpen} 
            videoId={data.videoId} 
            onClose={() => setOpen(false)} 
        />
        </>
    )
}
