
import Layout from "@/components/layout/Layout"
import ContactForm from "@/components/elements/ContactForm"

async function getContactData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/content/contact`, {
      cache: 'no-store'
    });
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error('Error fetching contact data:', error);
  }
  return null;
}

export default async function ContactPage() {
  const contactData = await getContactData();

  return (
    <>
      <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Contact Us">
        <div>
          {/*Start Contact Page */}
          <section className="contact-page">
            <div className="contact-page__top">
              <div className="container">
                <div className="row">
                  <div className="col-xl-6 col-lg-6">
                    <div className="contact-page__top-content">
                      <div className="contact-page__top-content-top">
                        <h2>{contactData?.pageTitle || "Get in Touch"}</h2>
                        <p>{contactData?.pageDescription || "A vast majority of the app marketers mainly concent post-launch app marketing techniques and measures while completely missing pre-launch campaign. This prevents the"}</p>
                      </div>

                      <div className="contact-page__top-content-bottom">
                        <h2>Contact Info</h2>
                        <ul>
                          <li>
                            <div className="inner">
                              <div className="icon-box">
                                <span className="icon-pin"></span>
                              </div>

                              <div className="content-box">
                                <h4>Address</h4>
                                <p>{contactData?.address || "254, North City, Bulex Center, New York"}</p>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="inner">
                              <div className="icon-box">
                                <span className="icon-phone"></span>
                              </div>

                              <div className="content-box">
                                <h4>Phone</h4>
                                <p>
                                  <a href={`tel:${contactData?.phone?.replace(/\s/g, '')}`}>
                                    {contactData?.phone || "09 (354) 587 874"}
                                  </a>
                                  {contactData?.secondaryPhone && (
                                    <>
                                      {" or "}
                                      <a href={`tel:${contactData?.secondaryPhone?.replace(/\s/g, '')}`}>
                                        {contactData?.secondaryPhone}
                                      </a>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="inner">
                              <div className="icon-box">
                                <span className="icon-envelope"></span>
                              </div>

                              <div className="content-box">
                                <h4>Email</h4>
                                <p>
                                  <a href={`mailto:${contactData?.email}`}>
                                    {contactData?.email || "info@example.com"}
                                  </a>
                                  {contactData?.secondaryEmail && (
                                    <>
                                      {" or "}
                                      <a href={`mailto:${contactData?.secondaryEmail}`}>
                                        {contactData?.secondaryEmail}
                                      </a>
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 col-lg-6">
                    <div className="contact-page__google-map">
                      <iframe
                        src={contactData?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4562.753041141002!2d-118.80123790098536!3d34.152323469614075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e82469c2162619%3A0xba03efb7998eef6d!2sCostco+Wholesale!5e0!3m2!1sbn!2sbd!4v1562518641290!5m2!1sbn!2sbd"}
                        className="contact-page-google-map__one"
                        title="Location Map"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-page__bottom">
              {/*Start Contact Two */}
              <div className="contact-two">
                <div className="container">
                  <div className="contact-two__inner">
                    <div className="title-box">
                      <h2>{contactData?.formTitle || "Let's Get in Touch"}</h2>
                      <p>{contactData?.formSubtitle || "Your email address will not be published. Required fields are marked *"}</p>
                    </div>
                    <div className="contact-two__inner-box">
                      <ContactForm contactData={contactData} />
                    </div>
                  </div>
                </div>
              </div>
              {/*End Contact Two */}
            </div>
          </section>
          {/*End Contact Page */}
        </div>
      </Layout>
    </>
  )
}