'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import Link from 'next/link';

export default function CMSPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchPages();
  }, [router]);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/content/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSectionStatus = async (pageId, sectionName, isActive) => {
    try {
      const response = await fetch(`/api/content/pages/${pageId}/sections/${sectionName}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      
      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Error toggling section:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ef4444';
      case 'read': return '#f59e0b';
      case 'replied': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  if (loading) return <AdminLayout title="CMS"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="CMS Pages">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>CMS Pages</h2>
        <button 
          onClick={() => router.push('/admin/cms/create')}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          Add New Page
        </button>
      </div>

      <div style={{ display: 'grid', gap: 24 }}>
        {pages.map(page => (
          <div key={page._id} style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>{page.name}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button 
                  onClick={() => router.push(`/admin/cms/${page.slug}/edit`)}
                  style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
                >
                  Edit Page
                </button>
                <button 
                  onClick={() => router.push(`/admin/cms/${page.slug}/preview`)}
                  style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Meta Information */}
            <div style={{ background: '#f8f9fa', padding: 16, borderRadius: 6, marginBottom: 16 }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Meta Information</h4>
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
            <div style={{ overflow: 'hidden', borderRadius: 6, border: '1px solid #e5e7eb' }}>
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
                            onClick={() => toggleSectionStatus(page._id, section.name, !section.isActive)}
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
                              onClick={() => router.push(`/admin/cms/${page.slug}/sections/${section.name}/preview`)}
                              style={{ background: '#10b981', color: 'white', border: 'none', padding: '4px 8px', borderRadius: 4, cursor: 'pointer', fontSize: '12px' }}
                            >
                              Preview
                            </button>
                            <button 
                              onClick={() => router.push(`/admin/cms/${page.slug}/sections/${section.name}/edit`)}
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
          </div>
        ))}
      </div>
    </AdminLayout>
  );
} 