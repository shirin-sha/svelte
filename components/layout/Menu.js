import Link from "next/link"
// import { useRouter } from "next/router"

export default function Menu() {
    // const router = useRouter()

    return (
        <>
            <ul className="navigation">
                <li><Link href="/">HOME</Link></li>
                <li><Link href="/about">ABOUT</Link></li>
                <li className="menu-item-has-children"><Link href="/service">SERVICES</Link>
                </li>

                <li className="menu-item-has-children"><Link href="/blog">BLOG</Link>
             
                    {/* <ul className="sub-menu">
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/blog-sidebar">Blog Sidebar</Link></li>
                        <li><Link href="/blog-details">Blog Details</Link></li>
                    </ul> */}
                </li>   <li className="menu-item-has-children"><Link href="/projects">PROJECTS</Link></li>
                <li className="menu-item-has-children"><Link href="/clients">CLIENTS</Link></li>
                <li><Link href="/contact">CONTACT</Link></li>
            </ul>
        </>
    )
}
