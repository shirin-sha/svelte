'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ContactCMS() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [contact, setContact] = useState({
    address: '',
    phone: '',
    email: '',
    secondaryPhone: '',
    secondaryEmail: '',
    mapUrl: '',
    pageTitle: '',
    pageDescription: '',
    formTitle: '',
    formSubtitle: '',
    showNameField: true,
    showEmailField: true,
    showPhoneField: true,
    showSubjectField: true,
    showMessageField: true,
    nameLabel: '',
    emailLabel: '',
    phoneLabel: '',
    subjectLabel: '',
    messageLabel: '',
    submitButtonText: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContact();
  }, [router]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/content/contact');
      if (res.ok) {
        const data = await res.json();
        setContact(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.error('Error fetching contact settings:', e);
      alert('Failed to load contact settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setContact(prev => ({ ...prev, [field]: value }));
  };

  const handleToggle = (field) => {
    setContact(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
      });
      if (res.ok) {
        await fetchContact();
        alert('Contact settings saved.');
      } else {
        alert('Failed to save contact settings');
      }
    } catch (e) {
      console.error('Error saving contact settings:', e);
      alert('Error saving contact settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Contact CMS">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400, color: '#6b7280' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
            <p>Loading contact settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact Page CMS">
      <style jsx>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .card-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); font-weight: 600; color: #111827; }
        .card-body { padding: 20px; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .grid-1 { display: grid; grid-template-columns: 1fr; gap: 16px; }
        label { display: block; margin-bottom: 6px; font-size: 13px; color: #374151; font-weight: 600; }
        input, textarea { width: 100%; padding: 10px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; }
        textarea { min-height: 90px; }
        .switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
        .switch input { display: none; }
        .switch-track { width: 46px; height: 26px; background: #e5e7eb; border-radius: 13px; position: relative; transition: all .2s; }
        .switch-thumb { position: absolute; top: 3px; left: 3px; width: 20px; height: 20px; background: #fff; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2); transition: all .2s; }
        .switch input:checked + .switch-track { background: #10b981; }
        .switch input:checked + .switch-track .switch-thumb { transform: translateX(20px); }
        .actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; }
        .btn { border: none; border-radius: 8px; padding: 10px 16px; cursor: pointer; font-weight: 600; }
        .btn-primary { background: #10b981; color: #fff; }
        .btn-secondary { background: #6b7280; color: #fff; }
      `}</style>

      <form onSubmit={handleSave} className="card" style={{ overflow: 'hidden' }}>
        <div className="card-header">Page Content</div>
        <div className="card-body grid-2">
          <div>
            <label>Page Title</label>
            <input value={contact.pageTitle || ''} onChange={e => handleChange('pageTitle', e.target.value)} />
          </div>
          <div>
            <label>Form Title</label>
            <input value={contact.formTitle || ''} onChange={e => handleChange('formTitle', e.target.value)} />
          </div>
          <div className="grid-1">
            <div>
              <label>Page Description</label>
              <textarea value={contact.pageDescription || ''} onChange={e => handleChange('pageDescription', e.target.value)} />
            </div>
            <div>
              <label>Form Subtitle</label>
              <textarea value={contact.formSubtitle || ''} onChange={e => handleChange('formSubtitle', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="card-header">Contact Information</div>
        <div className="card-body grid-2">
          <div>
            <label>Address</label>
            <input value={contact.address || ''} onChange={e => handleChange('address', e.target.value)} />
          </div>
          <div>
            <label>Map Embed URL</label>
            <input value={contact.mapUrl || ''} onChange={e => handleChange('mapUrl', e.target.value)} />
          </div>
          <div>
            <label>Primary Phone</label>
            <input value={contact.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
          </div>
          <div>
            <label>Secondary Phone</label>
            <input value={contact.secondaryPhone || ''} onChange={e => handleChange('secondaryPhone', e.target.value)} />
          </div>
          <div>
            <label>Primary Email</label>
            <input value={contact.email || ''} onChange={e => handleChange('email', e.target.value)} />
          </div>
          <div>
            <label>Secondary Email</label>
            <input value={contact.secondaryEmail || ''} onChange={e => handleChange('secondaryEmail', e.target.value)} />
          </div>
        </div>

        <div className="card-header">Form Field Labels</div>
        <div className="card-body grid-2">
          <div>
            <label>Name Label</label>
            <input value={contact.nameLabel || ''} onChange={e => handleChange('nameLabel', e.target.value)} />
          </div>
          <div>
            <label>Email Label</label>
            <input value={contact.emailLabel || ''} onChange={e => handleChange('emailLabel', e.target.value)} />
          </div>
          <div>
            <label>Phone Label</label>
            <input value={contact.phoneLabel || ''} onChange={e => handleChange('phoneLabel', e.target.value)} />
          </div>
          <div>
            <label>Subject Label</label>
            <input value={contact.subjectLabel || ''} onChange={e => handleChange('subjectLabel', e.target.value)} />
          </div>
          <div>
            <label>Message Label</label>
            <input value={contact.messageLabel || ''} onChange={e => handleChange('messageLabel', e.target.value)} />
          </div>
          <div>
            <label>Submit Button Text</label>
            <input value={contact.submitButtonText || ''} onChange={e => handleChange('submitButtonText', e.target.value)} />
          </div>
        </div>

        <div className="card-header">Field Visibility</div>
        <div className="card-body" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16 }}>
          {[
            ['showNameField', 'Show Name Field'],
            ['showEmailField', 'Show Email Field'],
            ['showPhoneField', 'Show Phone Field'],
            ['showSubjectField', 'Show Subject Field'],
            ['showMessageField', 'Show Message Field']
          ].map(([key, label]) => (
            <label key={key} className="switch" title={label}>
              <input type="checkbox" checked={!!contact[key]} onChange={() => handleToggle(key)} />
              <span className="switch-track"><span className="switch-thumb"></span></span>
              <span style={{ fontSize: 13, color: '#374151' }}>{label}</span>
            </label>
          ))}
        </div>

        <div className="actions">
          <button type="button" className="btn btn-secondary" onClick={() => router.push('/admin/dashboard')}>Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </form>
    </AdminLayout>
  );
}




