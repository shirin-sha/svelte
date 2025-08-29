'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AboutAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage1, setUploadingImage1] = useState(false);
  const [uploadingImage2, setUploadingImage2] = useState(false);
  
  const [formData, setFormData] = useState({
    title: 'We Take Care of Everything for Your Goals',
    subtitle: 'KNOW ABOUT SVELTE',
    description: 'Nullam eu nibh vitae est tempor molestie id sed ex. Quisque dignissim maximus ipsum, sed rutrum metus tincidunt et. Sed eget tincidunt ipsum. Eget tincidunt',
    image1: 'assets/img/about/about-v2-img1.jpg',
    image2: 'assets/img/about/about-v2-img2.jpg',
    videoId: 'vfhzo499OeA',
    bullets: [
      'Feasiblity Studies',
      'Conceptual Design',
      'Custom design & feauture'
    ]
  });

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
      const res = await fetch('/api/content/pages/home/sections/about');
      if (res.ok) {
        const section = await res.json();
        let parsed = null;
        try {
          parsed = section?.content?.en ? JSON.parse(section.content.en) : null;
        } catch (_) {
          parsed = null;
        }
        if (parsed) {
          setFormData(prev => ({
            ...prev,
            ...parsed
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBulletChange = (index, value) => {
    const newBullets = [...formData.bullets];
    newBullets[index] = value;
    setFormData(prev => ({
      ...prev,
      bullets: newBullets
    }));
  };

  const addBullet = () => {
    setFormData(prev => ({
      ...prev,
      bullets: [...prev.bullets, '']
    }));
  };

  const removeBullet = (index) => {
    setFormData(prev => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index)
    }));
  };

  const uploadImage = async (file, imageField) => {
    const uploadingSetter = imageField === 'image1' ? setUploadingImage1 : setUploadingImage2;
    uploadingSetter(true);
    
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      
      handleInputChange(imageField, json.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      uploadingSetter(false);
    }
  };

  const handleImageUpload = (e, imageField) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, imageField);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        content: {
          en: JSON.stringify(formData)
        }
      };
      
      const res = await fetch('/api/content/pages/home/sections/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('About section updated successfully!');
        await fetchAboutData();
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving changes');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="About Section">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading about section...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Section Management">
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        padding: '32px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '1000px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
              About Section Content
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
              Manage the content displayed in the About section of your home page
            </p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            style={{ 
              background: saving ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Subtitle */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Subtitle
            </label>
            <input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="e.g., KNOW ABOUT SVELTE"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Title */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Main Title
            </label>
            <textarea
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Main heading for the about section"
              rows={3}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description text for the about section"
              rows={4}
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Images */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Image 1 */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Main Image
              </label>
              <div style={{ 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                {formData.image1 && (
                  <img 
                    src={formData.image1} 
                    alt="Main about image" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '6px', 
                      marginBottom: '12px' 
                    }} 
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image1')}
                  disabled={uploadingImage1}
                  style={{ marginBottom: '8px' }}
                />
                {uploadingImage1 && (
                  <div style={{ color: '#3b82f6', fontSize: '12px' }}>Uploading...</div>
                )}
              </div>
            </div>

            {/* Image 2 */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Secondary Image (with video button)
              </label>
              <div style={{ 
                border: '2px dashed #d1d5db', 
                borderRadius: '8px', 
                padding: '16px', 
                textAlign: 'center' 
              }}>
                {formData.image2 && (
                  <img 
                    src={formData.image2} 
                    alt="Secondary about image" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'cover', 
                      borderRadius: '6px', 
                      marginBottom: '12px' 
                    }} 
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image2')}
                  disabled={uploadingImage2}
                  style={{ marginBottom: '8px' }}
                />
                {uploadingImage2 && (
                  <div style={{ color: '#3b82f6', fontSize: '12px' }}>Uploading...</div>
                )}
              </div>
            </div>
          </div>

          {/* Video ID */}
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: '600', 
              color: '#374151' 
            }}>
              YouTube Video ID
            </label>
            <input
              type="text"
              value={formData.videoId}
              onChange={(e) => handleInputChange('videoId', e.target.value)}
              placeholder="e.g., vfhzo499OeA"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
            <p style={{ 
              margin: '4px 0 0 0', 
              fontSize: '12px', 
              color: '#6b7280' 
            }}>
              Extract the video ID from YouTube URL (the part after v=)
            </p>
          </div>

          {/* Bullet Points */}
          <div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: '12px' 
            }}>
              <label style={{ 
                fontWeight: '600', 
                color: '#374151' 
              }}>
                Key Points
              </label>
              <button
                onClick={addBullet}
                style={{ 
                  background: '#10b981', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500'
                }}
              >
                + Add Point
              </button>
            </div>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {formData.bullets.map((bullet, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'center' 
                }}>
                  <input
                    type="text"
                    value={bullet}
                    onChange={(e) => handleBulletChange(index, e.target.value)}
                    placeholder={`Key point ${index + 1}`}
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    onClick={() => removeBullet(index)}
                    style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '10px 12px', 
                      borderRadius: '6px', 
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 