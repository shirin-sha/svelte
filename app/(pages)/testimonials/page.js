import Layout from "@/components/layout/Layout"
import TestimonialsGrid from "@/components/sections/testimonials/TestimonialsGrid"

export default function Home() {
    return (
        <>
            <Layout headerStyle={4} footerStyle={1} breadcrumbTitle="Testimonials">
                <div>
                {/*Start Testimonials Two */}
                <section className="testimonials-two testimonials-two--testimonials">
                    <div className="container">
                        <TestimonialsGrid />
                    </div>
                </section>
                {/*End Testimonials Two */}

                {/*Start Cta One */}
                <section className="cta-one">
                    <div className="cta-one__pattern" style={{backgroundImage: 'url(assets/img/pattern/cta-v1-pattern.png)'}}></div>
                    <div className="container">
                        <div className="cta-one__inner">
                            <div className="cta-one__content">
                                <h2>We are Always Ready to Help You <br/>
                                    & Answer Your Questions</h2>
                            </div>

                            <div className="cta-one__btn">
                                <a className="thm-btn" href="#">
                                    <span className="txt">SERVICE MORE</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
                {/* End Cta One*/}
                </div>

            </Layout>
        </>
    )
}
