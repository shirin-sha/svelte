'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';
import dynamic from 'next/dynamic';
import { getImageUrl } from '@/lib/imageUtils';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [sectionData, setSectionData] = useState({
    subtitle: '',
    title: ''
  });
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    imageUrl: '',
    publishedAt: '',
    content: ''
  });
  const router = useRouter();
  const quillRef = useRef(null);

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }],
      [{ align: [] }],
      ['link', 'blockquote', 'clean']
    ],
    clipboard: {
      // Preserve styles when pasting
      matchVisual: false,
      // Allow all HTML tags and styles
      allowed: {
        tags: ['p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'span', 'div'],
        attributes: ['href', 'style', 'class', 'color', 'background-color']
      }
    }
  }), []);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchBlogs();
    fetchSectionData();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/content/blog');
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionData = async () => {
    try {
      const response = await fetch('/api/content/pages/home/sections/blog');
      if (response.ok) {
        const section = await response.json();
        let parsed = null;
        try {
          parsed = section?.content?.en ? JSON.parse(section.content.en) : null;
        } catch (_) {
          parsed = null;
        }
        if (parsed) {
          setSectionData(prev => ({
            ...prev,
            subtitle: parsed.subtitle || prev.subtitle,
            title: parsed.title || prev.title
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching section data:', error);
    }
  };

  const handleSectionSave = async () => {
    try {
      const response = await fetch('/api/content/pages/home/sections/blog', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: {
            en: JSON.stringify({ title: sectionData.title, subtitle: sectionData.subtitle })
          }
        })
      });
      
      if (response.ok) {
        alert('Section settings saved successfully!');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Failed to save section settings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving section data:', error);
      alert('Failed to save section settings: Network error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.imageUrl || !formData.publishedAt || !formData.content) {
      alert('Please fill Title, Category, Image, Date and Description');
      return;
    }
    try {
      const url = editingBlog 
        ? `/api/content/blog/${editingBlog._id}`
        : '/api/content/blog';
      
      const method = editingBlog ? 'PUT' : 'POST';
      
      const payload = {
        title: formData.title,
        category: formData.category,
        imageUrl: formData.imageUrl,
        publishedAt: formData.publishedAt,
        content: formData.content
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        setFormData({ 
          title: '', 
          category: '',
          imageUrl: '', 
          publishedAt: '',
          content: '' 
        });
        setShowForm(false);
        setEditingBlog(null);
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    const existingDate = blog.publishedAt || blog.createdAt;
    setFormData({
      title: blog.title,
      category: blog.category || '',
      imageUrl: blog.imageUrl,
      publishedAt: existingDate ? new Date(existingDate).toISOString().split('T')[0] : '',
      content: blog.content
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    
    try {
      const response = await fetch(`/api/content/blog/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchBlogs();
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);
    uploadData.append('type', 'blogs');

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadData });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  if (loading) return <AdminLayout title="Blogs"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Blogs">
      {/* Section Title Management */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 24 }}>News Section Settings</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Small Title (Subtitle)
            </label>
            <input
              type="text"
              value={sectionData.subtitle}
              onChange={(e) => setSectionData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="e.g., OUR BLOG POST"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: '600', color: '#374151' }}>
              Main Title
            </label>
            <input
              type="text"
              value={sectionData.title}
              onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Read Our Latest News"
              style={{ 
                width: '100%', 
                padding: '12px', 
                border: '1px solid #d1d5db', 
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <button 
            onClick={handleSectionSave}
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
              color: '#fff', 
              border: 'none', 
              padding: '12px 24px', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}
          >
            Save Section Settings
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Blog Posts</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Blog'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4 }}>Title:</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 4 }}>Category:</label>
                <input 
                  type="text" 
                  value={formData.category} 
                  onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
            </div>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Published Date:</label>
              <input 
                type="date" 
                value={formData.publishedAt} 
                onChange={e => setFormData(prev => ({ ...prev, publishedAt: e.target.value }))}
                required
                style={{ width: '50%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Image:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef'
              }}>
                <strong>📏 Recommended Size:</strong> 800×600 pixels (Blog post images)
                <br />
                <small style={{ color: '#6c757d' }}>
                  • Format: JPG, PNG, WebP
                  • Max file size: 1MB
                  • Aspect ratio: 4:3 (standard blog image)
                </small>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            {formData.imageUrl && (
              <div style={{ marginBottom: 16, display: 'inline-flex', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                <img 
                  src={getImageUrl(formData.imageUrl)} 
                  alt="Preview"
                  onError={(e) => {
                    const cleanUrl = formData.imageUrl.split('?')[0];
                    if (e.target.src !== getImageUrl(cleanUrl)) {
                      e.target.src = getImageUrl(cleanUrl);
                    } else {
                      e.target.style.display = 'none';
                    }
                  }}
                  style={{ width: 200, height: 130, objectFit: 'cover', borderRadius: 6 }} 
                />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Main Description:</label>
              <div style={{ border: '1px solid #ddd', borderRadius: 4 }}>
                <ReactQuill
                  ref={quillRef}
                  value={formData.content}
                  onChange={value => setFormData(prev => ({ ...prev, content: value }))}
                  modules={quillModules}
                  theme="snow"
                  style={{ height: 250, marginBottom: 40 }}
                  formats={[
                    'header', 'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet', 'color', 'align',
                    'link', 'blockquote'
                  ]}
                />
              </div>
            </div>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
              {editingBlog ? 'Update Blog Post' : 'Create Blog Post'}
            </button>
          </form>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Image</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Category</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No blog posts found. Create your first blog post above.
                </td>
              </tr>
            ) : (
              blogs.map(blog => (
                <tr key={blog._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <img 
                      src={getImageUrl(blog.imageUrl)} 
                      alt={blog.title}
                      onError={(e) => {
                        const cleanUrl = blog.imageUrl?.split('?')[0];
                        if (cleanUrl && e.target.src !== getImageUrl(cleanUrl)) {
                          e.target.src = getImageUrl(cleanUrl);
                        } else {
                          e.target.style.display = 'none';
                        }
                      }}
                      style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{blog.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{blog.category}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(blog)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
} 