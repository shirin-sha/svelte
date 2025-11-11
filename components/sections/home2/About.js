'use client'
import React, { useEffect, useState } from 'react';
import Link from "next/link"

export default function About() {
    const [content, setContent] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const res = await fetch('/api/content/pages/home/sections/about')
                if (res.ok) {
                    const section = await res.json()
                    let parsed = null
                    try {
                        parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                    } catch (_) {
                        parsed = null
                    }
                    setContent(parsed || null)
                }
            } catch (_) {
                setContent(null)
            } finally {
                setLoading(false)
            }
        }
        fetchAbout()
    }, [])
    return (
        <> 

    {/*Start About Two */}
        <section className="about-two">
            <div className="container">
                <div className="row">
                    {/*Start About Two Img */}
                    <div className="col-xl-6">
                        <div className="about-two__img">
                            <div className="about-two__img1 wow fadeInLeft" data-wow-delay="200ms"
                                data-wow-duration="1500ms">
                                <div className="inner">
                                    <img src={content?.image1 ?? undefined} alt=""/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End About Two Img */}

                    {/*Start About Two Content */}
                    <div className="col-xl-6">
                        <div className="about-two__content">
                            <div className="sec-title">
                                <div className="sub-title">
                                    <h5>{content?.subtitle || ''}</h5>
                                </div>
                                <h2>{(content?.title || '')}
                                <br/>
                                {(content?.title2 || '')}</h2>
                            </div>

                            <div className="about-two__content-text">
                                <p>{content?.description || ''}</p>
                            </div>

                            <div className="about-two__content-list">
                                <ul>
                                    {(content?.bullets || []).slice(0,3).map((text, idx) => (
                                        <li key={idx}>
                                            <p><span className="icon-verified"></span> {text}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="about-two__content-bottom">
                              

                                <div className="btn-box" style={{marginTop: '-15px'}}>
                                    {content?.buttonUrl ? (
                                        <Link className="thm-btn" href={content.buttonUrl}>
                                            <span className="txt">{content?.buttonText || ''}</span>
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*End About Two Content */}
                </div>
            </div>
        </section>
        {/*End About Two */}
        </>
    )
}
