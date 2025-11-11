import Link from "next/link"

export default function Footer1() {
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
                                        <div className="text-box">Svelte Contracting L.L.C specializes in interior design and fit-out solutions across Abu Dhabi, delivering elegant, functional, and sustainable spaces with precision craftsmanship and innovative design excellence.
                                        </div>
                                        <div className="footer-social-link">
                                            <Link href="#">Ln</Link>
                                            <Link href="#">In</Link>
                                            <Link href="#">Fb</Link>
                                            <Link href="#">Bh</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-2 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                                <div className="single-footer-widget footer-widget__links">
                                    <div className="title">
                                        <h2>Navigation</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            <li><Link href="/about">About Us</Link></li>
                                            <li><Link href="/services">Services</Link></li>
                                            <li><Link href="/projects">Projects</Link></li>
                                            <li><Link href="/clients">Clients</Link></li>
                                            <li><Link href="/blog">Blog</Link></li>
                                            <li><Link href="/contact">Contact Us</Link></li>
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-footer-widget footer-widget__links quick-link">
                                    <div className="title">
                                        <h2>Quick Link</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            <li><Link href="/get-quote">Get a Quote</Link></li>
                                            <li><Link href="/book-site-visit">Book a Site Visit</Link></li>
                                            <li><Link href="/download-profile">Company Profile</Link></li>
                                            <li><Link href="/hse-policy">HSE Policy</Link></li>
                                            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                                            <li><Link href="/terms-of-use">Terms of Use</Link></li>
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
                                            <p>Subscribe for design tips, project updates and news from Svelte.</p>
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
                                <p>© 2025 Svelte Contracting LLC. All rights reserved.<br/>
                                Registered in Abu Dhabi, UAE. Trade license available on request.</p>
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
