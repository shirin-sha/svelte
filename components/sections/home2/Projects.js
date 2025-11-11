import ProjectSlider0 from '@/components/slider/ProjectSlider0'
import { useEffect, useState } from 'react'

export default function Projects() {
    const [sectionData, setSectionData] = useState({ subtitle: '', title: '' })

    useEffect(() => {
        const fetchSection = async () => {
            try {
                const res = await fetch('/api/content/pages/home/sections/projects')
                if (res.ok) {
                    const section = await res.json()
                    let parsed = null
                    try {
                        parsed = section?.content?.en ? JSON.parse(section.content.en) : null
                    } catch (_) {
                        parsed = null
                    }
                    if (parsed) {
                        setSectionData(prev => ({
                            ...prev,
                            subtitle: parsed.subtitle || prev.subtitle,
                            title: parsed.title || prev.title
                        }))
                    }
                }
            } catch (_) {
                // keep defaults
            }
        }
        fetchSection()
    }, [])
    return (
        <>            
            {/*Start Project Two */}
            <section className="project-two">
                <div className="container">
                    <div className="sec-title text-center">
                        <div className="sub-title">
                            <h5>{sectionData.subtitle}
                            </h5>
                        </div>
                        <h2>{sectionData.title}</h2>
                    </div>
                    <ProjectSlider0/>
                </div>
            </section>
            {/*End Project Two */}
        </>
    )
}

