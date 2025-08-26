import Link from 'next/link';

export default function ServiceCard({ service, variant = 'default'}) {
  if (variant === 'compact') {
    return (
      <div className="service-two__single">
        <div className="shape2">
          <img src="assets/img/shape/service-v2-shape2.png" alt=""/>
        </div>
        <div className="service-two__single-bg"
          style={{backgroundImage: 'url(assets/img/service/service-v2-single-bg.jpg)'}}>
        </div>
        <div className="service-two__single-icon">
          <span className={service.icon}></span>
        </div>
        <div className="service-two__single-text">
          <h2>
            <Link href={`/service/${service._id}`}>{service.title}</Link>
          </h2>
          <p>{service.shortDescription}</p>
        </div>
        <div className="btn-box">
          <Link href={`/service/${service._id}`}>EXPLORE SERVICE</Link>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="service-one__single">
      <div className="service-one__single-icon">
        <span className={service.icon}></span>
      </div>
      <div className="service-one__single-text">
        <h2>
          <Link href={`/service/${service._id}`}>{service.title}</Link>
        </h2>
        <p>{service.shortDescription}</p>
      </div>
      <div className="btn-box">
        <Link href={`/service/${service._id}`}>
          READ MORE <span className="icon-left-arrow"></span>
        </Link>
      </div>
    </div>
  );
} 