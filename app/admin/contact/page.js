'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ContactPage() {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContactData();
  }, [router]);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/content/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/content/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      
      if (response.ok) {
        alert('Contact settings saved successfully!');
        await fetchContactData();
      }
    } catch (error) {
      console.error('Error saving contact settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSubmissionStatus = async (submissionId, status) => {
    try {
      const response = await fetch(`/api/content/contact/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        await fetchContactData();
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <AdminLayout title="Contact Settings"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Contact Settings">
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <button 
            onClick={() => setActiveTab('settings')}
            style={{ 
              background: activeTab === 'settings' ? '#2563eb' : '#f3f4f6', 
              color: activeTab === 'settings' ? 'white' : '#374151',
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: 6, 
              cursor: 'pointer' 
            }}
          >
            Settings
          </button>
          <button 
            onClick={() => setActiveTab('submissions')}
            style={{ 
              background: activeTab === 'submissions' ? '#2563eb' : '#f3f4f6', 
              color: activeTab === 'submissions' ? 'white' : '#374151',
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: 6, 
              cursor: 'pointer' 
            }}
          >
            Form Submissions ({contactData?.submissions?.length || 0})
          </button>
        </div>

        {activeTab === 'settings' && (
          <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3>Contact Form Settings</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <h4 style={{ marginBottom: 16 }}>Contact Information</h4>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Address:</label>
                    <input 
                      type="text" 
                      value={contactData?.address || ''} 
                      onChange={e => handleInputChange('address', e.target.value)}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Primary Phone:</label>
                    <input 
                      type="text" 
                      value={contactData?.phone || ''} 
                      onChange={e => handleInputChange('phone', e.target.value)}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Secondary Phone:</label>
                    <input 
                      type="text" 
                      value={contactData?.secondaryPhone || ''} 
                      onChange={e => handleInputChange('secondaryPhone', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Primary Email:</label>
                    <input 
                      type="email" 
                      value={contactData?.email || ''} 
                      onChange={e => handleInputChange('email', e.target.value)}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Secondary Email:</label>
                    <input 
                      type="email" 
                      value={contactData?.secondaryEmail || ''} 
                      onChange={e => handleInputChange('secondaryEmail', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Google Maps URL:</label>
                    <input 
                      type="url" 
                      value={contactData?.mapUrl || ''} 
                      onChange={e => handleInputChange('mapUrl', e.target.value)}
                      required
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                    <small style={{ color: '#6c757d' }}>
                      Paste the embed URL from Google Maps
                    </small>
                  </div>
                </div>

                <div>
                  <h4 style={{ marginBottom: 16 }}>Page Content</h4>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Page Title:</label>
                    <input 
                      type="text" 
                      value={contactData?.pageTitle || ''} 
                      onChange={e => handleInputChange('pageTitle', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Page Description:</label>
                    <textarea 
                      value={contactData?.pageDescription || ''} 
                      onChange={e => handleInputChange('pageDescription', e.target.value)}
                      rows={3}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <h4 style={{ marginBottom: 16, marginTop: 24 }}>Form Settings</h4>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Form Title:</label>
                    <input 
                      type="text" 
                      value={contactData?.formTitle || ''} 
                      onChange={e => handleInputChange('formTitle', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Form Subtitle:</label>
                    <textarea 
                      value={contactData?.formSubtitle || ''} 
                      onChange={e => handleInputChange('formSubtitle', e.target.value)}
                      rows={2}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                  
                  <div style={{ marginBottom: 16 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Submit Button Text:</label>
                    <input 
                      type="text" 
                      value={contactData?.submitButtonText || ''} 
                      onChange={e => handleInputChange('submitButtonText', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <h4 style={{ marginBottom: 16 }}>Form Fields Configuration</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={contactData?.showNameField || false}
                        onChange={e => handleInputChange('showNameField', e.target.checked)}
                        style={{ marginRight: 8 }}
                      />
                      Show Name Field
                    </label>
                    <input 
                      type="text" 
                      value={contactData?.nameLabel || ''} 
                      onChange={e => handleInputChange('nameLabel', e.target.value)}
                      placeholder="Field Label"
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: '12px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={contactData?.showEmailField || false}
                        onChange={e => handleInputChange('showEmailField', e.target.checked)}
                        style={{ marginRight: 8 }}
                      />
                      Show Email Field
                    </label>
                    <input 
                      type="text" 
                      value={contactData?.emailLabel || ''} 
                      onChange={e => handleInputChange('emailLabel', e.target.value)}
                      placeholder="Field Label"
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: '12px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={contactData?.showPhoneField || false}
                        onChange={e => handleInputChange('showPhoneField', e.target.checked)}
                        style={{ marginRight: 8 }}
                      />
                      Show Phone Field
                    </label>
                    <input 
                      type="text" 
                      value={contactData?.phoneLabel || ''} 
                      onChange={e => handleInputChange('phoneLabel', e.target.value)}
                      placeholder="Field Label"
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: '12px' }}
                    />
                  </div>
                  
                  <div>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={contactData?.showSubjectField || false}
                        onChange={e => handleInputChange('showSubjectField', e.target.checked)}
                        style={{ marginRight: 8 }}
                      />
                      Show Subject Field
                    </label>
                    <input 
                      type="text" 
                      value={contactData?.subjectLabel || ''} 
                      onChange={e => handleInputChange('subjectLabel', e.target.value)}
                      placeholder="Field Label"
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: '12px' }}
                    />
                  </div>
                  
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <input 
                        type="checkbox" 
                        checked={contactData?.showMessageField || false}
                        onChange={e => handleInputChange('showMessageField', e.target.checked)}
                        style={{ marginRight: 8 }}
                      />
                      Show Message Field
                    </label>
                    <input 
                      type="text" 
                      value={contactData?.messageLabel || ''} 
                      onChange={e => handleInputChange('messageLabel', e.target.value)}
                      placeholder="Field Label"
                      style={{ width: '100%', padding: 6, border: '1px solid #ddd', borderRadius: 4, fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 6, 
                  cursor: saving ? 'not-allowed' : 'pointer',
                  marginTop: 24,
                  opacity: saving ? 0.6 : 1
                }}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: 24, borderBottom: '1px solid #e5e7eb' }}>
              <h3>Form Submissions</h3>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Manage contact form submissions from your website visitors.
              </p>
            </div>
            
            {contactData?.submissions?.length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#6b7280' }}>
                No submissions yet. Form submissions will appear here.
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {contactData?.submissions?.map((submission, index) => (
                  <div key={index} style={{ 
                    padding: 16, 
                    borderBottom: '1px solid #e5e7eb',
                    background: submission.status === 'new' ? '#fef3c7' : 'white'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ margin: '0 0 8px 0' }}>{submission.name}</h4>
                        <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
                          <strong>Email:</strong> {submission.email}
                        </p>
                        {submission.phone && (
                          <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
                            <strong>Phone:</strong> {submission.phone}
                          </p>
                        )}
                        {submission.subject && (
                          <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
                            <strong>Subject:</strong> {submission.subject}
                          </p>
                        )}
                        <p style={{ margin: '8px 0 0 0' }}>
                          <strong>Message:</strong> {submission.message}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ 
                          padding: '4px 8px', 
                          borderRadius: 4, 
                          fontSize: '12px',
                          background: submission.status === 'new' ? '#fef3c7' : 
                                   submission.status === 'read' ? '#dbeafe' : '#dcfce7',
                          color: submission.status === 'new' ? '#92400e' : 
                                submission.status === 'read' ? '#1e40af' : '#166534'
                        }}>
                          {submission.status.toUpperCase()}
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <select 
                            value={submission.status}
                            onChange={(e) => updateSubmissionStatus(index, e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ddd', fontSize: '12px' }}
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                          </select>
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: 4 }}>
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 