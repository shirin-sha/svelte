'use client'
import Link from "next/link"
import { useState, useEffect } from "react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

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
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/content/project/latest');
                const data = await response.json();
                if (data.projects) {
                    setProjects(data.projects);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Default projects if no data is available
    const defaultProjects = [
        {
            title: "Hotel Joshna Villa",
            location: "San Fransisco",
            mainImage: "assets/img/project/project-v2-img1.jpg"
        },
        {
            title: "Hotel Joshna Villa", 
            location: "San Fransisco",
            mainImage: "assets/img/project/project-v2-img2.jpg"
        },
        {
            title: "Hotel Joshna Villa",
            location: "San Fransisco", 
            mainImage: "assets/img/project/project-v2-img3.jpg"
        }
    ];

    const displayProjects = projects.length > 0 ? projects : defaultProjects;

    return (
        <>
            <Swiper {...swiperOptions} className="theme_carousel owl-theme">
                {displayProjects.map((project, index) => (
                    <SwiperSlide key={project._id || index} className="swiper-slide">
                        <img src={project.mainImage} alt={project.title} />
                        <div className="overlay-content">
                            <p>{project.location}</p>
                            <h2><a href="#">{project.title}</a></h2>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </>
    )
}
