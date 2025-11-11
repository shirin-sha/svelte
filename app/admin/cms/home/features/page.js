'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Input, Textarea } from '@/components/forms';

export default function FeaturesAdminPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSection();
  }, []);

  const fetchSection = async () => {
    try {
      const res = await fetch('/api/content/pages/home/sections/features');
      if (res.ok) {
        const section = await res.json();
        let parsed = null;
        try {
          parsed = section?.content?.en ? JSON.parse(section.content.en) : null;
        } catch (_) {
          parsed = null;
        }
        const dynamicItems = (parsed?.items || [
          { title: 'Creative Design', subtitle: 'Tailored concepts that reflect your brand and lifestyle.', iconClass: 'fas fa-drafting-compass', link: '/about' },
          { title: 'Expert Fit-Out', subtitle: 'Quality craftsmanship with rigorous QA/QC at every stage.', iconClass: 'fas fa-tools', link: '/service' },
          { title: 'On-Time Delivery', subtitle: 'Clear schedules, proactive, zero surprises.', iconClass: 'fas fa-calendar-check', link: '/projects' }
        ]).map(item => ({
          title: item.title || '',
          subtitle: item.subtitle || '',
          iconClass: item.iconClass || 'fas fa-circle',
          link: item.link || '#'
        }));
        setItems(dynamicItems.slice(0, 12));
      }
    } catch (e) {
      console.error('Failed to load features:', e);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems(prev => [...prev, { title: '', subtitle: '', iconClass: '', link: '' }]);
  };

  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItem = (index, key, value) => {
    setItems(prev => prev.map((it, i) => i === index ? { ...it, [key]: value } : it));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        content: {
          en: JSON.stringify({ items })
        }
      };
      const res = await fetch('/api/content/pages/home/sections/features', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchSection();
        alert('Features updated successfully');
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error('Save error:', e);
      alert('Error while saving');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Home Features">
      <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>Features Items</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addItem} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer' }}>+ Add Item</button>
            <button onClick={handleSave} disabled={saving} style={{ background: saving ? '#9ca3af' : '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: saving ? 'not-allowed' : 'pointer' }}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {items.length === 0 && (
              <div style={{ color: '#6b7280' }}>No items. Click "+ Add Item" to create one.</div>
            )}
            {items.map((item, index) => (
              <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1.5fr 1fr auto', gap: 12, alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
                <Input
                  label="Title"
                  value={item.title}
                  onChange={e => updateItem(index, 'title', e.target.value)}
                  placeholder="Feature title"
                  style={{ marginBottom: 0, fontSize: '12px' }}
                />
                <Textarea
                  label="Subtitle"
                  value={item.subtitle || ''}
                  onChange={e => updateItem(index, 'subtitle', e.target.value)}
                  placeholder="Short supporting text"
                  rows={3}
                  style={{ marginBottom: 0, fontSize: '12px' }}
                />
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Icon</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className={item.iconClass} style={{ fontSize: 22, width: 28, textAlign: 'center' }}></i>
                    <input
                      type="text"
                      value={item.iconClass || ''}
                      onChange={e => updateItem(index, 'iconClass', e.target.value)}
                      placeholder="Enter icon"
                      style={{ flex: 1, padding: 8, border: '1px solid #e5e7eb', borderRadius: 6 }}
                    />
                  </div>
                </div>
                <Input
                  label="Plus Link URL"
                  value={item.link || ''}
                  onChange={e => updateItem(index, 'link', e.target.value)}
                  placeholder="e.g., /about"
                  style={{ marginBottom: 0, fontSize: '12px' }}
                />
                <div>
                  <button onClick={() => removeItem(index)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 