'use client'
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input, Textarea } from '@/components/forms';

export default function TestimonialsPage() {
  const [loading, setLoading] = useState(false);
  const [sectionData, setSectionData] = useState({
    subtitle: '',
    title: '',
    description: ''
  });
  // Why Choose Svelte section
  const [whyChooseItems, setWhyChooseItems] = useState([]);
  const [editingWhyChooseId, setEditingWhyChooseId] = useState(null);
  const [whyChooseFormData, setWhyChooseFormData] = useState({
    icon: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchSectionData();
    fetchWhyChooseItems();
  }, []);

  const fetchWhyChooseItems = async () => {
    try {
      const response = await fetch('/api/content/pages/about/sections/why-choose-us');
      if (response.ok) {
        const data = await response.json();
        if (data && data.features && Array.isArray(data.features)) {
          setWhyChooseItems(data.features);
        } else {
          setWhyChooseItems([]);
        }
      }
    } catch (error) {
      console.error('Error fetching why choose items:', error);
    }
  };

  const fetchSectionData = async () => {
    try {
      const response = await fetch('/api/content/pages/about/sections/testimonials');
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setSectionData({
            subtitle: data.subtitle?.en || '',
            title: data.title?.en || '',
            description: data.description?.en || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  const handleSectionSave = async () => {
    try {
      const payload = {
        title: {
          en: sectionData.title || ''
        },
        subtitle: {
          en: sectionData.subtitle || ''
        },
        description: {
          en: sectionData.description || ''
        }
      };

      const response = await fetch('/api/content/pages/about/sections/testimonials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const responseData = await response.json();

      if (response.ok) {
        alert('Section settings saved successfully!');
        // Reload the data
        await fetchSectionData();
      } else {
        console.error('API Error:', responseData);
        const errorMsg = responseData.message || responseData.error || 'Unknown error';
        alert(`Failed to save section settings: ${errorMsg}`);
      }
    } catch (error) {
      console.error('Error saving section data:', error);
      alert(`Failed to save section settings: ${error.message || 'Network error'}`);
    }
  };


  // Why Choose Svelte handlers
  const handleWhyChooseSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedFeatures;
      
      if (editingWhyChooseId) {
        // Update existing item
        updatedFeatures = whyChooseItems.map((item, index) => 
          index === editingWhyChooseId 
            ? { icon: whyChooseFormData.icon, title: whyChooseFormData.title, description: whyChooseFormData.description }
            : item
        );
      } else {
        // Add new item
        updatedFeatures = [...whyChooseItems, {
          icon: whyChooseFormData.icon,
          title: whyChooseFormData.title,
          description: whyChooseFormData.description
        }];
      }

      const response = await fetch('/api/content/pages/about/sections/why-choose-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: updatedFeatures
        })
      });

      if (response.ok) {
        await fetchWhyChooseItems();
        resetWhyChooseForm();
        alert('Why Choose Svelte item saved successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to save: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving why choose item:', error);
      alert(`Failed to save why choose item: ${error.message}`);
    }
  };

  const handleWhyChooseEdit = (item, index) => {
    setEditingWhyChooseId(index);
    setWhyChooseFormData({
      icon: item.icon || '',
      title: item.title || '',
      description: item.description || ''
    });
  };

  const handleWhyChooseDelete = async (index) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const updatedItems = whyChooseItems.filter((_, i) => i !== index);
      const response = await fetch('/api/content/pages/about/sections/why-choose-us', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          features: updatedItems
        })
      });

      if (response.ok) {
        await fetchWhyChooseItems();
        alert('Item deleted successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete: ${errorData.error || errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(`Failed to delete item: ${error.message}`);
    }
  };

  const resetWhyChooseForm = () => {
    setEditingWhyChooseId(null);
    setWhyChooseFormData({
      icon: '',
      title: '',
      description: ''
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Section Title Management */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ marginBottom: 24 }}>Testimonials Section Settings</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Input
              label="Small Title (Subtitle)"
              value={sectionData.subtitle}
              onChange={(e) => setSectionData(prev => ({ ...prev, subtitle: e.target.value }))}
              style={{ marginBottom: 0 }}
            />
            <Input
              label="Main Title"
              value={sectionData.title}
              onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
              style={{ marginBottom: 0 }}
            />
          </div>
          <Textarea
            label="Description"
            value={sectionData.description}
            onChange={(e) => setSectionData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
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

        {/* Why Choose Svelte Section */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ marginBottom: 24 }}>Why Choose Svelte</h2>
          <form onSubmit={handleWhyChooseSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 2fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>Icon</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    type="text"
                    value={whyChooseFormData.icon}
                    onChange={(e) => setWhyChooseFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="e.g., fas fa-building"
                    required
                    style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 8, fontSize: '14px', fontFamily: 'inherit' }}
                  />
                  <i className={whyChooseFormData.icon} style={{ fontSize: 24, width: 32, textAlign: 'center', color: '#6b7280' }} />
                </div>
              </div>
              <Input
                label="Title"
                value={whyChooseFormData.title}
                onChange={(e) => setWhyChooseFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                style={{ marginBottom: 0 }}
              />
              <Textarea
                label="Description"
                value={whyChooseFormData.description}
                onChange={(e) => setWhyChooseFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                rows={2}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button
                type="submit"
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {editingWhyChooseId ? 'Update Item' : 'Add Item'}
              </button>
              {editingWhyChooseId && (
                <button
                  type="button"
                  onClick={resetWhyChooseForm}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Why Choose Items List */}
          {whyChooseItems.length > 0 && (
            <div style={{ marginTop: 24, borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
              <h3 style={{ marginBottom: 16 }}>Items List</h3>
              <div style={{ display: 'grid', gap: 12 }}>
                {whyChooseItems.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'auto 1fr 2fr auto', 
                    gap: 16, 
                    alignItems: 'center',
                    padding: 16,
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    background: '#f9fafb'
                  }}>
                    <i className={item.icon} style={{ fontSize: 24, color: '#037D88' }} />
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827' }}>{item.title}</div>
                    </div>
                    <div style={{ fontSize: 14, color: '#374151' }}>{item.description}</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleWhyChooseEdit(item, index)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleWhyChooseDelete(index)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>


      </div>
    </AdminLayout>
  );
}