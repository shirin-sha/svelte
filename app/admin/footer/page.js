'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function FooterPage() {
  const [footerSections, setFooterSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    section: 'company',
    title: '',
    content: '',
    links: [],
    contactInfo: { address: '', phone: '', email: '' },
    socialLinks: [],
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
    fetchFooterSections();
  }, [router]);

  const fetchFooterSections = async () => {
    try {
      const response = await fetch('/api/content/footer');
      if (response.ok) {
        const data = await response.json();
        setFooterSections(data);
      }
    } catch (error) {
      console.error('Error fetching footer sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSection 
        ? `/api/content/footer/${editingSection._id}`
        : '/api/content/footer';
      
      const method = editingSection ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({
          section: 'company',
          title: '',
          content: '',
          links: [],
          contactInfo: { address: '', phone: '', email: '' },
          socialLinks: [],
          order: 0,
          isActive: true
        });
        setShowForm(false);
        setEditingSection(null);
        fetchFooterSections();
      }
    } catch (error) {
      console.error('Error saving footer section:', error);
    }
  };

  const handleEdit = (section) => {
    setEditingSection(section);
    setFormData({
      section: section.section,
      title: section.title,
      content: section.content,
      links: section.links || [],
      contactInfo: section.contactInfo || { address: '', phone: '', email: '' },
      socialLinks: section.socialLinks || [],
      order: section.order || 0,
      isActive: section.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this footer section?')) return;
    
    try {
      const response = await fetch(`/api/content/footer/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchFooterSections();
      }
    } catch (error) {
      console.error('Error deleting footer section:', error);
    }
  };

  const addLink = () => {
    setFormData(prev => ({
      ...prev,
      links: [...prev.links, { text: '', url: '' }]
    }));
  };

  const updateLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '' }]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <AdminLayout title="Footer"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Footer">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Footer Sections</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Section'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingSection ? 'Edit Footer Section' : 'Add New Footer Section'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Section Type:</label>
              <select 
                value={formData.section} 
                onChange={e => setFormData(prev => ({ ...prev, section: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              >
                <option value="company">Company</option>
                <option value="services">Services</option>
                <option value="contact">Contact</option>
                <option value="social">Social</option>
              </select>
            </div>
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
              <label style={{ display: 'block', marginBottom: 4 }}>Content:</label>
              <textarea 
                value={formData.content} 
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                required
                rows={4}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
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

            {/* Links Section */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Links:</label>
              {formData.links.map((link, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Link Text"
                    value={link.text} 
                    onChange={e => updateLink(index, 'text', e.target.value)}
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <input 
                    type="text" 
                    placeholder="URL"
                    value={link.url} 
                    onChange={e => updateLink(index, 'url', e.target.value)}
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <button 
                    type="button"
                    onClick={() => removeLink(index)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={addLink}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Link
              </button>
            </div>

            {/* Contact Info Section */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Contact Information:</label>
              <input 
                type="text" 
                placeholder="Address"
                value={formData.contactInfo.address} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, address: e.target.value }
                }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 }}
              />
              <input 
                type="text" 
                placeholder="Phone"
                value={formData.contactInfo.phone} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, phone: e.target.value }
                }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, marginBottom: 8 }}
              />
              <input 
                type="email" 
                placeholder="Email"
                value={formData.contactInfo.email} 
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  contactInfo: { ...prev.contactInfo, email: e.target.value }
                }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>

            {/* Social Links Section */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Social Links:</label>
              {formData.socialLinks.map((link, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input 
                    type="text" 
                    placeholder="Platform"
                    value={link.platform} 
                    onChange={e => updateSocialLink(index, 'platform', e.target.value)}
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <input 
                    type="text" 
                    placeholder="URL"
                    value={link.url} 
                    onChange={e => updateSocialLink(index, 'url', e.target.value)}
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <input 
                    type="text" 
                    placeholder="Icon"
                    value={link.icon} 
                    onChange={e => updateSocialLink(index, 'icon', e.target.value)}
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <button 
                    type="button"
                    onClick={() => removeSocialLink(index)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={addSocialLink}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Social Link
              </button>
            </div>

            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
              {editingSection ? 'Update Section' : 'Create Section'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Section</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Content</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Order</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {footerSections.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No footer sections found. Create your first section above.
                </td>
              </tr>
            ) : (
              footerSections.map(section => (
                <tr key={section._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12,
                      background: '#e5e7eb',
                      color: '#374151'
                    }}>
                      {section.section}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{section.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {section.content.substring(0, 50)}...
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{section.order}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(section)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(section._id)}
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