'use client';
import Link from "next/link";
import { useState, useEffect } from 'react';

export default function Footer1() {
    const [footerSections, setFooterSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFooterSections();
    }, []);

    const fetchFooterSections = async () => {
        try {
            const response = await fetch('/api/content/footer');
            if (response.ok) {
                const data = await response.json();
                setFooterSections(data);
            }
        } catch (error) {
            console.error('Error fetching footer sections:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSectionByType = (type) => {
        return footerSections.find(section => section.section === type);
    };

    const companySection = getSectionByType('company');
    const servicesSection = getSectionByType('services');
    const contactSection = getSectionByType('contact');
    const socialSection = getSectionByType('social');


    return (
        <>
            {/*Start Footer One */}
            <footer className="footer-one">
                <div className="shape1"><img className="float-bob-y" src="assets/img/shape/footer-v1-shape1.png" alt=""/></div>
                {/*Start Footer Main */}
                <div className="footer-main">
                    <div className="container">
                        <div className="row">
                            {/*Start Single Footer Widget */}
                            <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".1s">
                                <div className="single-footer-widget footer-widget__about">
                                    <div className="logo-box">
                                        <Link href="/"><img src="assets/img/resource/logo-1.png" alt=""/></Link>
                                    </div>

                                    <div className="footer-widget__about-inner">
                                        <div className="text-box">
                                            <p>{companySection?.content || 'Address 301 Princes Street, Ei class Mahall Damietta Egypt-104'}</p>
                                        </div>
                                        <div className="number-box">
                                            <Link href={`tel:${contactSection?.contactInfo?.phone || '123456789'}`}>
                                                {contactSection?.contactInfo?.phone || '+1 343 5335 3545'}
                                            </Link>
                                        </div>
                                        <div className="footer-social-link">
                                            {socialSection?.socialLinks?.map((link, index) => (
                                                <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                                                    {link.icon || link.platform}
                                                </Link>
                                            )) || (
                                                <>
                                                    <Link href="#">tw</Link>
                                                    <Link href="#">in</Link>
                                                    <Link href="#">db</Link>
                                                    <Link href="#">ig</Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-2 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                                <div className="single-footer-widget footer-widget__links">
                                    <div className="title">
                                        <h2>{companySection?.title || 'Navigation'}</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            {companySection?.links?.map((link, index) => (
                                                <li key={index}><Link href={link.url}>{link.text}</Link></li>
                                            )) || (
                                                <>
                                                    <li><Link href="/">Home</Link></li>
                                                    <li><Link href="/about">About Us</Link></li>
                                                    <li><Link href="/service">Services</Link></li>
                                                    <li><Link href="/contact">Contact Us</Link></li>
                                                    <li><Link href="/blog">Our Blog</Link></li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-footer-widget footer-widget__links quick-link">
                                    <div className="title">
                                        <h2>{servicesSection?.title || 'Quick Link'}</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            {servicesSection?.links?.map((link, index) => (
                                                <li key={index}><Link href={link.url}>{link.text}</Link></li>
                                            )) || (
                                                <>
                                                    <li><Link href="/contact">Help</Link></li>
                                                    <li><Link href="/contact">Support</Link></li>
                                                    <li><Link href="/contact">Clients</Link></li>
                                                    <li><Link href="/projects">Portfolio</Link></li>
                                                </>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                                <div className="single-footer-widget footer-widget__newsletter">
                                    <div className="title">
                                        <h2>Newsletter</h2>
                                    </div>

                                    <div className="footer-widget__newsletter-box">
                                        <div className="footer-widget__newsletter-text">
                                            <p>Subscribe our newsletter to get the <br/>
                                                latest news & updates</p>
                                        </div>

                                        <form className="footer-widget__newsletter-form">
                                            <div className="input-box">
                                                <input type="email" placeholder="email@example.com" name="email"/>
                                                <button type="submit" className="footer-widget__newsletter-form-btn"><i
                                                        className="icon-telegram"></i>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}
                        </div>
                    </div>
                </div>
                {/*End Footer Main */}

                {/*Start Footer Bottom */}
                <div className="footer-bottom">
                    <div className="container">
                        <div className="footer-bottom__inner">
                            <div className="footer-bottom__text text-center">
                                <p>Copyright © 2025 Xafran by <Link href="https://themeforest.net/user/starplate">Starplate.</Link> All Rights Reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/*End Footer Bottom */}
            </footer>
            {/*End Footer One */}
        </>
    )
}
