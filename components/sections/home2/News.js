'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"


export default function News() {
    const [sectionData, setSectionData] = useState({
        subtitle: '',
        title: ''
    })
    const [blogPosts, setBlogPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchSectionData()
        fetchBlogPosts()
    }, [])

    const fetchSectionData = async () => {
        try {
            const res = await fetch('/api/content/pages/home/sections/blog')
            if (res.ok) {
                const section = await res.json()
                let parsed = null
                try {
                    parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                } catch (_) {
                    parsed = null
                }
                if (parsed) {
                    setSectionData(prev => ({
                        ...prev,
                        subtitle: parsed.subtitle || prev.subtitle,
                        title: parsed.title || prev.title
                    }))
                }
            }
        } catch (e) {
            console.error('Error fetching news section data:', e)
        }
    }

    const fetchBlogPosts = async () => {
        try {
            const res = await fetch('/api/content/blog')
            if (res.ok) {
                const posts = await res.json()
                const latestPosts = posts
                  .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
                  .slice(0, 3)
                setBlogPosts(latestPosts)
            }
        } catch (e) {
            console.error('Error fetching blog posts:', e)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="blog-one" style={{ minHeight: '400px' }}>
                <div className="container">
                    <div className="sec-title text-center">
                        <div className="sub-title">
                            <div style={{ height: 20, width: 200, background: '#e5e7eb', borderRadius: 4, margin: '0 auto 16px' }}></div>
                        </div>
                        <div style={{ height: 40, width: '80%', background: '#e5e7eb', borderRadius: 6, margin: '0 auto' }}></div>
                    </div>
                    <div className="row">
                        <div className="col-xl-4 col-lg-4">
                            <div style={{ height: 300, background: '#e5e7eb', borderRadius: 8 }}></div>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                            <div style={{ height: 300, background: '#e5e7eb', borderRadius: 8 }}></div>
                        </div>
                        <div className="col-xl-4 col-lg-4">
                            <div style={{ height: 300, background: '#e5e7eb', borderRadius: 8 }}></div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <> 

        {/*Start Blog One */}
        <section className="blog-one">
            <div className="container">
                <div className="sec-title text-center">
                    <div className="sub-title">
                        <h5>{sectionData.subtitle}</h5>
                    </div>
                    <h2>{sectionData.title}</h2>
                </div>

                <div className="row">
                    {blogPosts.length === 0 ? (
                        <div className="col-12" style={{ textAlign: 'center', padding: '40px 0' }}>
                            <p style={{ color: '#6b7280', fontSize: '16px' }}>No blog posts available at the moment.</p>
                        </div>
                    ) : (
                        blogPosts.map((post, index) => {
                            const delay = index * 100; // Stagger animation delays
                            const animationClass = index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight';
                            const formattedDate = post.publishedAt || post.createdAt ? new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }) : 'Recent';
                            
                            return (
                                <div 
                                    key={post._id} 
                                    className={`col-xl-4 col-lg-4 wow ${animationClass}`} 
                                    data-wow-delay={`${delay}ms`} 
                                    data-wow-duration="1500ms"
                                >
                                    <div className="blog-one__single">
                                        <div className="blog-one__single-img">
                                            <div className="inner">
                                                <img 
                                                    src={post.imageUrl } 
                                                    alt={post.title}
                                                />
                                                <div className="overlay-icon">
                                                    <Link href={`/blog/${post._id}`}>
                                                        <span className="icon-plus"></span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="blog-one__single-content">
                                            <ul className="meta-info">
                                                <li>
                                                    <p>
                                                        <Link href="#">{post.category || 'General'}</Link>
                                                    </p>
                                                </li>
                                                <li>
                                                    <p>{formattedDate}</p>
                                                </li>
                                            </ul>
                                            <h2>
                                                <Link href={`/blog/${post._id}`}>
                                                    {post.title}
                                                </Link>
                                            </h2>
                                            <div className="btn-box">
                                                <Link href={`/blog/${post._id}`}>
                                                    READ MORE <span className="icon-left-arrow"></span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </section>
        {/*End Blog One */}


        </>
    )
}
