'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function PageEditor() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [metaData, setMetaData] = useState({
    metaTitle: { en: '', ar: '' },
    metaDescription: { en: '', ar: '' }
  });
  const router = useRouter();
  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPage();
  }, [slug, router]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/content/pages/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setPage(data);
        setMetaData({
          metaTitle: data.metaTitle || { en: '', ar: '' },
          metaDescription: data.metaDescription || { en: '', ar: '' }
        });
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMetaData = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/content/pages/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaData)
      });
      
      if (response.ok) {
        setShowMetaForm(false);
        fetchPage();
      }
    } catch (error) {
      console.error('Error updating meta data:', error);
    } finally {
      setSaving(false);
    }
  };

  const toggleSectionStatus = async (sectionName, isActive) => {
    try {
      const response = await fetch(`/api/content/pages/${slug}/sections/${sectionName}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        fetchPage();
      }
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  if (loading) return <AdminLayout title="Page Editor"><div>Loading...</div></AdminLayout>;
  if (!page) return <AdminLayout title="Page Editor"><div>Page not found</div></AdminLayout>;

  return (
    <AdminLayout title={`Edit ${page.name}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>{page.name}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            onClick={() => setShowMetaForm(!showMetaForm)}
            style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
          >
            {showMetaForm ? 'Cancel' : 'Edit Meta'}
          </button>
          <button 
            onClick={() => router.push(`/admin/cms/${slug}/preview`)}
            style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Meta Information Form */}
      {showMetaForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3 style={{ marginBottom: 16 }}>Meta Information</h3>
          <div style={{ display: 'grid', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Page Title (English)</label>
              <input 
                type="text" 
                value={metaData.metaTitle.en} 
                onChange={e => setMetaData(prev => ({ ...prev, metaTitle: { ...prev.metaTitle, en: e.target.value } }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Page Title (Arabic)</label>
              <input 
                type="text" 
                value={metaData.metaTitle.ar} 
                onChange={e => setMetaData(prev => ({ ...prev, metaTitle: { ...prev.metaTitle, ar: e.target.value } }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Page Description (English)</label>
              <textarea 
                value={metaData.metaDescription.en} 
                onChange={e => setMetaData(prev => ({ ...prev, metaDescription: { ...prev.metaDescription, en: e.target.value } }))}
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 4 }}>Page Description (Arabic)</label>
              <textarea 
                value={metaData.metaDescription.ar} 
                onChange={e => setMetaData(prev => ({ ...prev, metaDescription: { ...prev.metaDescription, ar: e.target.value } }))}
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <button 
              onClick={updateMetaData}
              disabled={saving}
              style={{ 
                background: saving ? '#9ca3af' : '#10b981', 
                color: 'white', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: 6, 
                cursor: saving ? 'not-allowed' : 'pointer' 
              }}
            >
              {saving ? 'Saving...' : 'Update Meta'}
            </button>
          </div>
        </div>
      )}

      {/* Current Meta Information */}
      <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 6, marginBottom: 24 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Current Meta Information</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Title (EN)</label>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{page.metaTitle?.en || 'Not set'}</div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Title (AR)</label>
            <div style={{ fontSize: '14px', fontWeight: '500' }}>{page.metaTitle?.ar || 'Not set'}</div>
          </div>
        </div>
      </div>

      {/* Sections Table */}
      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0 }}>Page Sections</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>Section</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>Title (EN)</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>Title (AR)</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>Image</th>
              <th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>ON/OFF</th>
              <th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb', fontSize: '14px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {page.sections?.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No sections found for this page.
                </td>
              </tr>
            ) : (
              page.sections?.map((section, index) => (
                <tr key={index}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>
                    {section.name}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {section.title?.en || '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {section.title?.ar || '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {section.image ? (
                      <img 
                        src={section.image} 
                        alt={section.name} 
                        style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4 }} 
                      />
                    ) : (
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>No Image</div>
                    )}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleSectionStatus(section.name, !section.isActive)}
                      style={{
                        background: section.isActive ? '#10b981' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '4px 12px',
                        borderRadius: 12,
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {section.isActive ? 'ON' : 'OFF'}
                    </button>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                      <button 
                        onClick={() => router.push(`/admin/cms/${slug}/sections/${section.name}/preview`)}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                      >
                        Preview
                      </button>
                      <button 
                        onClick={() => router.push(`/admin/cms/${slug}/sections/${section.name}/edit`)}
                        style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                    </div>
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