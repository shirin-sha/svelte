'use client'
import { useState, useEffect } from 'react'
import Link from "next/link"
import CounterUp from "@/components/elements/CounterUp"

export default function Contact() {
    const [contactData, setContactData] = useState({
        formTitle: 'WE READY TO HELP',
        formSubtitle: 'Have Any Question?',
        submitButtonText: 'SEND YOUR MESSAGE',
        backgroundImage: 'assets/img/background/contact-v1-bg.jpg',
        counter1: {
            number: 48,
            text: 'Designers and developers'
        },
        counter2: {
            number: 256,
            text: 'Awards for digital art work'
        }
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchContactData()
    }, [])

    const fetchContactData = async () => {
        try {
            const res = await fetch('/api/content/pages/home/sections/contact')
            if (res.ok) {
                const section = await res.json()
                let parsed = null
                try {
                    parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                } catch (_) {
                    parsed = null
                }
                if (parsed) {
                    setContactData(prev => ({
                        ...prev,
                        formTitle: parsed.formTitle || prev.formTitle,
                        formSubtitle: parsed.formSubtitle || prev.formSubtitle,
                        submitButtonText: parsed.submitButtonText || prev.submitButtonText,
                        backgroundImage: parsed.backgroundImage || prev.backgroundImage,
                        counter1: parsed.counter1 || prev.counter1,
                        counter2: parsed.counter2 || prev.counter2
                    }))
                }
            }
        } catch (e) {
            console.error('Error fetching contact section data:', e)
        } finally {
            setLoading(false)
        }
    }

 
    return (
        <>
        {/*Start Contact One */}
        <section className="contact-one">
            <div className="contact-one__bg" style={{backgroundImage: `url(${contactData.backgroundImage})`}}>
                <div className="contact-one__counter">
                    <ul>
                        <li>
                            <div className="content-box">
                                <h2 className="count"><CounterUp end={contactData.counter1.number} /> <span
                                        className="plus">+</span>
                                </h2>
                                <p dangerouslySetInnerHTML={{ __html: contactData.counter1.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        </li>
                        <li>
                            <div className="content-box">
                                <h2 className="count"><CounterUp end={contactData.counter2.number} /> <span
                                        className="plus">%</span>
                                </h2>
                                <p dangerouslySetInnerHTML={{ __html: contactData.counter2.text.replace(/\n/g, '<br/>') }} />
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="contact-one__pattern" style={{backgroundImage: 'url(assets/img/pattern/contact-v1-pattern.jpg)'}}>
            </div>
            
            <div className="container clearfix">
                <div className="contact-one__inner">
                    <div className="contact-one__form wow animated fadeInRight" data-wow-delay="0.1s">
                        <div className="title-box">
                            <p>{contactData.formTitle}</p>
                            <h2>{contactData.formSubtitle}</h2>
                        </div>

                        <form method="post" action="/">
                            <div className="form-group">
                                <input type="text" name="username" placeholder="Your Name" required=""/>
                            </div>
                            <div className="form-group">
                                <input type="email" placeholder="Email Address"  name="form_email" required=""/>
                            </div>
                            <div className="form-group">
                                <input type="text" name="phone" placeholder="Phone Number" required=""/>
                            </div>
                            <div className="form-group">
                                <textarea placeholder="Write Your Message"></textarea>
                            </div>
                            <div className="row">
                                <div className="col-xl-12">
                                    <div className="button-box">
                                        <button className="thm-btn" type="submit" data-loading-text="Please wait...">
                                            <span className="txt">
                                                {contactData.submitButtonText}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </section>
        {/*End Contact One */}
        </>
    )
}
