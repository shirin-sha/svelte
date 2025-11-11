'use client'
import Layout from "@/components/layout/Layout"
import ProjectCard from "@/components/elements/ProjectCard"
import Link from "next/link"
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/content/project');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched projects:', data);
                setProjects(data);
            } else {
                console.error('Failed to fetch projects:', response.status);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Layout headerStyle={2} footerStyle={1} breadcrumbTitle="Our Projects">
                <div>
                    {/*Start Project Three */}
                    <section className="project-three project-three--project">
                        <div className="container">
                            <div className="row">
                                {loading ? (
                                    <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                                        <h3>Loading projects...</h3>
                                    </div>
                                ) : projects.length === 0 ? (
                                    <div className="col-12 text-center" style={{ padding: '60px 0' }}>
                                        <h3>No projects found</h3>
                                        <p>Check back later for our projects!</p>
                                    </div>
                                ) : (
                                    projects.map((project, index) => (
                                        <div
                                            key={project._id}
                                            className="col-xl-4 col-lg-4 col-md-6 wow animated fadeInUp"
                                            data-wow-delay={`${(index + 1) * 0.2}s`}
                                        >
                                            <div>
                                                <div className="project-three__single">
                                                    <div className="project-three__single-inner">
                                                        <div className="project-three__single-img"
                                                        >
                                                            <div
                                                                style={{
                                                                    backgroundImage: `url("${project.mainImage}")`,
                                                                    backgroundSize: 'cover',
                                                                    backgroundPosition: 'center',
                                                                    height: '100%',
                                                                    width: '100%',
                                                                }}
                                                            >
                                                            </div>

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
                                                            <p>{project.location}</p>
                                                            <h2><Link href={`/project-details/${project._id}`}>{project.title}</Link></h2>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </section>
                    {/*End Project Three */}
                </div>
            </Layout>
        </>
    )
}