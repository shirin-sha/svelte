'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    shortDescription: '',
    icon: '', 
    imageFile: null,
    imageUrl: '',
    content: '',
    features: [],
    benefits: [],
    featured: false
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchServices();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title || !formData.description || !formData.shortDescription || !formData.icon || !formData.content) {
      alert('Please fill in all required fields: Title, Description, Short Description, Icon, and Content');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = formData.imageUrl;
      
      // Upload image if file is selected
      if (formData.imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.imageFile);
        
        const uploadResponse = await fetch('/api/upload', { 
          method: 'POST', 
          body: uploadFormData 
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          finalImageUrl = uploadData.url;
        } else {
          alert('Failed to upload image. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }
      
      // Prepare service data
      const serviceData = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription,
        icon: formData.icon,
        imageUrl: finalImageUrl,
        content: formData.content,
        features: formData.features,
        benefits: formData.benefits,
        featured: formData.featured
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
          description: '', 
          shortDescription: '',
          icon: '', 
          imageFile: null,
          imageUrl: '',
          content: '',
          features: [],
          benefits: [],
          featured: false
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
      description: service.description,
      shortDescription: service.shortDescription || '',
      icon: service.icon || '',
      imageFile: null,
      imageUrl: service.imageUrl || '',
      content: service.content || '',
      features: service.features || [],
      benefits: service.benefits || [],
      featured: service.featured || false
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Services</h2>
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
              <label style={{ display: 'block', marginBottom: 4 }}>Short Description:</label>
              <textarea 
                value={formData.shortDescription} 
                onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                required
                rows={2}
                placeholder="Brief description for service cards"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Full Description:</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Content (HTML):</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={6}
                placeholder="Full HTML content for service details page"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4 }}>Icon:</label>
                <input 
                  type="text" 
                  value={formData.icon} 
                  onChange={e => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  required
                  placeholder="icon-construction-machine"
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
                <small style={{ color: '#6c757d' }}>Use icon class names from your CSS</small>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4 }}>Service Image:</label>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: 12, 
                  borderRadius: 4, 
                  marginBottom: 8,
                  border: '1px solid #e9ecef'
                }}>
                  <strong>📏 Recommended Size:</strong> 800×600 pixels (Service detail images)
                  <br />
                  <small style={{ color: '#6c757d' }}>
                    • Format: JPG, PNG, WebP
                    • Max file size: 2MB
                    • Aspect ratio: 4:3 (landscape)
                  </small>
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
                {formData.imageUrl && (
                  <div style={{ marginTop: 8 }}>
                    <img src={formData.imageUrl} alt="Preview" style={{ maxWidth: 200, height: 'auto', borderRadius: 4 }} />
                  </div>
                )}
              </div>
            </div>
            

            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <input 
                  type="checkbox" 
                  checked={formData.featured}
                  onChange={e => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                  style={{ marginRight: 8 }}
                />
                Featured Service
              </label>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Features (one per line):</label>
              <textarea 
                value={formData.features.join('\n')} 
                onChange={e => setFormData(prev => ({ ...prev, features: e.target.value.split('\n').filter(f => f.trim()) }))}
                rows={4}
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Benefits (one per line):</label>
              <textarea 
                value={formData.benefits.join('\n')} 
                onChange={e => setFormData(prev => ({ ...prev, benefits: e.target.value.split('\n').filter(b => b.trim()) }))}
                rows={4}
                placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
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