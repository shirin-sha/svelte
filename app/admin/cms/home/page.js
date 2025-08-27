'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function HomeCMS() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchSections();
  }, [router]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/content/home-sections');
      if (response.ok) {
        const apiSections = await response.json();
        
        // Map API sections with descriptions
        const sectionsWithDescriptions = [
          { name: 'banner', title: 'Banner', description: 'Main hero slider section' },
          { name: 'features', title: 'Features', description: 'Key features showcase' },
          { name: 'about', title: 'About', description: 'About us section' },
          { name: 'services', title: 'Services', description: 'Services we provide' },
          { name: 'projects', title: 'Projects', description: 'Portfolio and projects' },
          { name: 'contact', title: 'Contact', description: 'Contact information and form' },
          { name: 'brand', title: 'Brand', description: 'Brand logos and partners' },
          { name: 'why-choose-us', title: 'Why Choose Us', description: 'Why choose our company' },
          { name: 'action', title: 'Call to Action', description: 'Call to action section' },
          { name: 'blog', title: 'Blog', description: 'Latest blog posts' }
        ];

        // Merge with API data
        const mergedSections = sectionsWithDescriptions.map(section => {
          const apiSection = apiSections.find(api => api.name === section.name);
          return {
            ...section,
            isActive: apiSection ? apiSection.isActive : true
          };
        });

        setSections(mergedSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sectionName) => {
    // Route to specific admin pages for sections that have dedicated admin interfaces
    switch (sectionName) {
      case 'features':
        router.push('/admin/features');
        break;
      case 'about':
        router.push('/admin/about');
        break;
      default:
        router.push(`/admin/${sectionName}`);
    }
  };

  const handlePreview = (sectionName) => {
    router.push(`#`);
  };

  const toggleSection = async (sectionName) => {
    const currentSection = sections.find(s => s.name === sectionName);
    if (!currentSection) return;

    setUpdating(prev => ({ ...prev, [sectionName]: true }));

    try {
      const response = await fetch('/api/content/home-sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName,
          isActive: !currentSection.isActive
        })
      });

      if (response.ok) {
        // Update local state
        setSections(prevSections =>
          prevSections.map(section =>
            section.name === sectionName
              ? { ...section, isActive: !section.isActive }
              : section
          )
        );
      } else {
        console.error('Failed to update section');
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
      <AdminLayout title="Home CMS">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px',
          color: '#6b7280' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              border: '3px solid #e5e7eb',
              borderTop: '3px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p>Loading CMS...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Home Page CMS">
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .section-row:hover {
          background-color: #f8fafc !important;
        }
        .action-btn {
          transition: all 0.2s ease;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .edit-btn:hover {
          background-color: #2563eb !important;
        }
        .preview-btn:hover {
          background-color: #059669 !important;
        }
        .toggle-switch {
          position: relative;
          width: 80px;
          height: 40px;
          background: #e5e7eb;
          border-radius: 20px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
        }
        .toggle-switch.active {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
        }
        .toggle-switch.inactive {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          box-shadow: 0 4px 15px rgba(107, 114, 128, 0.3);
        }
        .toggle-switch:hover {
          transform: scale(1.05);
        }
        .toggle-switch:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none !important;
        }
        .toggle-slider {
          position: absolute;
          top: 4px;
          left: 4px;
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 50%;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .toggle-slider.active {
          transform: translateX(40px);
        }
        .toggle-text {
          position: absolute;
          font-size: 11px;
          font-weight: 600;
          color: white;
          transition: all 0.3s ease;
        }
        .toggle-text.on {
          left: 8px;
          opacity: 1;
        }
        .toggle-text.off {
          right: 8px;
          opacity: 1;
        }
        .toggle-text.hidden {
          opacity: 0;
        }
      `}</style>

      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        overflow: 'hidden', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ 
          padding: '24px 32px', 
          borderBottom: '1px solid #e5e7eb', 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
              Home Page Sections
            </h2>
            <div style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {sections.filter(s => s.isActive).length}/{sections.length} Active
            </div>
          </div>
        </div>
        
        <div style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ 
                  padding: '16px 32px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e5e7eb', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Section
                </th>
                <th style={{ 
                  padding: '16px 32px', 
                  textAlign: 'left', 
                  borderBottom: '1px solid #e5e7eb', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Title
                </th>
                <th style={{ 
                  padding: '16px 32px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e5e7eb', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Visibility
                </th>
                <th style={{ 
                  padding: '16px 32px', 
                  textAlign: 'center', 
                  borderBottom: '1px solid #e5e7eb', 
                  fontWeight: '600',
                  color: '#374151',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section, index) => (
                <tr 
                  key={section.name} 
                  className="section-row"
                  style={{ 
                    borderBottom: index < sections.length - 1 ? '1px solid #f3f4f6' : 'none',
                    transition: 'background-color 0.2s ease'
                  }}
                >
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div>
                        <div style={{ 
                          fontWeight: '600', 
                          color: '#111827',
                          fontSize: '16px',
                          marginBottom: '4px'
                        }}>
                          {section.title}
                        </div>
                        <div style={{ 
                          color: '#6b7280',
                          fontSize: '14px'
                        }}>
                          {section.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px' }}>
                    <div style={{ 
                      background: '#f3f4f6',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      display: 'inline-block',
                      fontSize: '14px',
                      color: '#374151',
                      fontWeight: '500'
                    }}>
                      {section.name.replace('-', ' ')}
                    </div>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                    <button
                      onClick={() => toggleSection(section.name)}
                      disabled={updating[section.name]}
                      className={`toggle-switch ${section.isActive ? 'active' : 'inactive'}`}
                      title={section.isActive ? 'Click to hide section' : 'Click to show section'}
                    >
                      <div className={`toggle-slider ${section.isActive ? 'active' : ''}`}>
                        {updating[section.name] ? (
                          <div style={{ 
                            width: 16, 
                            height: 16, 
                            border: '2px solid #e5e7eb',
                            borderTop: '2px solid #3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                        ) : (
                          <div style={{ 
                            fontSize: '14px',
                            color: section.isActive ? '#10b981' : '#6b7280'
                          }}>
                            {section.isActive ? '✓' : '✕'}
                          </div>
                        )}
                      </div>
                      <span className={`toggle-text ${section.isActive ? 'on' : 'off'}`}>
                        {section.isActive ? 'ON' : 'OFF'}
                      </span>
                    </button>
                  </td>
                  <td style={{ padding: '20px 32px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(section.name)}
                        className="action-btn edit-btn"
                        style={{ 
                          background: '#3b82f6', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '10px 16px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        title={`${section.title}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handlePreview(section.name)}
                        className="action-btn preview-btn"
                        style={{ 
                          background: '#10b981', 
                          color: '#fff', 
                          border: 'none', 
                          padding: '10px 16px', 
                          borderRadius: '8px', 
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                        title={`Preview ${section.title}`}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                        Preview
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
} 