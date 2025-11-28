'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function ServicesCMSPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionUploading, setSectionUploading] = useState(false);
  const [cardImageUrl, setCardImageUrl] = useState('assets/img/service/service-v2-single-bg.jpg');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    icon: '',
    imageUrl: '',
    content: ''
  });
  const router = useRouter();
  const quillRef = useRef(null);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['link', 'blockquote', 'clean']
    ],
    clipboard: {
      matchVisual: true
    }
  }), []);

  // Preserve formatting when pasting from PDF or other sources
  useEffect(() => {
    if (quillRef.current && typeof window !== 'undefined') {
      const quill = quillRef.current.getEditor();
      
      // Override the default paste behavior
      quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
        const ops = [];
        delta.ops.forEach(op => {
          if (op.insert && typeof op.insert === 'string') {
            const attrs = {};
            
            // Preserve bold
            if (node.style?.fontWeight === 'bold' || parseInt(node.style?.fontWeight) >= 600 || 
                node.tagName === 'STRONG' || node.tagName === 'B') {
              attrs.bold = true;
            }
            
            // Preserve italic
            if (node.style?.fontStyle === 'italic' || 
                node.tagName === 'EM' || node.tagName === 'I') {
              attrs.italic = true;
            }
            
            // Preserve underline
            if (node.style?.textDecoration?.includes('underline') || node.tagName === 'U') {
              attrs.underline = true;
            }
            
            // Preserve strikethrough
            if (node.style?.textDecoration?.includes('line-through') || 
                node.tagName === 'S' || node.tagName === 'STRIKE') {
              attrs.strike = true;
            }
            
            // Preserve color
            if (node.style?.color) {
              attrs.color = node.style.color;
            }
            
            // Preserve background
            if (node.style?.backgroundColor) {
              attrs.background = node.style.backgroundColor;
            }
            
            // Preserve header tags
            if (node.tagName === 'H1') attrs.header = 1;
            if (node.tagName === 'H2') attrs.header = 2;
            if (node.tagName === 'H3') attrs.header = 3;
            
            ops.push({
              insert: op.insert,
              attributes: { ...op.attributes, ...attrs }
            });
          } else {
            ops.push(op);
          }
        });
        
        delta.ops = ops;
        return delta;
      });
    }
  }, []);

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
        try { parsed = section?.content?.en ? JSON.parse(section.content.en) : null; } catch (_) { parsed = null; }
        if (parsed?.cardImageUrl) {
          setCardImageUrl(parsed.cardImageUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('File size must be less than 2MB'); return; }
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    setSectionUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) throw new Error('Upload failed');
      const json = await res.json();
      setCardImageUrl(json.url);
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    } finally {
      setSectionUploading(false);
    }
  };

  const handleSectionSave = async () => {
    try {
      const payload = {
        content: { en: JSON.stringify({ cardImageUrl }) }
      };
      const res = await fetch('/api/content/pages/home/sections/services', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert('Card image saved');
        await fetchSectionData();
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription || !formData.icon || !formData.imageUrl || !formData.content) {
      alert('Please fill all required fields (Title, Icon, Short Description, Main Description, Image)');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        icon: formData.icon,
        description: editingService?.description || '',
        imageUrl: formData.imageUrl,
        content: formData.content
      };
      const url = editingService ? `/api/content/service/${editingService._id}` : '/api/content/service';
      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to save');
      }
      await fetchServices();
      setFormData({
        title: '',
        shortDescription: '',
        icon: '',
        imageUrl: '',
        content: ''
      });
      setEditingService(null);
      setShowForm(false);
      alert('Saved');
    } catch (e) {
      alert(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      shortDescription: service.shortDescription || '',
      icon: service.icon || '',
      imageUrl: service.imageUrl || '',
      content: service.content || ''
    });
    setShowForm(true);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert('Image must be under 3MB');
      return;
    }
    
    setImageUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      if (!res.ok) {
        alert('Upload failed');
        return;
      }
      
      const json = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: json.url }));
    } catch (error) {
      console.error(error);
      alert('Failed to upload image');
    } finally {
      setImageUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch(`/api/content/service/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchServices();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <AdminLayout title="Services"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Services CMS">
      {/* Services Section Settings (Card Image only) */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 16 }}>Services Section Settings</h2>
        <div>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>Card Image</label>
          {cardImageUrl && (
            <div style={{ marginBottom: 8 }}>
              <img src={cardImageUrl} alt="Card background" style={{ maxWidth: '100%', height: 'auto', borderRadius: 6 }} />
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleSectionImageUpload} disabled={sectionUploading} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
          {sectionUploading && <div style={{ color: '#3b82f6', fontSize: 12, marginTop: 6 }}>Uploading...</div>}
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={handleSectionSave} style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>Save Section Settings</button>
        </div>
      </div>

      {/* Services List (with Add/Edit like home services admin) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>Services List</h2>
        <button onClick={() => { setEditingService(null); setShowForm(!showForm); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>
          {showForm ? 'Cancel' : 'Add New Service'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151' }}>Title</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} required style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8 }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151' }}>Icon</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))} required placeholder="e.g., fas fa-tools" style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 8 }} />
                  <span className={formData.icon} style={{ fontSize: 22, width: 28, textAlign: 'center' }} />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151' }}>Short Description</label>
              <textarea value={formData.shortDescription} onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))} required rows={2} style={{ width: '100%', padding: 12, border: '1px solid #d1d5db', borderRadius: 8 }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151' }}>Card Image</label>
              {formData.imageUrl && (
                <div style={{ marginBottom: 8, display: 'inline-flex', border: '1px solid #e5e7eb', padding: 8, borderRadius: 10, background: '#f9fafb' }}>
                  <img
                    src={formData.imageUrl}
                    alt="Service preview"
                    onError={(e) => {
                      console.error('Image failed to load:', formData.imageUrl);
                      // Try without cache-busting parameter
                      const urlWithoutParam = formData.imageUrl.split('?')[0];
                      if (e.target.src !== urlWithoutParam) {
                        e.target.src = urlWithoutParam;
                      } else {
                        e.target.style.display = 'none';
                      }
                    }}
                    style={{ width: 180, height: 110, objectFit: 'cover', borderRadius: 6, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
                  />
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} disabled={imageUploading} style={{ width: '100%', padding: 10, border: '1px solid #d1d5db', borderRadius: 8 }} />
              {imageUploading && <p style={{ color: '#3b82f6', fontSize: 12, marginTop: 6 }}>Uploading image...</p>}
            </div>
              <div style={{ marginTop: 12 }}>
                <label style={{ display: 'block', marginBottom: 6, fontWeight: 600, color: '#374151' }}>Main Description</label>
                <div style={{ border: '1px solid #d1d5db', borderRadius: 8, overflow: 'hidden' }}>
                  <ReactQuill 
                    ref={quillRef}
                    value={formData.content} 
                    onChange={(val) => setFormData(prev => ({ ...prev, content: val }))} 
                    modules={quillModules} 
                    theme="snow"
                    formats={[
                      'header', 'bold', 'italic', 'underline', 'strike',
                      'list', 'bullet', 'color', 'background', 'align',
                      'link', 'blockquote'
                    ]}
                  />
                </div>
              </div>
            <div style={{ marginTop: 12 }}>
              <button type="submit" disabled={isSubmitting} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 6, cursor: 'pointer' }}>
                {editingService ? 'Update Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      )}
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Icon</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Short Description</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No services found.
                </td>
              </tr>
            ) : (
              services.map(service => (
                <tr key={service._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span className={service.icon} style={{ fontSize: 24 }}></span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{service.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', color: '#6b7280' }}>{service.shortDescription || ''}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button onClick={() => handleEdit(service)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => handleDelete(service._id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
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


