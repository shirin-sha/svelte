'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AboutSectionPage() {
  const [aboutData, setAboutData] = useState({
    subtitle: 'About Company',
    title: 'Find Architect to Building Your Vision & Passion',
    description: 'Arki features minimal and stylish design. The theme is well crafted for all the modern architect and interior design website. With Arki, it makes your website look even more attractive and impressive to',
    mainImage: 'assets/img/about/about-v1-img1.jpg',
    // authorImage: 'assets/img/about/about-v1-img2.jpg', // Removed
    // signatureImage: 'assets/img/about/signature-1.png', // Removed
    // shapeImage: 'assets/img/shape/about-v1-shape1.png', // Removed
    progressBars: [
      { title: 'Design', percentage: 80 },
      { title: 'Architect', percentage: 90 }
    ],
    buttonText: 'Discover More',
    buttonLink: 'about',
    phoneNumber: '+123 456789',
    phoneText: 'Do you have any project on your mind? Call Us:'
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchAboutData();
  }, [router]);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/content/pages/about/sections/about-section');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const section = data[0];
          setAboutData({
            subtitle: section.subtitle?.en || 'About Company',
            title: section.title?.en || 'Find Architect to Building Your Vision & Passion',
            description: section.description?.en || 'Arki features minimal and stylish design. The theme is well crafted for all the modern architect and interior design website. With Arki, it makes your website look even more attractive and impressive to',
            mainImage: section.mainImage || 'assets/img/about/about-v1-img1.jpg',
            // authorImage: section.authorImage || 'assets/img/about/about-v1-img2.jpg', // Removed
            // signatureImage: section.signatureImage || 'assets/img/about/signature-1.png', // Removed
            // shapeImage: section.shapeImage || 'assets/img/shape/about-v1-shape1.png', // Removed
            progressBars: section.progressBars && section.progressBars.length >= 2 ? section.progressBars.slice(0, 2) : [
              { title: 'Design', percentage: 80 },
              { title: 'Architect', percentage: 90 }
            ],
            buttonText: section.buttonText || 'Discover More',
            buttonLink: section.buttonLink || 'about',
            phoneNumber: section.phoneNumber || '+123 456789',
            phoneText: section.phoneText || 'Do you have any project on your mind? Call Us:'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [field]: previewUrl }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleProgressBarChange = (index, field, value) => {
    // Ensure we only have 2 progress bars - static
    const currentBars = aboutData.progressBars.length >= 2 
      ? [...aboutData.progressBars.slice(0, 2)]
      : [
          { title: 'Design', percentage: 80 },
          { title: 'Architect', percentage: 90 }
        ];
    
    if (currentBars[index]) {
      currentBars[index] = { ...currentBars[index], [field]: value };
      setAboutData(prev => ({ ...prev, progressBars: currentBars }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let mainImage = aboutData.mainImage;
      // let authorImage = aboutData.authorImage; // Removed
      // let signatureImage = aboutData.signatureImage; // Removed
      // let shapeImage = aboutData.shapeImage; // Removed

      // Upload new images if selected
      if (selectedFiles.mainImage) {
        mainImage = await uploadImage(selectedFiles.mainImage);
      }
      // Author image upload removed
      // Signature and Shape image uploads removed

      const sectionData = {
        name: 'about-section',
        title: { en: aboutData.title },
        subtitle: { en: aboutData.subtitle },
        description: { en: aboutData.description },
        mainImage,
        // authorImage, // Removed
        // signatureImage, // Removed
        // shapeImage, // Removed
        progressBars: aboutData.progressBars.slice(0, 2), // Only 2 static progress bars
        buttonText: aboutData.buttonText,
        buttonLink: aboutData.buttonLink,
        phoneNumber: aboutData.phoneNumber,
        phoneText: aboutData.phoneText,
        type: 'about',
        isActive: true,
        order: 1
      };

      const response = await fetch('/api/content/pages/about/sections/about-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });
      
      if (response.ok) {
        setSelectedFiles({});
        setImagePreviews({});
        alert('About section updated successfully!');
        fetchAboutData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update about section');
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      alert('Failed to update about section. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AdminLayout title="About Section"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage About Section">
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 24 }}>About Section Settings</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Content Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Content</h3>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Subtitle:</label>
              <input 
                type="text" 
                value={aboutData.subtitle} 
                onChange={e => setAboutData(prev => ({ ...prev, subtitle: e.target.value }))}
                required
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
                placeholder="Enter subtitle"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Main Title:</label>
              <input 
                type="text" 
                value={aboutData.title} 
                onChange={e => setAboutData(prev => ({ ...prev, title: e.target.value }))}
                required
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
                placeholder="Enter main title"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Description:</label>
              <textarea 
                value={aboutData.description} 
                onChange={e => setAboutData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
                placeholder="Enter description"
              />
            </div>
          </div>

          {/* Progress Bars Section - Static (2 bars only) */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Progress Bars</h3>
          
            {aboutData.progressBars.slice(0, 2).map((bar, index) => (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: 20, 
                marginBottom: 16,
                background: '#f9fafb'
              }}>
                <h4 style={{ margin: '0 0 16px 0' }}>Progress Bar {index + 1}</h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Title:</label>
                    <input 
                      type="text" 
                      value={bar.title} 
                      onChange={e => handleProgressBarChange(index, 'title', e.target.value)}
                      required
                      style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                      placeholder="Enter skill title"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Percentage:</label>
                    <input 
                      type="number" 
                      value={bar.percentage} 
                      onChange={e => handleProgressBarChange(index, 'percentage', parseInt(e.target.value))}
                      required
                      min="0"
                      max="100"
                      style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Contact Information</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Phone Number:</label>
                <input 
                  type="text" 
                  value={aboutData.phoneNumber} 
                  onChange={e => setAboutData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="e.g., +123 456789"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Phone Text:</label>
                <input 
                  type="text" 
                  value={aboutData.phoneText} 
                  onChange={e => setAboutData(prev => ({ ...prev, phoneText: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="e.g., Do you have any project on your mind? Call Us:"
                />
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Button Text:</label>
              <input 
                type="text" 
                value={aboutData.buttonText} 
                onChange={e => setAboutData(prev => ({ ...prev, buttonText: e.target.value }))}
                required
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                placeholder="Enter button text"
              />
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Button Link:</label>
              <input 
                type="text" 
                value={aboutData.buttonLink} 
                onChange={e => setAboutData(prev => ({ ...prev, buttonLink: e.target.value }))}
                required
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                placeholder="Enter button link"
              />
            </div>
          </div>

          {/* Images Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Images</h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Main Image:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef',
                fontSize: '12px'
              }}>
                📏 Recommended: 600×800 pixels
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleFileSelect('mainImage', e)}
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
              />
              {(imagePreviews.mainImage || aboutData.mainImage) && (
                <img 
                  src={imagePreviews.mainImage || aboutData.mainImage} 
                  alt="Main Image Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: 6,
                    marginTop: 8,
                    border: '1px solid #ddd'
                  }} 
                />
              )}
            </div>

            {/* Author Image, Signature Image and Shape Image fields removed */}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              background: isSubmitting ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '14px 28px', 
              borderRadius: 6, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update About Section'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}