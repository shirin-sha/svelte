import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from 'next/navigation'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

async function getBlog(id) {
  try {
    const response = await fetch(`${BASE_URL}/api/content/blog/${id}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching blog:', error);
  }
  return null;
}

async function getServices() {
  try {
    const response = await fetch(`${BASE_URL}/api/content/service`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
  return [];
}

async function getRecentBlogs(currentId) {
  try {
    const response = await fetch(`${BASE_URL}/api/content/blog`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const blogs = await response.json();
      return blogs
        .filter(blog => blog._id !== currentId)
        .sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt))
        .slice(0, 3);
    }
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
  }
  return [];
}

export default async function BlogDetailsPage({ params }) {
  const [blog, services, recentBlogs] = await Promise.all([
    getBlog(params.id),
    getServices(),
    getRecentBlogs(params.id)
  ]);
  
  if (!blog) {
    notFound();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <Layout headerStyle={2} footerStyle={1} breadcrumbTitle={'fdsfds'}>
        {/*Start Blog Details */}
        <section className="blog-details">
          <div className="container">
            <div className="row">
              {/*Start Blog Sidebar Content */}
              <div className="col-xl-8">
                <div className="blog-details__content">
                  <div className="blog-details__content-img1">
                    <img src={blog.imageUrl} alt={blog.title} />
                  </div>

                  <div className="blog-details__content-text1">
                    <h2>{blog.title}</h2>
                    <p className="text1">
                      {formatDate(blog.publishedAt || blog.createdAt)} _ {blog.category}
                    </p>
                    <div 
                      className="text2"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>
                </div>
              </div>
              {/*End Blog Sidebar Content */}

              {/*Start Sidebar */}
              <div className="col-xl-4">
                <div className="sidebar">
               
                  {/*End Sidebar Single */}

                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__category">
                    <h3 className="sidebar__title">Services</h3>

                    <ul className="sidebar__category-list">
                      {services.length === 0 ? (
                        <li style={{ color: '#6b7280' }}>No services available</li>
                      ) : (
                        services.map(service => (
                          <li key={service._id}>
                            <Link href={`/service/${service._id}`}>
                              {service.title} <span className="icon-left-arrow"></span>
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/*End Sidebar Single */}

                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__recent-post">
                    <h3 className="sidebar__title">Recent Post</h3>

                    <ul className="sidebar__recent-post-box">
                      {recentBlogs.length === 0 ? (
                        <li style={{ color: '#6b7280' }}>No recent posts</li>
                      ) : (
                        recentBlogs.map(post => (
                          <li key={post._id}>
                            <div className="inner">
                              <div className="img-box">
                                <img src={post.imageUrl} alt={post.title}/>
                              </div>

                              <div className="content-box">
                                <h4>
                                  <Link href={`/blog/${post._id}`}>
                                    {post.title}
                                  </Link>
                                </h4>
                                <p>
                                  <span className="icon-clock"></span> {formatDate(post.publishedAt || post.createdAt)}
                                </p>
                              </div>
                            </div>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                  {/*End Sidebar Single */}

                </div>
              </div>
              {/*End Sidebar */}
            </div>
          </div>
        </section>
        {/*End Blog Details */}
      </Layout>
    </>
  )
} 