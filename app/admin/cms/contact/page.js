'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ContactCMS() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [updating, setUpdating] = useState({});
  const [pageData, setPageData] = useState(null);

  const CONTACT_SLUG = 'contact';

  const contactSectionBlueprint = [
    { name: 'contact-info', title: 'Get in Touch', description: 'Address, phone, email, map' },
    { name: 'contact-form', title: "Let's Get in Touch", description: 'Form and submission settings' },
   
  ];

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchContactPage();
  }, [router]);

  const fetchContactPage = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/pages/${CONTACT_SLUG}`);
      if (response.ok) {
        const page = await response.json();
        setPageData(page);
        const pageSections = Array.isArray(page.sections) ? page.sections : [];
        const merged = contactSectionBlueprint.map(blue => {
          const existing = pageSections.find(s => s.name === blue.name);
          return { ...blue, isActive: existing ? !!existing.isActive : true };
        });
        setSections(merged);
      } else if (response.status === 404) {
        setPageData(null);
        setSections(contactSectionBlueprint.map(s => ({ ...s, isActive: true })));
        await createContactPage();
      }
    } catch (error) {
      console.error('Error fetching contact page:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContactPage = async () => {
    try {
      const res = await fetch('/api/content/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Contact',
          slug: CONTACT_SLUG,
          metaTitle: { en: 'Contact', ar: '' },
          metaDescription: { en: 'Contact page', ar: '' },
          sections: contactSectionBlueprint.map((s, idx) => ({
            name: s.name,
            title: { en: s.title, ar: '' },
            content: { en: '', ar: '' },
            image: '',
            isActive: true,
            order: idx + 1,
            type: 'text'
          }))
        })
      });
      if (res.ok) {
        const page = await res.json();
        setPageData(page);
      }
    } catch (e) {
      console.error('Failed to create contact page:', e);
    }
  };

  const ensureSectionExists = async (sectionName, desiredActive) => {
    try {
      const exists = pageData?.sections?.some(s => s.name === sectionName);
      if (exists) return true;
      const newSection = {
        name: sectionName,
        title: { en: contactSectionBlueprint.find(s => s.name === sectionName)?.title || sectionName, ar: '' },
        content: { en: '', ar: '' },
        image: '',
        isActive: !!desiredActive,
        order: (pageData?.sections?.length || 0) + 1,
        type: 'text'
      };
      const body = { sections: [...(pageData?.sections || []), newSection] };
      const res = await fetch(`/api/content/pages/${CONTACT_SLUG}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
      });
      if (res.ok) {
        const updatedPage = await res.json();
        setPageData(updatedPage);
        return true;
      }
      console.error('Failed to add section to page');
      return false;
    } catch (error) {
      console.error('Error ensuring section exists:', error);
      return false;
    }
  };

  const handleEdit = (sectionName) => {
    const target = sectionName === 'contact-info' || sectionName === 'getintouch' ? 'getintouch' : sectionName;
    router.push(`/admin/cms/contact/${target}`);
  };

  const toggleSection = async (sectionName) => {
    const currentSection = sections.find(s => s.name === sectionName);
    if (!currentSection) return;
    setUpdating(prev => ({ ...prev, [sectionName]: true }));
    try {
      const ok = await ensureSectionExists(sectionName, !currentSection.isActive);
      if (!ok) {
        alert('Failed to prepare section for toggling');
        return;
      }
      const response = await fetch(`/api/content/pages/${CONTACT_SLUG}/sections/${sectionName}/toggle`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !currentSection.isActive })
      });
      if (response.ok) {
        setSections(prev => prev.map(s => s.name === sectionName ? { ...s, isActive: !s.isActive } : s));
      } else {
        alert('Failed to update section visibility');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Error updating section visibility');
    } finally {
      setUpdating(prev => ({ ...prev, [sectionName]: false }));
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Contact CMS">
        <div style={{ padding: 24 }}>Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Contact Page CMS">
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e5e7eb' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1f2937' }}>Contact Page Sections</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Section</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Visibility</th>
              <th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.name}>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{section.name}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{section.title}</td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <button
                    onClick={() => toggleSection(section.name)}
                    disabled={updating[section.name]}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 16,
                      border: 'none',
                      color: section.isActive ? '#065f46' : '#991b1b',
                      background: section.isActive ? '#d1fae5' : '#fee2e2',
                      cursor: 'pointer'
                    }}
                  >
                    {section.isActive ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(section.name)}
                    style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: 6, cursor: 'pointer' }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
