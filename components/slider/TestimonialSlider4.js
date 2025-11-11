'use client'
import { useState, useEffect } from 'react'
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 2,
    spaceBetween: 30,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
    loop: true,

    // Navigation
    navigation: {
        nextEl: '.h1n',
        prevEl: '.h1p',
    },

    // Pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

    breakpoints: {
        320: {
            slidesPerView: 1,
            spaceBetween: 30,
        },
        575: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        767: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        991: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1199: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        1350: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
    }
}
export default function TestimonialSlider4() {
    const [features, setFeatures] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchWhyChooseData()
    }, [])

    const fetchWhyChooseData = async () => {
        try {
            const response = await fetch('/api/content/pages/about/sections/why-choose-us')
            if (response.ok) {
                const data = await response.json()
                if (data && data.features && Array.isArray(data.features)) {
                    setFeatures(data.features)
                } else {
                    setFeatures([])
                }
            }
        } catch (error) {
            console.error('Error fetching why choose data:', error)
            setFeatures([])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return null
    }

    if (!features || features.length === 0) {
        return null
    }

    return (
        <>
            <Swiper {...swiperOptions} className="thm-swiper__slider swiper-container">
                <div className="swiper-wrapper">
                    {features.map((item, index) => (
                        <SwiperSlide key={index} className="swiper-slide">
                            {/*Start Why Choose Svelte Card */}
                            <div className="testimonials-two__single">
                                <div className="testimonials-two__single-top">
                                    <div className="icon-box">
                                        <span className={item.icon || ''}></span>
                                    </div>
                                </div>

                                <div className="testimonials-two__single-text">
                                    <h3>{item.title || ''}</h3>
                                    <p>{item.description || ''}</p>
                                </div>
                            </div>
                            {/*End Why Choose Svelte Card */}
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    )
}