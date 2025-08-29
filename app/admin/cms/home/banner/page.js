'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({ title: '', subtitle: '', imageUrl: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBanners();
  }, [router]);

  const fetchBanners = async () => {
    try {
      const response = await fetch('/api/content/banner');
      if (response.ok) {
        const data = await response.json();
        setBanners(data);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload/banner', { 
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
      let imageUrl = formData.imageUrl; // Keep existing image if no new file selected

      // Upload new image if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const url = editingBanner 
        ? `/api/content/banner/${editingBanner._id}`
        : '/api/content/banner';
      
      const method = editingBanner ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          imageUrl
        })
      });
      
      if (response.ok) {
        // Reset form
        setFormData({ title: '', subtitle: '', imageUrl: '' });
        setSelectedFile(null);
        setImagePreview('');
        setShowForm(false);
        setEditingBanner(null);
        fetchBanners();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to save banner');
      }
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Failed to save banner. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || '',
      imageUrl: banner.imageUrl
    });
    setImagePreview(banner.imageUrl);
    setSelectedFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const response = await fetch(`/api/content/banner/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchBanners();
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', imageUrl: '' });
    setSelectedFile(null);
    setImagePreview('');
    setEditingBanner(null);
    setShowForm(false);
  };

  if (loading) return <AdminLayout title="Banners"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Banners">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Banners</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Banner'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title:</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Subtitle:</label>
              <input 
                type="text" 
                value={formData.subtitle} 
                onChange={e => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Image:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef'
              }}>
                <strong>📏 Recommended Size:</strong> 1920×600 pixels (Banner/Header images)
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
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            {(imagePreview || formData.imageUrl) && (
              <div style={{ marginBottom: 16 }}>
                <img 
                  src={imagePreview || formData.imageUrl} 
                  alt="Preview" 
                  style={{ maxWidth: 200, height: 'auto', borderRadius: 4 }} 
                />
                {selectedFile && (
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#6c757d' }}>
                    📁 New file selected: {selectedFile.name}
                  </div>
                )}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{ 
                  background: isSubmitting ? '#9ca3af' : '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: 6, 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer' 
                }}
              >
                {isSubmitting ? 'Saving...' : (editingBanner ? 'Update Banner' : 'Create Banner')}
              </button>
              <button 
                type="button"
                onClick={resetForm}
                style={{ 
                  background: '#6b7280', 
                  color: 'white', 
                  border: 'none', 
                  padding: '10px 20px', 
                  borderRadius: 6, 
                  cursor: 'pointer' 
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Image</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Subtitle</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No banners found. Create your first banner above.
                </td>
              </tr>
            ) : (
              banners.map(banner => (
                <tr key={banner._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <img src={banner.imageUrl} alt={banner.title} style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{banner.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{banner.subtitle}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(banner)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(banner._id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
} 