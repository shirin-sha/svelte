'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function SectionPreview() {
  const { slug, section } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/content/pages/${slug}/sections/${section}`);
        if (res.ok) setData(await res.json());
      } catch (e) {
        console.error('Error loading section:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, section, router]);

  if (loading) return <AdminLayout title="Preview"><div>Loading...</div></AdminLayout>;
  if (!data) return <AdminLayout title="Preview"><div>Section not found</div></AdminLayout>;

  return (
    <AdminLayout title={`Preview ${section}`}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginTop: 0 }}>{data.title?.en || section}</h2>
        {data.image && (
          <img src={data.image} alt={section} style={{ maxWidth: '100%', height: 'auto', borderRadius: 8, marginBottom: 16 }} />
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <h4>Content (EN)</h4>
            <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>{data.content?.en || '-'}</div>
          </div>
          <div>
            <h4>Content (AR)</h4>
            <div style={{ background: '#f8f9fa', padding: 12, borderRadius: 6, whiteSpace: 'pre-wrap' }}>{data.content?.ar || '-'}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 