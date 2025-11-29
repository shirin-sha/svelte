'use client'
import Link from "next/link"

export default function MobileMenu({ isSidebar, handleMobileMenu, handleSidebar }) {
    return (
        <>           
            {/*Mobile Menu */}
            <div className="mobile-menu">
                <nav className="menu-box">
                    <div className="close-btn" onClick={handleMobileMenu}><i className="fas fa-times"></i></div>
                    <div className="nav-logo">
                        <Link href="/"><img src="/assets/img/resource/logo-2.png" alt="Logo"/></Link>
                    </div>
                    <div className="menu-outer">
                        <ul className="navigation clearfix">
                            <li><Link href="/" onClick={handleMobileMenu}>HOME</Link></li>
                            <li><Link href="/about" onClick={handleMobileMenu}>ABOUT</Link></li>
                            <li className="menu-item-has-children"><Link href="/service" onClick={handleMobileMenu}>SERVICES</Link></li>
                            <li className="menu-item-has-children"><Link href="/blog" onClick={handleMobileMenu}>BLOG</Link></li>
                            <li className="menu-item-has-children"><Link href="/projects" onClick={handleMobileMenu}>PROJECTS</Link></li>
                            <li className="menu-item-has-children"><Link href="/clients" onClick={handleMobileMenu}>CLIENTS</Link></li>
                            <li><Link href="/contact" onClick={handleMobileMenu}>CONTACT</Link></li>
                        </ul>
                        {/*Here Menu Will Come Automatically Via Javascript / Same Menu as in Header */}
                    </div>
                    <div className="contact-info">
                        <div className="icon-box"><span className="icon-call"></span>
                        </div>
                        <p><Link href="tel:+91555585665"> 555-585665</Link></p>
                    </div>
                    <div className="social-links">
                        <ul className="clearfix list-wrap">
                            <li><Link href="#"><i className="fab fa-facebook-f"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-twitter"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-instagram"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-linkedin-in"></i></Link></li>
                            <li><Link href="#"><i className="fab fa-youtube"></i></Link></li>
                        </ul>
                    </div>
                </nav>
            </div>
            <div className="menu-backdrop" onClick={handleMobileMenu}></div>
            {/*End Mobile Menu */}
            {/* End Mobile Menu */}
            <div className="nav-overlay" style={{ display: `${isSidebar ? "block" : "none"}` }} onClick={handleSidebar} />
        </>
    )
}
