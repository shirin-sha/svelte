'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useState } from 'react'

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
    const [brands, setBrands] = useState([])
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch('/api/content/brand')
                if (res.ok) {
                    const data = await res.json()
                    setBrands(Array.isArray(data) ? data : [])
                }
            } catch (_) {
                setBrands([])
            }
        }
        fetchBrands()
    }, [])
    if (brands.length === 0) return null
    return (
        <>
            <Swiper {...swiperOptions} className="thm-swiper__slider swiper-container">
                {brands.map((brand, idx) => (
                    <SwiperSlide className="swiper-slide" key={brand._id || idx}>
                        <div className="img-box">
                            <img src={brand.logo} alt="Brand logo"/>
                        </div>
                        <div className="img-box2">
                            <img src={brand.logo} alt="Brand logo"/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
