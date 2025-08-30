'use client'
import { useState, useEffect } from 'react';
import Link from "next/link";

export default function DynamicTeam() {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await fetch('/api/content/team');
            const data = await response.json();
            if (data.success) {
                setTeam(data.data);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="row">
                <div className="col-12 text-center py-5">
                    <div className="text-lg">Loading team members...</div>
                </div>
            </div>
        );
    }

    if (!team.length) {
        return (
            <div className="row">
                <div className="col-12 text-center py-5">
                    <p className="text-gray-500">No team members available at the moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="row">
            {team.map((member, index) => (
                <div key={member._id || index} className="col-xl-4 col-lg-4 wow fadeInUp" data-wow-delay=".3s">
                    <div className="team-two__single">
                        <div className="team-two__single-img">
                            <div className="inner">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    onError={(e) => {
                                        e.target.src = `assets/img/team/team-v2-img${(index % 3) + 1}.jpg`;
                                    }}
                                />
                            </div>

                            <div className="content-box">
                                <h3><Link href="/team-details">{member.name}</Link></h3>
                                <p>{member.position}</p>
                            </div>
                            <ul className="social-links clearfix">
                                <li className="share">
                                    <Link href="#"><span className="icon-share"></span></Link>
                                    <ul className="social-links-inner">
                                        {member.socialLinks?.linkedin && (
                                            <li><Link href={member.socialLinks.linkedin}><i className="icon-linkedin-big-logo"></i></Link></li>
                                        )}
                                        {member.socialLinks?.instagram && (
                                            <li><Link href={member.socialLinks.instagram}><i className="icon-instagram"></i></Link></li>
                                        )}
                                        {member.socialLinks?.facebook && (
                                            <li><Link href={member.socialLinks.facebook}><i className="icon-facebook"></i></Link></li>
                                        )}
                                        {member.socialLinks?.twitter && (
                                            <li><Link href={member.socialLinks.twitter}><i className="icon-twitter"></i></Link></li>
                                        )}
                                        {member.socialLinks?.website && (
                                            <li><Link href={member.socialLinks.website}><i className="icon-globe"></i></Link></li>
                                        )}
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 