'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <AdminLayout title="Dashboard">
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 32 }}>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>0</div>
          <div style={{ color: '#71717a' }}>Banners</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>0</div>
          <div style={{ color: '#71717a' }}>Services</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>0</div>
          <div style={{ color: '#71717a' }}>Projects</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>0</div>
          <div style={{ color: '#71717a' }}>Team</div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32, minWidth: 220, flex: 1 }}>
          <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>0</div>
          <div style={{ color: '#71717a' }}>Blog</div>
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 32 }}>
        <h3 style={{ margin: 0, marginBottom: 16 }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/admin/banners" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Manage Banners</a>
          <a href="/admin/services" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Manage Services</a>
          <a href="/admin/projects" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Manage Projects</a>
          <a href="/admin/team" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Manage Team</a>
          <a href="/admin/blog" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}>Manage Blog</a>
        </div>
      </div>
    </AdminLayout>
  );
} 