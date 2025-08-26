'use client'
import { useState, useEffect } from 'react'
import ModalVideo from 'react-modal-video'
import React from 'react';
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: {
        delay: 7000,
        disableOnInteraction: false,
    },
    loop: true,
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
}

// Loading skeleton component to maintain layout
const BannerSkeleton = () => (
    <section className="main-slider main-slider-two" style={{ minHeight: '600px', background: '#f8f9fa' }}>
        <div className="container">
            <div className="main-slider-two__single" style={{ minHeight: '600px', display: 'flex', alignItems: 'center' }}>
                <div className="main-slider-two__content">
                    <div className="big-title">
                        <div style={{ 
                            height: '60px', 
                            background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                            backgroundSize: '200% 100%',
                            animation: 'shimmer 2s infinite',
                            borderRadius: '8px',
                            marginBottom: '20px'
                        }}></div>
                    </div>
                    <div style={{ 
                        height: '40px', 
                        width: '70%',
                        background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s infinite',
                        borderRadius: '6px',
                        marginBottom: '30px'
                    }}></div>
                    <div className="btn-box">
                        <div className="btn-one">
                            <div style={{ 
                                height: '50px', 
                                width: '150px',
                                background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite',
                                borderRadius: '25px',
                                display: 'inline-block',
                                marginRight: '20px'
                            }}></div>
                        </div>
                        <div className="btn-two">
                            <div style={{ 
                                height: '50px', 
                                width: '180px',
                                background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 2s infinite',
                                borderRadius: '25px',
                                display: 'inline-block'
                            }}></div>
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
);

export default function Banner() {
    const [isOpen, setOpen] = useState(false)
    const [bannerData, setBannerData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchBanner()
    }, [])

    const fetchBanner = async () => {
        try {
            const response = await fetch('/api/content/banner')
            if (response.ok) {
                const data = await response.json()
                setBannerData(data || null)
            }
        } catch (error) {
            console.error('Error fetching banner:', error)
        } finally {
            setLoading(false)
        }
    }

    // Show skeleton while loading to maintain layout
    if (loading) return <BannerSkeleton />
    
    // Show skeleton if no banner data to maintain consistent layout
    if (!bannerData || bannerData.length === 0) return <BannerSkeleton />

    return (
        <>
            <section className="main-slider main-slider-two">
                <Swiper {...swiperOptions} >
                    {bannerData.map((banner, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="image-layer"
                                style={{ backgroundImage: `url(${banner.imageUrl})` }}
                            ></div>
                            {/* <div
                                className="main-slider-two__pattern"
                                style={{
                                    backgroundImage: 'url(assets/img/pattern/main-slider-v2-pattern.png)',
                                }}
                            ></div> */}
                            <div className="container">
                                <div className="main-slider-two__single">
                                    <div className="main-slider-two__content">
                                        <div className="big-title">
                                            <h2>{banner.title}</h2>
                                        </div>
                                        <h2>{banner.subtitle}</h2>
                                        <div className="btn-box">
                                            <div className="btn-one">
                                                <Link className="thm-btn" href="/contact">
                                                    <span className="txt">Discover More</span>
                                                </Link>
                                            </div>
                                            <div className="btn-two">
                                                <a
                                                    onClick={() => setOpen(true)}
                                                    className="video-popup"
                                                >
                                                
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}


                </Swiper>
            </section>
            <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="vfhzo499OeA" onClose={() => setOpen(false)} />
        </>
    )
}
