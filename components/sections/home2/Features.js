"use client"
import { useEffect, useState } from "react"

export default function Features() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/content/pages/home/sections/features')
            if (res.ok) {
                const section = await res.json()
                let parsed = null
                try {
                    parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                } catch (_) {
                    parsed = null
                }
                const dynamicItems = parsed?.items || [
                    { title: 'Creative Solution', iconClass: 'icon-solution' },
                    { title: 'Minimal Architect', iconClass: 'icon-blueprint' },
                    { title: 'Redesign Dream', iconClass: 'icon-office-building' }
                ]
                setItems(dynamicItems.slice(0, 6))
            } else {
                setItems([
                    { title: 'Creative Solution', iconClass: 'icon-solution' },
                    { title: 'Minimal Architect', iconClass: 'icon-blueprint' },
                    { title: 'Redesign Dream', iconClass: 'icon-office-building' }
                ])
            }
        } catch (e) {
            setItems([
                { title: 'Creative Solution', iconClass: 'icon-solution' },
                { title: 'Minimal Architect', iconClass: 'icon-blueprint' },
                { title: 'Redesign Dream', iconClass: 'icon-office-building' }
            ])
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <section className="feauture-one">
                <div className="container">
                    <div className="row">
                        {[0,1,2].map(idx => (
                            <div className="col-xl-4 col-lg-4" key={idx}>
                                <div className="feauture-one__single" style={{ opacity: 0.7 }}>
                                    <div className="feauture-one__single-text">
                                        <div style={{ height: 12, width: 140, background: '#e5e7eb', borderRadius: 6, marginBottom: 12 }}></div>
                                        <div style={{ height: 28, width: 200, background: '#e5e7eb', borderRadius: 6 }}></div>
                                    </div>
                                    <div className="feauture-one__single-bottom">
                                        <div className="btn-box">
                                            <span style={{ display: 'inline-block', height: 36, width: 36, background: '#e5e7eb', borderRadius: 18 }}></span>
                                        </div>
                                        <div className="icon-box">
                                            <span style={{ display: 'inline-block', height: 36, width: 36, background: '#e5e7eb', borderRadius: 8 }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="feauture-one">
                <div className="container">
                    <div className="row">
                        {items.map((item, index) => (
                            <div
                                key={`${item.title}-${index}`}
                                className={`col-xl-4 col-lg-4 wow ${index % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}`}
                                data-wow-delay={`${index * 100}ms`}
                                data-wow-duration="1500ms"
                            >
                                <div className="feauture-one__single">
                                    <div className="feauture-one__single-text">
                                        <p>EXPLORE FEATURE</p>
                                        <h2><a href="#">{item.title}</a></h2>
                                    </div>
                                    <div className="feauture-one__single-bottom">
                                        <div className="btn-box">
                                            <a href="#"><span className="icon-plus"></span></a>
                                        </div>
                                        <div className="icon-box">
                                            <span className={item.iconClass}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
