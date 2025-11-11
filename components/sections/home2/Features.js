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
                const dynamicItems = (parsed?.items || [
                    { title: 'Creative Design', subtitle: 'Tailored concepts that reflect your brand and lifestyle.', iconClass: 'fas fa-drafting-compass', link: '/about' },
                    { title: 'Expert Fit-Out', subtitle: 'Quality craftsmanship with rigorous QA/QC at every stage.', iconClass: 'fas fa-tools', link: '/service' },
                    { title: 'On-Time Delivery', subtitle: 'Clear schedules, proactive, zero surprises.', iconClass: 'fas fa-calendar-check', link: '/projects' }
                ]).map(item => ({
                    title: item.title || '',
                    subtitle: item.subtitle || '',
                    iconClass: item.iconClass || 'fas fa-circle',
                    link: item.link || '#'
                }))
                setItems(dynamicItems.slice(0, 6))
            } else {
                setItems([
                    { title: 'Creative Design', subtitle: 'Tailored concepts that reflect your brand and lifestyle.', iconClass: 'fas fa-drafting-compass', link: '/about' },
                    { title: 'Expert Fit-Out', subtitle: 'Quality craftsmanship with rigorous QA/QC at every stage.', iconClass: 'fas fa-tools', link: '/service' },
                    { title: 'On-Time Delivery', subtitle: 'Clear schedules, proactive, zero surprises.', iconClass: 'fas fa-calendar-check', link: '/projects' }
                ])
            }
        } catch (e) {
            setItems([
                { title: 'Creative Design', subtitle: 'Tailored concepts that reflect your brand and lifestyle.', iconClass: 'fas fa-drafting-compass', link: '/about' },
                { title: 'Expert Fit-Out', subtitle: 'Quality craftsmanship with rigorous QA/QC at every stage.', iconClass: 'fas fa-tools', link: '/service' },
                { title: 'On-Time Delivery', subtitle: 'Clear schedules, proactive, zero surprises.', iconClass: 'fas fa-calendar-check', link: '/projects' }
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
                        {items.map((item, idx) => (
                            <div className={`col-xl-4 col-lg-4 wow ${idx % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'}`} data-wow-delay={`${idx * 100}ms`} data-wow-duration="1500ms" key={idx}>
                            <div className="feauture-one__single">
                                <div className="feauture-one__single-text">
                                        <p>{item.title}</p>
                                        <h2><a href="#" style={{ whiteSpace: 'pre-line' }}>{(item.subtitle || '').replace(/\\n/g, '\n')}</a></h2>
                                    </div>
                                <div className="feauture-one__single-bottom">
                                    <div className="btn-box">
                                            <a href={item.link || '#'}><span className="icon-plus"></span></a>
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
