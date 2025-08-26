import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from 'next/navigation'

async function getBlog(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/blog/${id}`, {
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

export default async function BlogDetailsPage({ params }) {
  const blog = await getBlog(params.id);
  
  if (!blog || blog.status !== 'published') {
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
      <Layout headerStyle={1} footerStyle={1} breadcrumbTitle={blog.title}>
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
                      {formatDate(blog.publishedAt || blog.createdAt)} _ {blog.category} _ BY {blog.author}
                    </p>
                    <div 
                      className="text2"
                      dangerouslySetInnerHTML={{ __html: blog.content }}
                    />
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="blog-details__content-text4">
                      <div className="tag-box">
                        <div className="title">
                          <h2>Posted in:</h2>
                        </div>

                        <div className="tag-box-list">
                          <ul>
                            {blog.tags.map((tag, index) => (
                              <li key={index}>
                                <Link href={`/blog?tag=${tag}`}>{tag}</Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="icon-box">
                        <Link href="#"><span className="icon-share"></span></Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/*End Blog Sidebar Content */}

              {/*Start Sidebar */}
              <div className="col-xl-4">
                <div className="sidebar">
                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__search">
                    <h3 className="sidebar__title">Search</h3>
                    <form action="#" className="sidebar__search-form">
                      <input type="search" placeholder="Keywords here...."/>
                      <button type="submit"><i className="fa fa-search"></i></button>
                    </form>
                  </div>
                  {/*End Sidebar Single */}

                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__category">
                    <h3 className="sidebar__title">Categories</h3>

                    <ul className="sidebar__category-list">
                      <li><Link className="active" href="#">Architecture <span className="icon-left-arrow"></span></Link></li>
                      <li><Link href="#">Interior Design <span className="icon-left-arrow"></span></Link></li>
                      <li><Link href="#">Ui/Ux Designing <span className="icon-left-arrow"></span></Link></li>
                      <li><Link href="#">Building Renovation <span className="icon-left-arrow"></span></Link></li>
                      <li><Link href="#">Construction Site <span className="icon-left-arrow"></span></Link></li>
                      <li><Link href="#">Security System <span className="icon-left-arrow"></span></Link></li>
                    </ul>
                  </div>
                  {/*End Sidebar Single */}

                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__recent-post">
                    <h3 className="sidebar__title">Recent Post</h3>

                    <ul className="sidebar__recent-post-box">
                      <li>
                        <div className="inner">
                          <div className="img-box">
                            <img src="assets/img/blog/sidebar-img1.jpg" alt=""/>
                          </div>

                          <div className="content-box">
                            <h4><Link href="#">Keep Your Business <br/> Safe Ensure High</Link></h4>
                            <p><span className="icon-clock"></span> April 21, 2023</p>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="inner">
                          <div className="img-box">
                            <img src="assets/img/blog/sidebar-img2.jpg" alt=""/>
                          </div>

                          <div className="content-box">
                            <h4><Link href="#">We've Been a Strategy <br/> Thought Leader for</Link></h4>
                            <p><span className="icon-clock"></span> April 21, 2023</p>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="inner">
                          <div className="img-box">
                            <img src="assets/img/blog/sidebar-img3.jpg" alt=""/>
                          </div>

                          <div className="content-box">
                            <h4><Link href="#">This Week's Top <br/> Stories About It</Link></h4>
                            <p><span className="icon-clock"></span> April 21, 2023</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  {/*End Sidebar Single */}

                  {/*Start Sidebar Single */}
                  <div className="sidebar__single sidebar__tags">
                    <h3 className="sidebar__title">Tags</h3>
                    <ul className="sidebar__tags-list clearfix">
                      <li><Link href="#">IT Technology</Link></li>
                      <li><Link href="#">Software</Link></li>
                      <li><Link href="#">Design</Link></li>
                      <li><Link href="#">Service</Link></li>
                      <li><Link href="#">Development</Link></li>
                      <li><Link href="#">Digital</Link></li>
                      <li><Link href="#">Cyber</Link></li>
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