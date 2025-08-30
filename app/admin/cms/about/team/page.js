'use client'
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    image: '',
    bio: '',
    experience: '',
    education: '',
    skills: '',
    socialLinks: {
      linkedin: '',
      instagram: '',
      facebook: '',
      twitter: '',
      website: ''
    },
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const response = await fetch('/api/content/team');
      const data = await response.json();
      if (data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };
      
      const url = editingId 
        ? `/api/content/team/${editingId}`
        : '/api/content/team';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTeam();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      ...member,
      skills: member.skills ? member.skills.join(', ') : ''
    });
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this team member?')) {
      try {
        const response = await fetch(`/api/content/team/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchTeam();
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      position: '',
      image: '',
      bio: '',
      experience: '',
      education: '',
      skills: '',
      socialLinks: {
        linkedin: '',
        instagram: '',
        facebook: '',
        twitter: '',
        website: ''
      },
      isActive: true,
      order: 0
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {editingId ? 'Edit Team Member' : 'Add New Team Member'}
          </h1>
          <p className="text-gray-600">Manage team members for the about page</p>
        </div>

        {/* Form */}
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="Enter full name"
                />
              </div>

              {/* Position */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Position *</label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="e.g., Developer, Designer"
                />
              </div>

              {/* Image URL */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              {/* Order */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Display Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Bio - full width */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
                placeholder="Brief description about the team member..."
              />
            </div>

            {/* Experience & Education Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* Experience */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Experience</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="e.g., 5+ years in web development"
                />
              </div>

              {/* Education */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Education</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="e.g., Bachelor's in Computer Science"
                />
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Skills (comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                placeholder="JavaScript, React, Node.js, MongoDB"
              />
            </div>

            {/* Social Links Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {/* LinkedIn */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>LinkedIn</label>
                <input
                  type="url"
                  value={formData.socialLinks.linkedin}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                  })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              {/* Instagram */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Instagram</label>
                <input
                  type="url"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                  })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://instagram.com/username"
                />
              </div>

              {/* Facebook */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Facebook</label>
                <input
                  type="url"
                  value={formData.socialLinks.facebook}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                  })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://facebook.com/username"
                />
              </div>

              {/* Twitter */}
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Twitter</label>
                <input
                  type="url"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                  })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://twitter.com/username"
                />
              </div>

              {/* Website */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Personal Website</label>
                <input
                  type="url"
                  value={formData.socialLinks.website}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    socialLinks: { ...formData.socialLinks, website: e.target.value }
                  })}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {/* Active Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                style={{ width: 18, height: 18, marginRight: 8 }}
              />
              <label htmlFor="isActive" style={{ fontSize: '14px' }}>Active</label>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '15px',
                  fontWeight: '500'
                }}
              >
                {editingId ? 'Update Team Member' : 'Add Team Member'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: '500'
                  }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Team List */}
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Image</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name & Position</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Skills</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                    Loading team members...
                  </td>
                </tr>
              ) : team.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                    No team members found.
                  </td>
                </tr>
              ) : (
                team.map((member) => (
                  <tr key={member._id}>
                    {/* Image */}
                    <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'assets/img/team/team-v2-img1.jpg';
                        }}
                      />
                    </td>

                    {/* Name & Position */}
                    <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                      <div style={{ fontWeight: 500, color: '#111827' }}>{member.name}</div>
                      <div style={{ fontSize: 14, color: '#6b7280' }}>{member.position}</div>
                    </td>

                    {/* Skills */}
                    <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
                      {member.skills && member.skills.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              style={{
                                background: '#f3f4f6',
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontSize: 12,
                                color: '#374151'
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span style={{ color: '#6b7280', fontSize: 12 }}>
                              +{member.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>No skills listed</span>
                      )}
                    </td>

                    {/* Status */}
                    <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 600,
                          background: member.isActive ? '#d1fae5' : '#fee2e2',
                          color: member.isActive ? '#065f46' : '#991b1b'
                        }}
                      >
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                      <button
                        onClick={() => handleEdit(member)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          marginRight: 8,
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: 4,
                          cursor: 'pointer'
                        }}
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
      </div>
    </AdminLayout>
  );
}