'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: '',
    mainImage: '',
    images: [],
    client: '',
    location: '',
    completionDate: '',
    technologies: [],
    status: 'completed',
    order: 0,
    isActive: true
  });
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchProjects();
  }, [router]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/content/project');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingProject 
        ? `/api/content/project/${editingProject._id}`
        : '/api/content/project';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      const projectData = {
        ...formData,
        completionDate: formData.completionDate ? new Date(formData.completionDate) : null,
        technologies: formData.technologies.filter(tech => tech.trim())
      };
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      
      if (response.ok) {
        setFormData({
          title: '',
          shortDescription: '',
          longDescription: '',
          category: '',
          mainImage: '',
          images: [],
          client: '',
          location: '',
          completionDate: '',
          technologies: [],
          status: 'completed',
          order: 0,
          isActive: true
        });
        setShowForm(false);
        setEditingProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      shortDescription: project.shortDescription,
      longDescription: project.longDescription,
      category: project.category,
      mainImage: project.mainImage,
      images: project.images || [],
      client: project.client || '',
      location: project.location || '',
      completionDate: project.completionDate ? new Date(project.completionDate).toISOString().split('T')[0] : '',
      technologies: project.technologies || [],
      status: project.status,
      order: project.order || 0,
      isActive: project.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/content/project/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleImageUpload = async (e, type = 'main') => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', 'projects');

    try {
      const response = await fetch('/api/upload', { method: 'POST', body: formData });
      if (response.ok) {
        const data = await response.json();
        if (type === 'main') {
          setFormData(prev => ({ ...prev, mainImage: data.url }));
        } else {
          setFormData(prev => ({ 
            ...prev, 
            images: [...prev.images, { url: data.url, alt: '', size: { width: 0, height: 0 } }]
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };

  const updateTechnology = (index, value) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <AdminLayout title="Projects"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Projects">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Projects</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : 'Add New Project'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Title:</label>
              <input 
                type="text" 
                value={formData.title} 
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Category:</label>
              <input 
                type="text" 
                value={formData.category} 
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Short Description:</label>
              <textarea 
                value={formData.shortDescription} 
                onChange={e => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                required
                rows={3}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Long Description:</label>
              <textarea 
                value={formData.longDescription} 
                onChange={e => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                required
                rows={6}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Client:</label>
                <input 
                  type="text" 
                  value={formData.client} 
                  onChange={e => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Location:</label>
                <input 
                  type="text" 
                  value={formData.location} 
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Completion Date:</label>
                <input 
                  type="date" 
                  value={formData.completionDate} 
                  onChange={e => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Status:</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                >
                  <option value="completed">Completed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="planned">Planned</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Main Image:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef'
              }}>
                <strong>📏 Recommended Size:</strong> 800×600 pixels (Project main image)
                <br />
                <small style={{ color: '#6c757d' }}>
                  • Format: JPG, PNG, WebP
                  • Max file size: 1MB
                  • Aspect ratio: 4:3 (standard project image)
                  • High quality for portfolio display
                </small>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleImageUpload(e, 'main')}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            {formData.mainImage && (
              <div style={{ marginBottom: 16 }}>
                <img src={formData.mainImage} alt="Main Preview" style={{ maxWidth: 200, height: 'auto' }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Additional Images:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef'
              }}>
                <strong>📏 Recommended Size:</strong> 1200×800 pixels (Project gallery images)
                <br />
                <small style={{ color: '#6c757d' }}>
                  • Format: JPG, PNG, WebP
                  • Max file size: 1.5MB per image
                  • Aspect ratio: 3:2 (landscape gallery)
                  • Multiple images for project showcase
                </small>
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleImageUpload(e, 'additional')}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            {formData.images.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4 }}>Project Images:</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {formData.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img src={image.url} alt="Preview" style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                      <button 
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{ 
                          position: 'absolute', 
                          top: -5, 
                          right: -5, 
                          background: '#ef4444', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '50%', 
                          width: 20, 
                          height: 20, 
                          cursor: 'pointer',
                          fontSize: 12
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Technologies:</label>
              {formData.technologies.map((tech, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input 
                    type="text" 
                    value={tech} 
                    onChange={e => updateTechnology(index, e.target.value)}
                    placeholder="Technology name"
                    style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
                  />
                  <button 
                    type="button"
                    onClick={() => removeTechnology(index)}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button 
                type="button"
                onClick={addTechnology}
                style={{ background: '#10b981', color: 'white', border: 'none', padding: '8px 12px', borderRadius: 4, cursor: 'pointer' }}
              >
                Add Technology
              </button>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 4 }}>Order:</label>
              <input 
                type="number" 
                value={formData.order} 
                onChange={e => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer' }}>
              {editingProject ? 'Update Project' : 'Create Project'}
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
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Client</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No projects found. Create your first project above.
                </td>
              </tr>
            ) : (
              projects.map(project => (
                <tr key={project._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <img 
                      src={project.mainImage} 
                      alt={project.title} 
                      style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 4 }} 
                    />
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{project.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{project.category}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12,
                      background: project.status === 'completed' ? '#10b981' : 
                                 project.status === 'ongoing' ? '#f59e0b' : '#6b7280',
                      color: 'white'
                    }}>
                      {project.status}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>{project.client || '-'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <button 
                      onClick={() => handleEdit(project)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4, marginRight: 8, cursor: 'pointer' }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project._id)}
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