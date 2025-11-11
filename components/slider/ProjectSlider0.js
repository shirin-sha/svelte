'use client'
import Link from "next/link"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { useEffect, useState } from 'react'

const swiperOptions = {
    modules: [Autoplay, Pagination, Navigation],
    slidesPerView: 2,
    // spaceBetween: 30,
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
            // spaceBetween: 30,
        },
        575: {
            slidesPerView: 1,
            // spaceBetween: 30,
        },
        767: {
            slidesPerView: 1,
            // spaceBetween: 30,
        },
        991: {
            slidesPerView: 1,
            // spaceBetween: 30,
        },
        1199: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1350: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
    }
}
export default function ProjectSlider0() {
    const [projects, setProjects] = useState([])
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('/api/content/project')
                if (res.ok) {
                    const data = await res.json()
                    setProjects(Array.isArray(data) ? data : [])
                }
            } catch (_) {
                setProjects([])
            }
        }
        fetchProjects()
    }, [])
    const hasProjects = projects.length > 0
    if (!hasProjects) return null
    // Ensure enough slides for seamless looping
    const minSlides = 3
    const items = projects.length >= minSlides
        ? projects
        : Array.from({ length: minSlides }, (_, i) => projects[i % projects.length])
    return (
        <>
            <Swiper {...swiperOptions} className="theme_carousel owl-theme">
                {items.map((p, idx) => (
                    <SwiperSlide className="swiper-slide" key={p._id || idx}>
                        <img src={p.mainImage} alt={p.title} />
                        <div className="overlay-content">
                            <p>{p.category || ''}</p>
                            <h2><a href="#">{p.title}</a></h2>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
