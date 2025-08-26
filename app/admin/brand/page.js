'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    size: { width: 150, height: 80 },
    description: '',
    website: '',
    order: 0,
    isActive: true
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBrands();
  }, [router]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/content/brand');
      if (response.ok) {
        const data = await response.json();
        setBrands(data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingBrand 
        ? `/api/content/brand/${editingBrand._id}`
        : '/api/content/brand';
      
      const method = editingBrand ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({
          name: '',
          logo: '',
          size: { width: 150, height: 80 },
          description: '',
          website: '',
          order: 0,
          isActive: true
        });
        setShowForm(false);
        setEditingBrand(null);
        fetchBrands();
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      logo: brand.logo,
      size: brand.size || { width: 150, height: 80 },
      description: brand.description || '',
      website: brand.website || '',
      order: brand.order || 0,
      isActive: brand.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;
    
    try {
      const response = await fetch(`/api/content/brand/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchBrands();
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'brands');

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, logo: data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) return <AdminLayout title="Brands"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Brands">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Brands</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Brand'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Brand Name:</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Logo:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef'
              }}>
                <strong>📏 Recommended Size:</strong> 150×80 pixels (Brand logos)
                <br />
                <small style={{ color: '#6c757d' }}>
                  • Format: PNG (transparent background preferred)
                  • Max file size: 500KB
                  • Aspect ratio: 1.875:1 (wide logo)
                  • Background: Transparent or white
                </small>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            {formData.logo && (
              <div style={{ marginBottom: 16 }}>
                <img src={formData.logo} alt="Preview" style={{ maxWidth: 200, height: 'auto' }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Description:</label>
              <textarea 
                value={formData.description} 
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Website:</label>
              <input 
                type="url" 
                value={formData.website} 
                onChange={e => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://example.com"
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Width (px):</label>
                <input 
                  type="number" 
                  value={formData.size.width} 
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    size: { ...prev.size, width: parseInt(e.target.value) }
                  }))}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Height (px):</label>
                <input 
                  type="number" 
                  value={formData.size.height} 
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    size: { ...prev.size, height: parseInt(e.target.value) }
                  }))}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Order:</label>
              <input 
                type="number" 
                value={formData.order} 
                onChange={e => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
              {editingBrand ? 'Update Brand' : 'Create Brand'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Logo</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Size</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Website</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No brands found. Create your first brand above.
                </td>
              </tr>
            ) : (
              brands.map(brand => (
                <tr key={brand._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <img 
                      src={brand.logo} 
                      alt={brand.name} 
                      style={{ 
                        width: brand.size?.width || 150, 
                        height: brand.size?.height || 80, 
                        objectFit: 'contain',
                        borderRadius: 4 
                      }} 
                    />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{brand.name}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {brand.size?.width || 150} × {brand.size?.height || 80} px
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {brand.website ? (
                      <a href={brand.website} target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb' }}>
                        {brand.website}
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{brand.order}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(brand)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(brand._id)}
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