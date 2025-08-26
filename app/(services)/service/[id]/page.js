import Layout from "@/components/layout/Layout"
import Link from "next/link"
import { notFound } from 'next/navigation'

async function getService(id) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/service/${id}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching service:', error);
  }
  return null;
}

export default async function ServiceDetailsPage({ params }) {
  const service = await getService(params.id);
  
  if (!service) {
    notFound();
  }

  return (
    <>
      <Layout headerStyle={4} footerStyle={1} breadcrumbTitle={service.title}>
        <div>
          {/*Start Services Details */}
          <section className="services-details">
            <div className="container">
              <div className="row">
                {/* Start Services Details Content*/}
                <div className="col-xl-8">
                  <div className="services-details__content">
                    <div className="services-details__content-img1">
                      <img src={service.imageUrl} alt={service.title} />
                    </div>

                    <div className="text-box1">
                      <h2>{service.title}</h2>
                      <p className="text1">{service.description}</p>

                      <p className="text2">{service.shortDescription}</p>

                      {service.features && service.features.length > 0 && (
                        <ul>
                          {service.features.map((feature, index) => (
                            <li key={index}>
                              <div className="icon">
                                <span className="icon-check-mark"></span>
                              </div>
                              <div className="text">
                                <p>{feature}</p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="text-box2">
                      <div 
                        dangerouslySetInnerHTML={{ __html: service.content }}
                      />

                      {service.benefits && service.benefits.length > 0 && (
                        <ul>
                          {service.benefits.map((benefit, index) => (
                            <li key={index}>
                              <p>{benefit}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
                {/* End Services Details Content*/}

                {/*Start Sidebar */}
                <div className="col-xl-4">
                  <div className="sidebar">
                    {/*Start Sidebar Single */}
                    <div className="sidebar__single sidebar__category">
                      <h3 className="sidebar__title">Services</h3>

                      <ul className="sidebar__category-list">
                        <li><Link href="/service">All Services <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/architecture">Architecture <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/interior-design">Interior Design <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/construction-site">Construction Site <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/building-renovation">Building Renovation <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/security-system">Security System <span className="icon-left-arrow"></span></Link></li>
                        <li><Link href="/service/uiux-designing">UI/UX Designing <span className="icon-left-arrow"></span></Link></li>
                      </ul>
                    </div>
                    {/*End Sidebar Single */}

                    {/*Start Sidebar Single */}
                    <div className="sidebar__single sidebar__contact">
                      <h3 className="sidebar__title">Contact Us</h3>
                      <div className="sidebar__contact-box">
                        <div className="icon">
                          <span className="icon-phone"></span>
                        </div>
                        <div className="text">
                          <h4>Phone</h4>
                          <p><a href="tel:123456789">+1 (234) 567-89</a></p>
                        </div>
                      </div>

                      <div className="sidebar__contact-box">
                        <div className="icon">
                          <span className="icon-envelope"></span>
                        </div>
                        <div className="text">
                          <h4>Email</h4>
                          <p><a href="mailto:info@example.com">info@example.com</a></p>
                        </div>
                      </div>

                      <div className="sidebar__contact-box">
                        <div className="icon">
                          <span className="icon-pin"></span>
                        </div>
                        <div className="text">
                          <h4>Address</h4>
                          <p>123 Main Street, City, Country</p>
                        </div>
                      </div>
                    </div>
                    {/*End Sidebar Single */}
                  </div>
                </div>
                {/*End Sidebar */}
              </div>
            </div>
          </section>
          {/*End Services Details */}
        </div>
      </Layout>
    </>
  )
} 