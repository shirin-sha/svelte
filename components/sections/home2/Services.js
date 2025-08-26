'use client'
import Link from "next/link"
import { useState, useEffect } from "react"

export default function Services() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('/api/content/service/latest');
                const data = await response.json();
                if (data.services) {
                    setServices(data.services);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    // Default services if no data is available
    const defaultServices = [
        {
            title: "Machine Design",
            shortDescription: "Through a unique coN construction and design disciplines expertise Concor and delivers",
            icon: "icon-construction-machine"
        },
        {
            title: "General Contracting", 
            shortDescription: "Through a unique coN construction and design disciplines expertise Concor and delivers",
            icon: "icon-construction"
        },
        {
            title: "Machine Design",
            shortDescription: "Through a unique coN construction and design disciplines expertise Concor and delivers", 
            icon: "icon-interior-design"
        }
    ];

    const displayServices = services.length > 0 ? services : defaultServices;
    
    return (
        <>
            
            {/*Start Service Two */}
        <section className="service-two">
            <div className="shape1 float-bob-y"><img src="assets/img/shape/service-v2-shape1.png" alt=""/></div>
            <div className="container">
                <div className="sec-title text-center">
                    <div className="sub-title">
                        <h5>OUR SERVICE</h5>
                    </div>
                    <h2>Our Architecture Services</h2>
                </div>
                <div className="row">
                    {displayServices.map((service, index) => (
                        <div key={service._id || index} className="col-xl-4 col-lg-4 wow animated fadeInUp" data-wow-delay={`${0.1 + (index * 0.2)}s`}>
                            <div className="service-two__single">
                                <div className="shape2"><img src="assets/img/shape/service-v2-shape2.png" alt=""/></div>
                                <div className="service-two__single-bg"
                                    style={{backgroundImage: 'url(assets/img/service/service-v2-single-bg.jpg)'}}></div>
                                <div className="service-two__single-icon">
                                    <span className={service.icon}></span>
                                </div>
                                <div className="service-two__single-text">
                                    <h2><Link href="/architecture">{service.title}</Link></h2>
                                    <p>{service.shortDescription}</p>
                                </div>

                                <div className="btn-box">
                                    <Link href="/architecture">EXPLORE SERVICE</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        {/*End Service Two */}


        </>
    )
}
