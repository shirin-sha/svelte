import Layout from "@/components/layout/Layout"
import ServiceCard from "@/components/elements/ServiceCard"
import Link from "next/link";

async function getServices() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/service`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const services = await response.json();
      return services.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  } catch (error) {
    console.error('Error fetching services:', error);
  }
  return [];
}



export default async function ServicePage() {
  const [services, servicePage] = await Promise.all([
    getServices(),
  ]);

  const isSectionActive = (name) => {
    const sections = servicePage?.sections || [];
    const found = sections.find(s => s.name === name);
    return found ? !!found.isActive : true; // default to visible when not configured
  };
 
  return (
    <>
      <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Service Page">
        <div>
          {/*Start Service Two */}
          {isSectionActive('service-two') && (
            <section className="service-two">
              <div className="container">
                <div className="row">
                  {services.length === 0 ? (
                    <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                      <h3>No services found</h3>
                      <p>Check back later for our services!</p>
                    </div>
                  ) : (
                    services.map((service, index) => (
                      <div 
                        key={service._id} 
                        className="col-xl-4 col-lg-4 wow animated fadeInUp" 
                        data-wow-delay={`${(index + 1) * 0.2}s`}
                      >
                        <ServiceCard service={service} variant="compact" />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}
          {/*End Service Two */}


             


                </div>

            </Layout>
        </>
    )
}