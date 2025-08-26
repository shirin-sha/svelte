import Link from "next/link"
// import { useRouter } from "next/router"

export default function Menu() {
    // const router = useRouter()

    return (
        <>
            <ul className="navigation">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About</Link></li>
                <li className="menu-item-has-children"><Link href="/service">Services</Link>
                </li>
                <li className="menu-item-has-children"><Link href="/blog">Blog</Link>
                    {/* <ul className="sub-menu">
                        <li><Link href="/blog">Blog</Link></li>
                        <li><Link href="/blog-sidebar">Blog Sidebar</Link></li>
                        <li><Link href="/blog-details">Blog Details</Link></li>
                    </ul> */}
                </li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>
        </>
    )
}
