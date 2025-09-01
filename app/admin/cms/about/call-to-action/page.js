'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function CallToActionPage() {
  const [actionData, setActionData] = useState({
    title: 'Have a Project in Your Mind',
    subtitle: 'Don\'t Hesitate to Say Hello',
    buttonText: 'LET\'S TALK WITH US',
    buttonLink: '#',
    backgroundImage: 'assets/img/background/call-to-action-v1-bg.jpg'
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchActionData();
  }, [router]);

  const fetchActionData = async () => {
    try {
      const response = await fetch('/api/content/pages/about/sections/call-to-action');
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
      console.error('Error fetching call to action data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let backgroundImage = actionData.backgroundImage;

      if (selectedFile) {
        backgroundImage = await uploadImage(selectedFile);
      }

      const sectionData = {
        name: 'call-to-action',
        title: { en: actionData.title },
        subtitle: { en: actionData.subtitle },
        buttonText: actionData.buttonText,
        buttonLink: actionData.buttonLink,
        backgroundImage,
        type: 'action',
        isActive: true,
        order: 2
      };

      const response = await fetch('/api/content/pages/about/sections/call-to-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });
      
      if (response.ok) {
        setSelectedFile(null);
        setImagePreview('');
        alert('Call to Action section updated successfully!');
        fetchActionData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update call to action section');
      }
    } catch (error) {
      console.error('Error updating call to action section:', error);
      alert('Failed to update call to action section. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AdminLayout title="Call to Action Section"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Call to Action Section">
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 24 }}>Call to Action Section Settings</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Main Title:</label>
            <input 
              type="text" 
              value={actionData.title} 
              onChange={e => setActionData(prev => ({ ...prev, title: e.target.value }))}
              required
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
              placeholder="Enter the main title"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Subtitle:</label>
            <input 
              type="text" 
              value={actionData.subtitle} 
              onChange={e => setActionData(prev => ({ ...prev, subtitle: e.target.value }))}
              required
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
              placeholder="Enter the subtitle"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Button Text:</label>
            <input 
              type="text" 
              value={actionData.buttonText} 
              onChange={e => setActionData(prev => ({ ...prev, buttonText: e.target.value }))}
              required
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
              placeholder="Enter button text"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Button Link:</label>
            <input 
              type="text" 
              value={actionData.buttonLink} 
              onChange={e => setActionData(prev => ({ ...prev, buttonLink: e.target.value }))}
              required
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, fontSize: '16px' }}
              placeholder="Enter button link (e.g., #contact, /contact)"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Background Image:</label>
            <div style={{ 
              background: '#f8f9fa', 
              padding: 16, 
              borderRadius: 6, 
              marginBottom: 12,
              border: '1px solid #e9ecef'
            }}>
              <strong>📏 Recommended Size:</strong> 1920×600 pixels
              <br />
              <small style={{ color: '#6c757d' }}>
                • Format: JPG, PNG, WebP
                • Max file size: 2MB
                • Aspect ratio: 3.2:1 (wide banner)
              </small>
            </div>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileSelect}
              style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
            />
          </div>

          {(imagePreview || actionData.backgroundImage) && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Current Image:</label>
              <img 
                src={imagePreview || actionData.backgroundImage} 
                alt="Background Preview" 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: 6,
                  border: '1px solid #ddd'
                }} 
              />
              {selectedFile && (
                <div style={{ marginTop: 8, fontSize: '14px', color: '#059669' }}>
                  📁 New file selected: {selectedFile.name}
                </div>
              )}
            </div>
          )}

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
            {isSubmitting ? 'Updating...' : 'Update Call to Action Section'}
          </button>
        </form>

        {/* Preview Section */}
        <div style={{ marginTop: 32, padding: 20, background: '#f8f9fa', borderRadius: 6 }}>
          <h3 style={{ marginBottom: 16 }}>💡 Preview</h3>
          <div style={{ 
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${imagePreview || actionData.backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '60px 20px',
            borderRadius: 8,
            textAlign: 'center',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '16px', fontWeight: '600' }}>{actionData.title}</h2>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', fontWeight: '400' }}>{actionData.subtitle}</h3>
            <div>
              <a 
                href={actionData.buttonLink} 
                style={{
                  background: '#f59e0b',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  display: 'inline-block'
                }}
              >
                {actionData.buttonText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}



