'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input, Textarea } from '@/components/forms';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [sectionData, setSectionData] = useState({
    title: 'Our Services',
    subtitle: 'WHAT WE DO',
    buttonText: 'EXPLORE SERVICE',
    cardImageUrl: 'assets/img/service/service-v2-single-bg.jpg'
  });
  const [sectionUploading, setSectionUploading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    shortDescription: '',
    icon: ''
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchServices();
    fetchSectionData();
  }, [router]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/content/service');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionData = async () => {
    try {
      const response = await fetch('/api/content/pages/home/sections/services');
      if (response.ok) {
        const section = await response.json();
        let parsed = null;
        try {
          parsed = section?.content?.en ? JSON.parse(section.content.en) : null;
        } catch (_) {
          parsed = null;
        }
        if (parsed) {
          setSectionData(prev => ({
            ...prev,
            title: parsed.title || prev.title,
            subtitle: parsed.subtitle || prev.subtitle,
            buttonText: parsed.buttonText || prev.buttonText,
            cardImageUrl: parsed.cardImageUrl || prev.cardImageUrl
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  const handleSectionSave = async () => {
    try {
      const payload = {
        content: {
          en: JSON.stringify(sectionData)
        }
      };
      
      const res = await fetch('/api/content/pages/home/sections/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert('Services section updated successfully!');
        await fetchSectionData();
      } else {
        alert('Failed to save section changes');
      }
    } catch (error) {
      console.error('Error saving section data:', error);
      alert('Error saving section changes');
    }
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    setSectionUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setSectionData(prev => ({ ...prev, cardImageUrl: json.url }));
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setSectionUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.shortDescription || !formData.icon) {
      alert('Please fill in all required fields: Title, Short Description, and Icon');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare service data (minimal fields)
      const serviceData = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        icon: formData.icon
      };
      console.log(serviceData);
      const url = editingService 
        ? `/api/content/service/${editingService._id}`
        : '/api/content/service';
      
      const method = editingService ? 'PUT' : 'POST';
      
      console.log('Submitting service data:', serviceData);
      console.log('Form data before submission:', formData);
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Service saved successfully:', result);
        
        setFormData({ 
          title: '', 
          shortDescription: '',
          icon: ''
        });
        setShowForm(false);
        setEditingService(null);
        fetchServices();
        alert(editingService ? 'Service updated successfully!' : 'Service created successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert(`Error: ${errorData.error || 'Failed to save service'}`);
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      shortDescription: service.shortDescription || '',
      icon: service.icon || ''
    });
    setShowForm(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Store file for later upload
    setFormData(prev => ({ 
      ...prev, 
      imageFile: file,
      imageUrl: URL.createObjectURL(file) // For preview
    }));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    
    try {
      const response = await fetch(`/api/content/service/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchServices();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  if (loading) return <AdminLayout title="Services"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Services">
      {/* Section Title Form */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 24 }}>Services Section Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Small Title (Subtitle)
            </label>
            <input
              type="text"
              value={sectionData.subtitle}
              onChange={(e) => setSectionData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g., WHAT WE DO"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Main Title
            </label>
            <input
              type="text"
              value={sectionData.title}
              onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Our Services"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Button Text
            </label>
            <input
              type="text"
              value={sectionData.buttonText}
              onChange={(e) => setSectionData(prev => ({ ...prev, buttonText: e.target.value }))}
              placeholder="e.g., EXPLORE SERVICE"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Card Image
            </label>
            {sectionData.cardImageUrl && (
              <div style={{ marginBottom: 8 }}>
                <img src={sectionData.cardImageUrl} alt="Card background" style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} />
              </div>
            )}
            <input 
              type="file" 
              accept="image/*"
              onChange={handleSectionImageUpload}
              disabled={sectionUploading}
              style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }}
            />
            {sectionUploading && <div style={{ color: '#3b82f6', fontSize: 12, marginTop: 6 }}>Uploading...</div>}
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button 
            onClick={handleSectionSave}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            Save Section Settings
          </button>
        </div>
      </div>

      {/* Services Management */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Services List</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit}>
            <Input
              label="Title"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            
            <Textarea
              label="Short Description"
              value={formData.shortDescription}
              onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              required
              rows={2}
              placeholder="Brief description for service cards"
            />
            
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>Icon</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input 
                  type="text" 
                  value={formData.icon} 
                  onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  required
                  placeholder="Enter icon"
                  style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 8, fontSize: '14px', fontFamily: 'inherit' }}
                />
                <i className={formData.icon} style={{ fontSize: 24, width: 28, textAlign: 'center' }} />
              </div>
            </div>
            
            
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
              {editingService ? 'Update Service' : 'Create Service'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Icon</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Featured</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No services found. Create your first service above.
                </td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span className={service.icon} style={{ fontSize: 24 }}></span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{service.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 4,
                      fontSize: '12px',
                      background: service.featured ? '#dbeafe' : '#f3f4f6',
                      color: service.featured ? '#1e40af' : '#6b7280'
                    }}>
                      {service.featured ? 'Featured' : 'Regular'}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(service)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service._id)}
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