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
      setLoading(true);
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
      const payload = { ...formData };
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
      } else {
        alert('Failed to save section');
      }
    } catch (error) {
      console.error('Error saving footer section:', error);
      alert('Error saving section');
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
    if (!confirm('Delete this footer section?')) return;
    try {
      const response = await fetch(`/api/content/footer/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchFooterSections();
      }
    } catch (error) {
      console.error('Error deleting footer section:', error);
      alert('Error deleting section');
    }
  };

  const addLink = () => {
    setFormData(prev => ({ ...prev, links: [...prev.links, { text: '', url: '' }] }));
  };
  const updateLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? { ...link, [field]: value } : link)
    }));
  };
  const removeLink = (index) => {
    setFormData(prev => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, { platform: '', url: '', icon: '' }] }));
  };
  const updateSocialLink = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link, i) => i === index ? { ...link, [field]: value } : link)
    }));
  };
  const removeSocialLink = (index) => {
    setFormData(prev => ({ ...prev, socialLinks: prev.socialLinks.filter((_, i) => i !== index) }));
  };

  const toggleActive = async (section) => {
    try {
      const res = await fetch(`/api/content/footer/${section._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...section, isActive: !section.isActive })
      });
      if (res.ok) fetchFooterSections();
    } catch (e) {
      console.error('Error toggling section:', e);
    }
  };

  const swapOrder = async (a, b) => {
    // swap order values between two sections
    try {
      const reqs = [
        fetch(`/api/content/footer/${a._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...a, order: b.order }) }),
        fetch(`/api/content/footer/${b._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, order: a.order }) })
      ];
      await Promise.all(reqs);
      await fetchFooterSections();
    } catch (e) {
      console.error('Error reordering sections:', e);
    }
  };

  const moveUp = (index) => {
    if (index <= 0) return;
    const current = footerSections[index];
    const prev = footerSections[index - 1];
    swapOrder(current, prev);
  };
  const moveDown = (index) => {
    if (index >= footerSections.length - 1) return;
    const current = footerSections[index];
    const next = footerSections[index + 1];
    swapOrder(current, next);
  };

  if (loading) return <AdminLayout title="Footer"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Footer">
      <style jsx>{`
        .card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; box-shadow:0 4px 6px -1px rgba(0,0,0,0.06); }
        .card-header { padding:16px 20px; border-bottom:1px solid #e5e7eb; background:linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%); display:flex; justify-content:space-between; align-items:center; }
        .card-body { padding:20px; }
        .btn { border:none; border-radius:8px; padding:8px 12px; cursor:pointer; font-weight:600; }
        .btn-primary { background:#3b82f6; color:#fff; }
        .btn-success { background:#10b981; color:#fff; }
        .btn-danger { background:#ef4444; color:#fff; }
        .btn-gray { background:#6b7280; color:#fff; }
        table { width:100%; border-collapse:collapse; }
        th, td { padding:12px 16px; border-bottom:1px solid #f3f4f6; text-align:left; }
        th { background:#f9fafb; font-size:12px; text-transform:uppercase; letter-spacing:.05em; color:#374151; }
        input, textarea, select { width:100%; padding:10px 12px; border:1px solid #e5e7eb; border-radius:8px; font-size:14px; }
        .row { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .row-1 { display:grid; grid-template-columns:1fr; gap:16px; }
        .switch { display:inline-flex; align-items:center; gap:8px; }
      `}</style>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <div style={{ fontWeight: 600, color: '#1f2937' }}>Footer Sections</div>
          <button className="btn btn-primary" onClick={() => { setEditingSection(null); setFormData({ section: 'company', title: '', content: '', links: [], contactInfo: { address: '', phone: '', email: '' }, socialLinks: [], order: footerSections.length, isActive: true }); setShowForm(true); }}>+ Add Section</button>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          {footerSections.length === 0 ? (
            <div style={{ color: '#6b7280' }}>No footer sections yet. Click "Add Section" to create one.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Title</th>
                  <th>Order</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {footerSections.map((s, idx) => (
                  <tr key={s._id}>
                    <td style={{ textTransform: 'capitalize' }}>{s.section}</td>
                    <td>{s.title}</td>
                    <td>{s.order}</td>
                    <td>{s.isActive ? 'Active' : 'Hidden'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                        <button className="btn btn-gray" onClick={() => moveUp(idx)} title="Move up">↑</button>
                        <button className="btn btn-gray" onClick={() => moveDown(idx)} title="Move down">↓</button>
                        <button className="btn btn-success" onClick={() => toggleActive(s)}>{s.isActive ? 'Hide' : 'Show'}</button>
                        <button className="btn btn-primary" onClick={() => handleEdit(s)}>Edit</button>
                        <button className="btn btn-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card">
          <div className="card-header">
            <div style={{ fontWeight: 600, color: '#1f2937' }}>{editingSection ? 'Edit Section' : 'Add Section'}</div>
            <button type="button" className="btn btn-gray" onClick={() => { setShowForm(false); setEditingSection(null); }}>Close</button>
          </div>
          <div className="card-body">
            <div className="row">
              <div>
                <label>Section Type</label>
                <select value={formData.section} onChange={e => setFormData(prev => ({ ...prev, section: e.target.value }))}>
                  <option value="company">Company</option>
                  <option value="services">Services</option>
                  <option value="contact">Contact</option>
                  <option value="social">Social</option>
                </select>
              </div>
              <div>
                <label>Title</label>
                <input value={formData.title} onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="row-1">
                <div>
                  <label>Content</label>
                  <textarea value={formData.content} onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))} />
                </div>
              </div>
              <div>
                <label>Order</label>
                <input type="number" value={formData.order} onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input id="active" type="checkbox" checked={formData.isActive} onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} />
                <label htmlFor="active">Active</label>
              </div>
            </div>

            {(formData.section === 'company' || formData.section === 'services') && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Links</div>
                {formData.links.map((link, i) => (
                  <div key={i} className="row" style={{ marginBottom: 8 }}>
                    <div>
                      <label>Text</label>
                      <input value={link.text} onChange={e => updateLink(i, 'text', e.target.value)} />
                    </div>
                    <div>
                      <label>URL</label>
                      <input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} />
                    </div>
                    <div style={{ display:'flex', alignItems:'flex-end' }}>
                      <button type="button" className="btn btn-danger" onClick={() => removeLink(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={addLink}>+ Add Link</button>
              </div>
            )}

            {formData.section === 'contact' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Contact Info</div>
                <div className="row">
                  <div>
                    <label>Address</label>
                    <input value={formData.contactInfo.address} onChange={e => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, address: e.target.value } }))} />
                  </div>
                  <div>
                    <label>Phone</label>
                    <input value={formData.contactInfo.phone} onChange={e => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, phone: e.target.value } }))} />
                  </div>
                  <div>
                    <label>Email</label>
                    <input value={formData.contactInfo.email} onChange={e => setFormData(prev => ({ ...prev, contactInfo: { ...prev.contactInfo, email: e.target.value } }))} />
                  </div>
                </div>
              </div>
            )}

            {formData.section === 'social' && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Social Links</div>
                {formData.socialLinks.map((link, i) => (
                  <div key={i} className="row" style={{ marginBottom: 8 }}>
                    <div>
                      <label>Platform</label>
                      <input value={link.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} />
                    </div>
                    <div>
                      <label>URL</label>
                      <input value={link.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} />
                    </div>
                    <div>
                      <label>Icon (optional)</label>
                      <input value={link.icon} onChange={e => updateSocialLink(i, 'icon', e.target.value)} />
                    </div>
                    <div style={{ display:'flex', alignItems:'flex-end' }}>
                      <button type="button" className="btn btn-danger" onClick={() => removeSocialLink(i)}>Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={addSocialLink}>+ Add Social Link</button>
              </div>
            )}

            <div style={{ display:'flex', justifyContent:'flex-end', gap:12, marginTop:16 }}>
              <button type="button" className="btn btn-gray" onClick={() => { setShowForm(false); setEditingSection(null); }}>Cancel</button>
              <button type="submit" className="btn btn-success">{editingSection ? 'Update Section' : 'Create Section'}</button>
            </div>
          </div>
        </form>
      )}
    </AdminLayout>
  );
} 