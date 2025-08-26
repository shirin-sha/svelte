import Link from 'next/link';

export default function BlogCard({ blog, variant = 'default' }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (variant === 'sidebar') {
    return (
      <div className="blog-sidebar__single">
        <div className="blog-sidebar__single-img">
          <div className="inner">
            <img src={blog.imageUrl} alt={blog.title} />
          </div>
        </div>

        <div className="blog-sidebar__single-content">
          <ul className="meta-box">
            <li>
              <div className="icon">
                <span className="icon-calendar"></span>
              </div>
              <div className="text">
                <p><Link href="#">{formatDate(blog.publishedAt || blog.createdAt)}</Link></p>
              </div>
            </li>

            <li>
              <div className="icon">
                <span className="icon-user"></span>
              </div>
              <div className="text">
                <p><Link href="#">{blog.author}</Link></p>
              </div>
            </li>
          </ul>

          <h2>
            <Link href={`/blog/${blog._id}`}>
              {blog.title}
            </Link>
          </h2>
          <div className="btn-box">
            <Link className="thm-btn" href={`/blog/${blog._id}`}>
              <span className="txt">read more</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default variant (for main blog page)
  return (
    <div className="blog-one__single">
      <div className="blog-one__single-img">
        <div className="inner">
          <img src={blog.imageUrl} alt={blog.title} />
          <div className="overlay-icon">
            <Link href={`/blog/${blog._id}`}>
              <span className="icon-plus"></span>
            </Link>
          </div>
        </div>
      </div>
      <div className="blog-one__single-content">
        <ul className="meta-info">
          <li>
            <p><Link href="#">{blog.category}</Link></p>
          </li>
          <li>
            <p>{formatDate(blog.publishedAt || blog.createdAt)}</p>
          </li>
        </ul>
        <h2>
          <Link href={`/blog/${blog._id}`}>
            {blog.title}
          </Link>
        </h2>
        {blog.excerpt && (
          <p style={{ marginBottom: '15px', color: '#666' }}>
            {blog.excerpt}
          </p>
        )}
        <div className="btn-box">
          <Link href={`/blog/${blog._id}`}>
            READ MORE <span className="icon-left-arrow"></span>
          </Link>
        </div>
      </div>
    </div>
  );
} 