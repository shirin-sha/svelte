'use client'
import { useState, useEffect } from 'react';
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
};

export default function DynamicTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/content/testimonials');
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading testimonials...</div>
            </div>
        );
    }

    if (!testimonials.length) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No testimonials available at the moment.</p>
            </div>
        );
    }

    return (
        <Swiper {...swiperOptions} className="thm-swiper__slider swiper-container">
            <div className="swiper-wrapper">
                {testimonials.map((testimonial, index) => (
                    <SwiperSlide key={testimonial._id || index} className="swiper-slide">
                        <div className="testimonials-two__single">
                            <div className="testimonials-two__single-top">
                                <div className="img-box">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.name}
                                        onError={(e) => {
                                            e.target.src = 'assets/img/testimonial/testimonials-v2-img1.jpg';
                                        }}
                                    />
                                </div>

                                <div className="icon-box">
                                    <span className="icon-quote"></span>
                                </div>
                            </div>

                            <div className="testimonials-two__single-text">
                                <p>{testimonial.testimonial}</p>
                            </div>

                            <div className="testimonials-two__single-bottom">
                                <h3>{testimonial.name}</h3>
                                <p>{testimonial.position}</p>
                                {testimonial.company && (
                                    <p className="text-sm text-gray-600">{testimonial.company}</p>
                                )}
                                {testimonial.rating && (
                                    <div className="flex items-center mt-2">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-sm">★</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </div>
        </Swiper>
    );
} 