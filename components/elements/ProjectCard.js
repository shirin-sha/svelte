import Link from 'next/link';

export default function ProjectCard({ project, variant = 'default' }) {
  console.log('ProjectCard received project:', project);
  
  // Ensure the image path is correct
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/img/project/project-v3-img4.jpg'; // fallback
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    return `/${imagePath}`;
  };
  
  const imageUrl = getImageUrl(project.mainImage);
  
  if (variant === 'compact') {
    return (
      <div className="project-three__single">
        <div className="project-three__single-inner">
          <div className="project-three__single-img"
            style={{backgroundImage: `url(${imageUrl})`}}>
          </div>
          <div className="bg-overlay"></div>

          <div className="project-three__overlay-icon">
            <ul>
              <li>
                <Link className="img-popup" href={imageUrl}>
                  <span className="icon-search-interface-symbol"></span>
                </Link>
              </li>
              <li>
                <Link href={`/project-details/${project._id}`}>
                  <span className="icon-link"></span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="project-three__single-content">
            <p>{project.location || 'Location'}</p>
            <h2>
              <Link href={`/project-details/${project._id}`}>{project.title}</Link>
            </h2>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="project-three__single">
    <div className="project-three__single-inner">
        <div className="project-three__single-img"
            style={{backgroundImage: 'url(assets/img/project/project-v3-img4.jpg)'}}>
        </div>
        <div className="bg-overlay"></div>

        <div className="project-three__overlay-icon">
            <ul>
                <li><Link className="img-popup" href="assets/img/project/project-v3-img4.jpg"><span
                            className="icon-search-interface-symbol"></span></Link>
                </li>
                <li><Link href="/project-details"><span className="icon-link"></span></Link></li>
            </ul>
        </div>

        <div className="project-three__single-content">
            <p>San Fransisco</p>
            <h2><Link href="/project-details">Hotel Joshna Villa</Link></h2>
        </div>
    </div>
</div>
  );
} 