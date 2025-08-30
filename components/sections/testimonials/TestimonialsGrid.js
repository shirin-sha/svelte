'use client'
import { useState, useEffect } from 'react';

export default function TestimonialsGrid() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/content/testimonials');
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="text-lg">Loading testimonials...</div>
            </div>
        );
    }

    if (!testimonials.length) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No testimonials available at the moment.</p>
            </div>
        );
    }

    return (
        <div className="row">
            {testimonials.map((testimonial, index) => (
                <div key={testimonial._id || index} className="col-xl-4 col-lg-4 col-md-6">
                    <div className="testimonials-two__single">
                        <div className="testimonials-two__single-top">
                            <div className="img-box">
                                <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name}
                                    onError={(e) => {
                                        e.target.src = 'assets/img/testimonial/testimonials-v2-img1.jpg';
                                    }}
                                />
                            </div>

                            <div className="icon-box">
                                <span className="icon-quote"></span>
                            </div>
                        </div>

                        <div className="testimonials-two__single-text">
                            <p>{testimonial.testimonial}</p>
                        </div>

                        <div className="testimonials-two__single-bottom">
                            <h3>{testimonial.name}</h3>
                            <p>{testimonial.position}</p>
                            {testimonial.company && (
                                <p className="text-sm text-gray-600">{testimonial.company}</p>
                            )}
                            {testimonial.rating && (
                                <div className="flex items-center mt-2">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="text-yellow-400 text-sm">★</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
} 