 'use client'
import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { useEffect, useState } from 'react'
export default function Home() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState({
        title: '',
        description: '',
        subtitle: '',
        addressLabel: '',
        address: '',
        addressIcon: 'icon-pin',
        phoneLabel: '',
        phone: '',
        phoneIcon: 'icon-phone',
        emailLabel: '',
        email: '',
        emailIcon: 'icon-envelope',
        mapEmbedUrl: ''
    })
    const [formSection, setFormSection] = useState({ 
        title: '', 
        description: '',
        namePlaceholder: '',
        emailPlaceholder: '',
        phonePlaceholder: '',
        subjectPlaceholder: '',
        messagePlaceholder: '',
        buttonText: ''
    })
    useEffect(() => {
        const fetchContact = async () => {
            try {
                const res = await fetch('/api/content/pages/contact/sections/getintouch', { cache: 'no-store' })
                if (res.ok) {
                    const json = await res.json()
                    const subtitle = json?.subtitle?.en || ''
                    const title = json?.title?.en || ''
                    let parsed = null
                    try { parsed = json?.content?.en ? JSON.parse(json.content.en) : null } catch (_) { parsed = null }
                    setData({
                        title,
                        description: parsed?.description || '',
                        subtitle,
                        addressLabel: parsed?.addressLabel || 'Address',
                        address: parsed?.address || '',
                        addressIcon: parsed?.addressIcon || 'icon-pin',
                        phoneLabel: parsed?.phoneLabel || 'Phone',
                        phone: parsed?.phone || '',
                        phoneIcon: parsed?.phoneIcon || 'icon-phone',
                        emailLabel: parsed?.emailLabel || 'Email',
                        email: parsed?.email || '',
                        emailIcon: parsed?.emailIcon || 'icon-envelope',
                        mapEmbedUrl: parsed?.mapEmbedUrl || ''
                    })
                }
                const resForm = await fetch('/api/content/pages/contact/sections/contact-form', { cache: 'no-store' })
                if (resForm.ok) {
                    const json2 = await resForm.json()
                    let parsed2 = null
                    try { parsed2 = json2?.content?.en ? JSON.parse(json2.content.en) : null } catch (_) { parsed2 = null }
                    setFormSection({
                        title: json2?.title?.en || '',
                        description: json2?.description?.en || '',
                        namePlaceholder: parsed2?.namePlaceholder || 'Your Name*',
                        emailPlaceholder: parsed2?.emailPlaceholder || 'Your Email*',
                        phonePlaceholder: parsed2?.phonePlaceholder || 'Phone*',
                        subjectPlaceholder: parsed2?.subjectPlaceholder || 'Subject*',
                        messagePlaceholder: parsed2?.messagePlaceholder || 'Write Message*',
                        buttonText: parsed2?.buttonText || 'SEND MESSAGE'
                    })
                }
            } finally {
                setLoading(false)
            }
        }
        fetchContact()
    }, [])

    return (
        <>
            <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Contact Us">
                <div>
                {/*Start Contact Page */}
                <section className="contact-page">
                    <div className="contact-page__top">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-6 col-lg-6">
                                    <div className="contact-page__top-content">
                                        <div className="contact-page__top-content-top">
                                          <h2>{data.title}</h2>
                                          <p>{data.description}</p>
                                        </div>

                                        <div className="contact-page__top-content-bottom">
                                          <h2>{data.subtitle}</h2>
                                            <ul>
                                                <li>
                                                    <div className="inner">
                                                        <div className="icon-box">
                                                            <span className={data.addressIcon}></span>
                                                        </div>

                                                        <div className="content-box">
                                                            <h4>{data.addressLabel || 'Address'}</h4>
                                                            <p>{data.address}</p>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li>
                                                    <div className="inner">
                                                        <div className="icon-box">
                                                            <span className={data.phoneIcon}></span>
                                                        </div>

                                                        <div className="content-box">
                                                            <h4>{data.phoneLabel || 'Phone'}</h4>
                                                            <p><a href={`tel:${data.phone}`}>{data.phone}</a></p>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li>
                                                    <div className="inner">
                                                        <div className="icon-box">
                                                            <span className={data.emailIcon}></span>
                                                        </div>

                                                        <div className="content-box">
                                                            <h4>{data.emailLabel || 'Email'}</h4>
                                                            <p><a href={`mailto:${data.email}`}>{data.email}</a></p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-6 col-lg-6">
                                    <div className="contact-page__google-map">
                                      
                                            <iframe
                                                src={data.mapEmbedUrl}
                                                className="contact-page-google-map__one"
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-page__bottom">
                        {/*Start Contact Two */}
                        <div className="contact-two">
                            <div className="container">
                                <div className="contact-two__inner">
                                    <div className="title-box">
                                        {formSection.title ? (<h2>{formSection.title}</h2>) : (<h2>Let’s Get in Touch</h2>)}
                                        {formSection.description ? (
                                            <p>{formSection.description}</p>
                                        ) : (
                                            <p>Your email address will not be published. Required fields are marked *</p>
                                        )}
                                    </div>
                                    <div className="contact-two__inner-box">
                                        <form action="/"
                                            className="contact-page__form contact-form-validated">
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="contact-page__input-box">
                                                        <input type="text" placeholder={formSection.namePlaceholder || 'Your Name*'} name="name"/>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="contact-page__input-box">
                                                        <input type="email" placeholder={formSection.emailPlaceholder || 'Your Email*'} name="email"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="contact-page__input-box">
                                                        <input type="text" placeholder={formSection.phonePlaceholder || 'Phone*'} name="phone"/>
                                                    </div>
                                                </div>
                                                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                                    <div className="contact-page__input-box">
                                                        <input type="text" placeholder={formSection.subjectPlaceholder || 'Subject*'} name="subject"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                                    <div className="contact-page__input-box">
                                                        <textarea name="message" placeholder={formSection.messagePlaceholder || 'Write Message*'}></textarea>
                                                    </div>
                                                    <div className="contact-page__btn">
                                                        <button className="thm-btn" type="submit"
                                                            data-loading-text="Please wait...">
                                                            <span className="txt">
                                                                {formSection.buttonText || 'SEND MESSAGE'}
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*End Contact Two */}
                    </div>
                </section>
                {/*End Contact Page */}
                </div>

            </Layout>
        </>
    )
}