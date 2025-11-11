'use client'
import { useEffect, useState } from 'react'

export default function OurPromise() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content/pages/about/sections/our-promise', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    let parsed = null
                    try {
                        parsed = data?.content?.en ? JSON.parse(data.content.en) : null
                    } catch (_) {
                        parsed = null
                    }
                    if (parsed?.items && Array.isArray(parsed.items)) {
                        setItems(parsed.items.map(i => ({
                            icon: i.icon || '',
                            title: i.title || '',
                            description: i.description || ''
                        })))
                    } else {
                        setItems([])
                    }
                }
            } catch (_) {
                setItems([])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return null
    if (!items || items.length === 0) return null

    return (
        <section className="service-one">
            <div className="service-one__shape2" style={{backgroundImage: 'url(assets/img/shape/service-v1-shape2.png)'}}>
            </div>
            <div className="container">
                <div className="sec-title text-center">
                    <div className="sub-title">
                        <h5>OUR PROMISE</h5>
                    </div>
                    <h2>What You Can Expect from Svelte</h2>
                </div>
                <div className="row">
                    {items.map((it, idx) => (
                        // <div className={`col-xl-6 col-lg-6 wow animated fadeInUp`} data-wow-delay={`${(idx % 2 === 0) ? '0.1s' : '0.2s'}`} key={idx}>
                        //     <div className="service-one__single">
                        //         <div className="shape1"><img src="assets/img/shape/service-v1-shape1.png" alt=""/></div>
                        //         <div className="service-one__single-inner">
                        //             <div className="count-text" style={{ position: 'relative', zIndex: 1 }}>{String(idx + 1).padStart(2, '0')}</div>
                        //             <div className="icon-box">
                        //                 <span className={it.icon}></span>
                        //             </div>
                        //             <div className="content-box">
                        //                 {it.title ? (<h2>{it.title}</h2>) : null}
                        //                 {it.description ? (<p style={{ margin: 0 }}>{it.description}</p>) : null}
                        //             </div>
                        //         </div>
                        //     </div>
                        // </div>
                        <div className="col-xl-6 col-lg-6 wow animated fadeInUp" data-wow-delay="0.1s">
                        <div className="service-one__single">
                            <div className="shape1"><img src="assets/img/shape/service-v1-shape1.png" alt=""/></div>
                            <div className="service-one__single-inner">
                                <div className="count-text">{String(idx + 1).padStart(2, '0')}</div>
                                <div className="icon-box">
                                    <span className={it.icon}></span>
                                </div>
                                <div className="content-box">
                               
                                        {it.title ? (<h2 style={{ color: '#fff' }}>{it.title}</h2>) : null}
                                    {it.description ? (<p style={{ margin: 0 }}>{it.description}</p>) : null}
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


