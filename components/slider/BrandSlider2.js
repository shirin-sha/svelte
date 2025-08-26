'use client'
import { useEffect, useState } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 5,
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
            slidesPerView: 3,
            spaceBetween: 30,
        },
        991: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        1199: {
            slidesPerView: 4,
            spaceBetween: 30,
        },
        1350: {
            slidesPerView: 5,
            spaceBetween: 30,
        },
    }
}

export default function BrandSlider2() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                console.log('Fetching brands...');
                const response = await fetch('/api/content/brand');
                if (response.ok) {
                    const data = await response.json();
                    console.log('Brands fetched:', data);
                    setBrands(data);
                } else {
                    console.error('Failed to fetch brands:', response.status);
                }
            } catch (error) {
                console.error('Error fetching brands:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="brand-slider-loading" style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '16px', color: '#666' }}>Loading brands...</div>
            </div>
        );
    }

    if (brands.length === 0) {
        return null; // Don't show anything if no brands
    }

    return (
        <>
            <Swiper {...swiperOptions} className="thm-swiper__slider swiper-container">
                <div className="swiper-wrapper">
                    {brands.map((brand, index) => (
                        <SwiperSlide key={brand._id} className="swiper-slide">
                            <div className="img-box">
                                <img 
                                    src={brand.logo} 
                                    alt={brand.name}
                                    style={{ 
                                        width: brand.size?.width || 150, 
                                        height: brand.size?.height || 80,
                                        objectFit: 'contain'
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </>
    )
}
