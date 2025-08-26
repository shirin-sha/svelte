"use client";
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({ children, title }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f4f5' }}>
      <AdminSidebar />
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        marginLeft: '220px' // Account for fixed sidebar width
      }}>
        <AdminHeader title={title} />
        <main style={{ 
          flex: 1, 
          padding: 32,
          overflow: 'auto' // Allow content to scroll
        }}>
          {children}
        </main>
      </div>
    </div>
  );
} 