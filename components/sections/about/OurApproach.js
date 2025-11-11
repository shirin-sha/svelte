'use client'
import Link from "next/link"
import { useEffect, useState } from 'react'

export default function OurApproach() {
    const [subtitle, setSubtitle] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image1, setImage1] = useState('')
    const [buttonText, setButtonText] = useState('')
    const [buttonUrl, setButtonUrl] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/content/pages/about/sections/our-approach', { cache: 'no-store' })
                if (res.ok) {
                    const data = await res.json()
                    setSubtitle(data?.subtitle?.en || '')
                    setTitle(data?.title?.en || '')
                    let parsed = null
                    try {
                        parsed = data?.content?.en ? JSON.parse(data.content.en) : null
                    } catch (_) {
                        parsed = null
                    }
                    setDescription(parsed?.description || '')
                    setImage1(parsed?.image1 || '')
                    setButtonText(parsed?.buttonText || '')
                    setButtonUrl(parsed?.buttonUrl || '')
                }
            } catch (_) {
                // ignore
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) return null
    if (!subtitle && !title && !description && !image1) return null

    return (
        <section className="feauture-three">
            <div className="shape1 float-bob-y"><img src="assets/img/shape/feauture-v3-shape1.png" alt=""/></div>
            <div className="container">
                <div className="row">
                    {/*Start Feauture Three Img */}
                    <div className="col-xl-5 wow animated fadeInLeft" data-wow-delay="0.1s">
                        <div className="feauture-three__img">
                            <div className="inner clearfix">
                                {image1 ? (
                                    <img src={image1} alt=""/>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    {/*End Feauture Three Img */}

                    {/*Start Feauture Three Content */}
                    <div className="col-xl-7">
                        <div className="feauture-three__content">
                            {(subtitle || title) && (
                                <div className="sec-title">
                                    {subtitle ? (
                                        <div className="sub-title">
                                            <h5>{subtitle}</h5>
                                        </div>
                                    ) : null}
                                    {title ? (<h2>{title}</h2>) : null}
                                </div>
                            )}

                            {description ? (
                                <div className="text-box">
                                    <p>{description}</p>
                                </div>
                            ) : null}
                            {(buttonText && buttonUrl) ? (
                                <div className="btn-box">
                                    <Link className="thm-btn" href={buttonUrl}>
                                        <span className="txt">{buttonText}</span>
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    {/*End Feauture Three Content */}
                </div>
            </div>
        </section>
    )
}


