'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function SectionEditor() {
  const { slug, section } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSection();
  }, [slug, section, router]);

  const fetchSection = async () => {
    try {
      const res = await fetch(`/api/content/pages/${slug}/sections/${section}`);
      if (res.ok) {
        const sec = await res.json();
        setData(sec);
        setImagePreview(sec.image || '');
      }
    } catch (e) {
      console.error('Error loading section:', e);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = data.image;
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }
      const res = await fetch(`/api/content/pages/${slug}/sections/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          image: imageUrl
        })
      });
      if (res.ok) {
        router.push(`/admin/cms/${slug}`);
      }
    } catch (e) {
      console.error('Error saving section:', e);
      alert('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout title="Edit Section"><div>Loading...</div></AdminLayout>;
  if (!data) return <AdminLayout title="Edit Section"><div>Section not found</div></AdminLayout>;

  return (
    <AdminLayout title={`Edit ${section}`}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', maxWidth: 900 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Title (EN)</label>
            <input
              type="text"
              value={data.title?.en || ''}
              onChange={e => setData(prev => ({ ...prev, title: { ...prev.title, en: e.target.value } }))}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4 }}>Title (AR)</label>
            <input
              type="text"
              value={data.title?.ar || ''}
              onChange={e => setData(prev => ({ ...prev, title: { ...prev.title, ar: e.target.value } }))}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Content (EN)</label>
            <textarea
              rows={4}
              value={data.content?.en || ''}
              onChange={e => setData(prev => ({ ...prev, content: { ...prev.content, en: e.target.value } }))}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Content (AR)</label>
            <textarea
              rows={4}
              value={data.content?.ar || ''}
              onChange={e => setData(prev => ({ ...prev, content: { ...prev.content, ar: e.target.value } }))}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: 4 }}>Image</label>
            <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setSelectedFile(f); setImagePreview(URL.createObjectURL(f)); } }} />
            {(imagePreview || data.image) && (
              <div style={{ marginTop: 8 }}>
                <img src={imagePreview || data.image} alt="Preview" style={{ maxWidth: 300, height: 'auto', borderRadius: 6 }} />
              </div>
            )}
          </div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving} style={{ background: saving ? '#9ca3af' : '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} style={{ background: '#6b7280', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </AdminLayout>
  );
} 