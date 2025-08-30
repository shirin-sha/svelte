'use client';
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function Action() {
    const [actionData, setActionData] = useState({
        title: 'Have a Project in Your Mind',
        subtitle: 'Don\'t Hesitate to Say Hello',
        buttonText: 'LET\'S TALK WITH US',
        buttonLink: '#',
        backgroundImage: 'assets/img/background/call-to-action-v1-bg.jpg'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActionData();
    }, []);

    const fetchActionData = async () => {
        try {
            const response = await fetch('/api/content/home-sections?section=action');
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    const section = data[0];
                    setActionData({
                        title: section.title?.en || 'Have a Project in Your Mind',
                        subtitle: section.subtitle?.en || 'Don\'t Hesitate to Say Hello',
                        buttonText: section.buttonText || 'LET\'S TALK WITH US',
                        buttonLink: section.buttonLink || '#',
                        backgroundImage: section.backgroundImage || 'assets/img/background/call-to-action-v1-bg.jpg'
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching action data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className="call-to-action-one">
                <div className="container">
                    <div className="call-to-action-one__inner">
                        <div className="call-to-action-one__content text-center">
                            <div>Loading...</div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <> 
        {/*Start Call To Action One */}
        <section className="call-to-action-one">
            <div className="call-to-action-one__bg"
                style={{backgroundImage: `url(${actionData.backgroundImage})`}}></div>
            <div className="container">
                <div className="call-to-action-one__inner">
                    <div className="call-to-action-one__content text-center">
                        <h2>{actionData.title}</h2>
                        <h3>{actionData.subtitle}</h3>
                        <div className="btn-box">
                            <a className="thm-btn" href={actionData.buttonLink}>
                                <span className="txt">{actionData.buttonText}</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/*End Call To Action One */}
            
        </>
    )
}
