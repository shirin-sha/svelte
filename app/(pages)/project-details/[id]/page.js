import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from 'next/navigation'

async function getProject(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/project/${id}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching project:', error);
  }
  return null;
}

export default async function ProjectDetailsPage({ params }) {
  const project = await getProject(params.id);
  
  if (!project) {
    notFound();
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Ensure the image path is correct
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/img/project/project-details-img1.jpg'; // fallback
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };

  const imageUrl = getImageUrl(project.mainImage);

  return (
    <>
      <Layout headerStyle={2} footerStyle={1} breadcrumbTitle={project.title}>
        {/*Start Project Details */}
        <section className="project-details">
          <div className="container">
            <div className="project-details__inner">
              <div className="project-details-img">
                <div className="inner">
                  <img src={imageUrl} alt={project.title} />
                </div>
              </div>

              <div className="project-details__text1">
                <ul>
                  <li>
                    <div className="text-box">
                      <p>published:</p>
                      <h4>{formatDate(project.createdAt)}</h4>
                    </div>
                  </li>

                  <li>
                    <div className="text-box">
                      <p>CATEGORY:</p>
                      <h4>{project.category}</h4>
                    </div>
                  </li>

                  <li>
                    <div className="text-box">
                      <p>client:</p>
                      <h4>{project.client || 'N/A'}</h4>
                    </div>
                  </li>

                  <li>
                    <ul className="social-links">
                      <li>
                        <Link href="#"><span className="icon-facebook"></span></Link>
                        <Link className="tw" href="#"><span className="icon-twitter"></span></Link>
                        <Link className="ins" href="#"><span className="icon-instagram"></span></Link>
                        <Link className="in" href="#"><span className="icon-linkedin-big-logo"></span></Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className="project-details__text2">
                <h2>{project.title}</h2>
                <p>{project.longDescription}</p>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="project-details__text2-bottom">
                    <div className="tag-box">
                      {project.technologies.map((tech, index) => (
                        <Link key={index} href="#">{tech}</Link>
                      ))}
                    </div>

                    <div className="icon-box">
                      <Link href="#"><span className="icon-share"></span></Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="project-details__previous-next">
                <div className="single-box">
                  <div className="icon-box">
                    <Link href="/projects"><span className="icon-left-arrow1"></span></Link>
                  </div>
                  <div className="text-box">
                    <p>Back to Projects</p>
                    <h4><Link href="/projects">All Projects</Link></h4>
                  </div>
                </div>

                <div className="single-box next">
                  <div className="text-box text-right">
                    <p>Location</p>
                    <h4>{project.location || 'N/A'}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*End Project Details */}
      </Layout>
    </>
  )
}