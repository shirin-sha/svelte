'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #d1d5db',
  borderRadius: '8px',
  fontSize: '14px'
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '96px',
  resize: 'vertical'
};

function Label({ children }) {
  return (
    <span style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
      {children}
    </span>
  );
}

function Field({ label, helper, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
      {helper ? (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>{helper}</p>
      ) : null}
    </div>
  );
}

export default function ContactPage() {
  const [contactData, setContactData] = useState({
    formTitle: 'WE READY TO HELP',
    formSubtitle: 'Have Any Question?',
    submitButtonText: 'SEND YOUR MESSAGE',
    backgroundImage: 'assets/img/background/contact-v1-bg.jpg',
    counter1: {
      number: 48,
      text: 'Designers and developers'
    },
    counter2: {
      number: 256,
      text: 'Awards for digital art work'
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      const response = await fetch('/api/content/pages/home/sections/contact');
      if (response.ok) {
        const section = await response.json();
        let parsed = null;
        try {
          parsed = section?.content?.en ? JSON.parse(section.content.en) : null;
        } catch (_) {
          parsed = null;
        }
        if (parsed) {
          setContactData(prev => ({
            ...prev,
            formTitle: parsed.formTitle || prev.formTitle,
            formSubtitle: parsed.formSubtitle || prev.formSubtitle,
            submitButtonText: parsed.submitButtonText || prev.submitButtonText,
            backgroundImage: parsed.backgroundImage || prev.backgroundImage,
            counter1: parsed.counter1 || prev.counter1,
            counter2: parsed.counter2 || prev.counter2
          }));
        }
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
      const payload = {
        content: {
          en: JSON.stringify(contactData)
        }
      };
      
      const response = await fetch('/api/content/pages/home/sections/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        alert('Contact section updated successfully!');
        await fetchContactData();
      } else {
        alert('Failed to save contact changes');
      }
    } catch (error) {
      console.error('Error saving contact settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e, imageField) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      
      if (response.ok) {
        const data = await response.json();
        handleInputChange(imageField, data.url);
      } else {
        alert('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    }
  };

  if (loading) return <AdminLayout title="Contact Settings"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Contact Section Management">
      <div
        style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '32px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827' }}>
              Contact Section Content
            </h2>
            <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>
              Manage the content displayed in the Contact section of your home page
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            style={{
              background: saving ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: saving ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div style={{ display: 'grid', gap: '24px' }}>
          <Field
            label="Form Title (Small Text)"
            helper="This appears as the small text above the main form heading"
            value={contactData.formTitle}
            onChange={(value) => handleInputChange('formTitle', value)}
          />

          <Field
            label="Form Subtitle (Main Heading)"
            helper="This appears as the main heading for the contact form"
            value={contactData.formSubtitle}
            onChange={(value) => handleInputChange('formSubtitle', value)}
          />

          <Field
            label="Submit Button Text"
            helper="Text displayed on the form submit button"
            value={contactData.submitButtonText}
            onChange={(value) => handleInputChange('submitButtonText', value)}
          />

          <div>
            <Label>Background Image</Label>
            <div
              style={{
                background: '#f8f9fa',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '8px',
                border: '1px solid #e9ecef'
              }}
            >
              <strong>📏 Recommended Size:</strong> 1920×1080 pixels (Full background)
              <br />
              <small style={{ color: '#6c757d' }}>
                • Format: JPG, PNG, WebP
                • Max file size: 2MB
                • High quality for background display
              </small>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'backgroundImage')}
              style={inputStyle}
            />
            {contactData.backgroundImage && (
              <div style={{ marginTop: '8px' }}>
                <img
                  src={contactData.backgroundImage}
                  alt="Background preview"
                  style={{
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '4px',
                    border: '1px solid #e5e7eb'
                  }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <Label>Counter 1</Label>
            <input
              type="number"
              value={contactData.counter1.number}
              onChange={(e) =>
                setContactData((prev) => ({
                  ...prev,
                  counter1: { ...prev.counter1, number: parseInt(e.target.value, 10) || 0 }
                }))
              }
              placeholder="e.g., 48"
              style={inputStyle}
            />
            <textarea
              value={contactData.counter1.text}
              onChange={(e) =>
                setContactData((prev) => ({
                  ...prev,
                  counter1: { ...prev.counter1, text: e.target.value }
                }))
              }
              placeholder="e.g., Designers and developers"
              rows={2}
              style={textareaStyle}
            />
            <small style={{ color: '#6b7280' }}>Description text that appears below the counter number</small>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <Label>Counter 2</Label>
            <input
              type="number"
              value={contactData.counter2.number}
              onChange={(e) =>
                setContactData((prev) => ({
                  ...prev,
                  counter2: { ...prev.counter2, number: parseInt(e.target.value, 10) || 0 }
                }))
              }
              placeholder="e.g., 256"
              style={inputStyle}
            />
            <textarea
              value={contactData.counter2.text}
              onChange={(e) =>
                setContactData((prev) => ({
                  ...prev,
                  counter2: { ...prev.counter2, text: e.target.value }
                }))
              }
              placeholder="e.g., Awards for digital art work"
              rows={2}
              style={textareaStyle}
            />
            <small style={{ color: '#6b7280' }}>Description text that appears below the counter number</small>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 