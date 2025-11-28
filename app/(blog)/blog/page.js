
import Layout from "@/components/layout/Layout"
import BlogCard from "@/components/elements/BlogCard"

async function getBlogs() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/blog`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const blogs = await response.json();
      return blogs.sort((a, b) => new Date(b.publishedAt || b.createdAt) - new Date(a.publishedAt || a.createdAt));
    }
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }
  return [];
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <>
      <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="OUR BLOG">
        <div>
          {/*Start Blog One */} 
          <section className="blog-one">
            <div className="container">
              <div className="row">
                {blogs.length === 0 ? (
                  <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                    <h3>No blog posts found</h3>
                    <p>Check back later for new content!</p>
                  </div>
                ) : (
                  blogs.map((blog, index) => (
                    <div 
                      key={blog._id} 
                      className="col-xl-4 col-lg-4 wow fadeInLeft" 
                      data-wow-delay={`${index * 100}ms`} 
                      data-wow-duration="1500ms"
                    >
                      <BlogCard blog={blog} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
          {/*End Blog One */}
        </div>
      </Layout>
    </>
  )
}