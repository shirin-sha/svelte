import Link from "next/link"

const DEFAULTS = {
    about: {
        logoUrl: "assets/img/resource/logo-1.png",
        aboutText: "Svelte Contracting L.L.C specializes in interior design and fit-out solutions across Abu Dhabi, delivering elegant, functional, and sustainable spaces with precision craftsmanship and innovative design excellence.",
        socialLinks: [
            { label: "Ln", url: "#" },
            { label: "In", url: "#" },
            { label: "Fb", url: "#" },
            { label: "Bh", url: "#" }
        ]
    },
    nav: {
        title: "Navigation",
        showAbout: true,
        showServices: true,
        showProjects: true,
        showClients: true,
        showBlog: true,
        showContact: true
    },
    quick: {
        title: "Quick Link",
        showQuote: true,
        showVisit: true,
        showProfile: true,
        showHse: true,
        showPrivacy: true,
        showTerms: true
    },
    news: {
        title: "Newsletter",
        description: "Subscribe for design tips, project updates and news from Svelte.",
        placeholderEmail: "email@example.com"
    },
    bottom: {
        line1: "© 2025 Svelte Contracting LLC. All rights reserved.",
        line2: "Registered in Abu Dhabi, UAE. Trade license available on request."
    }
}

const SECTION_KEYS = [
    { key: "about", url: "/api/content/pages/footer/sections/about" },
    { key: "nav", url: "/api/content/pages/footer/sections/navigation" },
    { key: "quick", url: "/api/content/pages/footer/sections/quick-links" },
    { key: "news", url: "/api/content/pages/footer/sections/newsletter" },
    { key: "bottom", url: "/api/content/pages/footer/sections/bottom" }
]

const NAV_LINKS = [
    { key: "showAbout", label: "About Us", href: "/about" },
    { key: "showServices", label: "Services", href: "/services" },
    { key: "showProjects", label: "Projects", href: "/projects" },
    { key: "showClients", label: "Clients", href: "/clients" },
    { key: "showBlog", label: "Blog", href: "/blog" },
    { key: "showContact", label: "Contact Us", href: "/contact" }
]

const QUICK_LINKS = [
    { key: "showQuote", label: "Get a Quote", href: "/get-quote" },
    { key: "showVisit", label: "Book a Site Visit", href: "/book-site-visit" },
    { key: "showProfile", label: "Company Profile", href: "/download-profile" },
    { key: "showHse", label: "HSE Policy", href: "/hse-policy" },
    { key: "showPrivacy", label: "Privacy Policy", href: "/privacy-policy" },
    { key: "showTerms", label: "Terms of Use", href: "/terms-of-use" }
]

const parseContent = (payload) => {
    if (!payload?.content?.en) return null
    try {
        return JSON.parse(payload.content.en)
    } catch {
        return null
    }
}

async function fetchSections() {
    const results = await Promise.all(SECTION_KEYS.map(async ({ key, url }) => {
        try {
            const res = await fetch(url, { next: { revalidate: 60 } })
            if (!res.ok) return { key }
            const data = await res.json()
            return { key, data, parsed: parseContent(data) }
        } catch {
            return { key }
        }
    }))

    return results.reduce((acc, item) => {
        acc[item.key] = item
        return acc
    }, {})
}

export default async function Footer1() {
    const sections = await fetchSections()

    const about = {
        ...DEFAULTS.about,
        ...(sections.about?.parsed ? {
            logoUrl: sections.about.parsed.logoUrl || DEFAULTS.about.logoUrl,
            aboutText: sections.about.parsed.aboutText || DEFAULTS.about.aboutText,
            socialLinks: Array.isArray(sections.about.parsed.socialLinks) && sections.about.parsed.socialLinks.length
                ? sections.about.parsed.socialLinks
                : DEFAULTS.about.socialLinks
        } : {})
    }

    const navContent = {
        ...DEFAULTS.nav,
        ...(sections.nav?.parsed || {})
    }
    const navTitle = sections.nav?.data?.title?.en || DEFAULTS.nav.title

    const quickContent = {
        ...DEFAULTS.quick,
        ...(sections.quick?.parsed || {})
    }
    const quickTitle = sections.quick?.data?.title?.en || DEFAULTS.quick.title

    const news = {
        ...DEFAULTS.news,
        title: sections.news?.data?.title?.en || DEFAULTS.news.title,
        description: sections.news?.data?.description?.en || DEFAULTS.news.description,
        placeholderEmail: sections.news?.parsed?.placeholderEmail || DEFAULTS.news.placeholderEmail
    }

    const bottom = {
        line1: sections.bottom?.parsed?.line1 || DEFAULTS.bottom.line1,
        line2: sections.bottom?.parsed?.line2 || DEFAULTS.bottom.line2
    }

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
                                        <Link href="/"><img src={about.logoUrl || DEFAULTS.about.logoUrl} alt=""/></Link>
                                    </div>

                                    <div className="footer-widget__about-inner">
                                        <div className="text-box">
                                            {about.aboutText}
                                        </div>
                                        <div className="footer-social-link">
                                            {about.socialLinks.map((item, idx) => (
                                                <Link href={item.url || '#'} key={`${item.label}-${idx}`}>
                                                    {item.label || `Link ${idx + 1}`}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-2 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".2s">
                                <div className="single-footer-widget footer-widget__links">
                                    <div className="title">
                                        <h2>{navTitle}</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            {NAV_LINKS.filter(link => navContent[link.key]).map(link => (
                                                <li key={link.key}><Link href={link.href}>{link.label}</Link></li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-3 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".3s">
                                <div className="single-footer-widget footer-widget__links quick-link">
                                    <div className="title">
                                        <h2>{quickTitle}</h2>
                                    </div>

                                    <div className="footer-widget__links-box">
                                        <ul>
                                            {QUICK_LINKS.filter(link => quickContent[link.key]).map(link => (
                                                <li key={link.key}><Link href={link.href}>{link.label}</Link></li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            {/*End Single Footer Widget */}

                            {/*Start Single Footer Widget */}
                            <div className="col-xl-4 col-lg-6 col-md-6 wow fadeInUp" data-wow-delay=".4s">
                                <div className="single-footer-widget footer-widget__newsletter">
                                    <div className="title">
                                        <h2>{news.title}</h2>
                                    </div>

                                    <div className="footer-widget__newsletter-box">
                                        <div className="footer-widget__newsletter-text">
                                            <p>{news.description}</p>
                                        </div>

                                        <form className="footer-widget__newsletter-form">
                                            <div className="input-box">
                                                <input type="email" placeholder={news.placeholderEmail} name="email"/>
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
                                <p>{bottom.line1}<br/>
                                {bottom.line2}</p>
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