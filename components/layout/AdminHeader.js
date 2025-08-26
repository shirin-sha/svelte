"use client";

export default function AdminHeader({ title = 'Dashboard' }) {
  return (
    <header style={{
      width: '100%',
      background: '#fff',
      color: '#18181b',
      padding: '18px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <h2 style={{ margin: 0, fontWeight: 700, fontSize: 24 }}>{title}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 18, color: '#18181b' }}>
          AD
        </div>
      </div>
    </header>
  );
} 