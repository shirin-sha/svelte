'use client'
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    image: '',
    testimonial: '',
    rating: 5,
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/content/testimonials');
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/content/testimonials/${editingId}`
        : '/api/content/testimonials';
      
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        await fetchTestimonials();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial._id);
    setFormData(testimonial);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await fetch(`/api/content/testimonials/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        if (data.success) {
          await fetchTestimonials();
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      position: '',
      company: '',
      image: '',
      testimonial: '',
      rating: 5,
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
            {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
          </h1>
          <p className="text-gray-600">Manage client testimonials for the about page</p>
        </div>

        {/* Form */}
     {/* Form */}
<div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 24 }}>

  
  <form onSubmit={handleSubmit}>
    {/* Grid layout like About page */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
      {/* Name */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
          placeholder="Enter name"
        />
      </div>

      {/* Position */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Position *</label>
        <input
          type="text"
          value={formData.position}
          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          required
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
          placeholder="Enter position"
        />
      </div>

      {/* Company */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Company</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
          placeholder="Enter company"
        />
      </div>

      {/* Image URL */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Image URL *</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      {/* Rating */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Rating</label>
        <select
          value={formData.rating}
          onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
        >
          {[1, 2, 3, 4, 5].map(rating => (
            <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      {/* Order */}
      <div>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Order</label>
        <input
          type="number"
          value={formData.order}
          onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
          style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
          placeholder="0"
        />
      </div>
    </div>

    {/* Testimonial Text - full width */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Testimonial Text *</label>
      <textarea
        value={formData.testimonial}
        onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
        required
        rows={4}
        style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
        placeholder="Write the testimonial here..."
      />
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
        {editingId ? 'Update Testimonial' : 'Add Testimonial'}
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


        {/* Testimonials List */}
        <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: '#f9fafb' }}>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Image</th>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name & Company</th>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Position</th>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Rating</th>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
        <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
            Loading testimonials...
          </td>
        </tr>
      ) : testimonials.length === 0 ? (
        <tr>
          <td colSpan="6" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
            No testimonials found.
          </td>
        </tr>
      ) : (
        testimonials.map((testimonial) => (
          <tr key={testimonial._id}>
            {/* Image */}
            <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
              {testimonial.imageUrl ? (
                <img
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#e5e7eb' }} />
              )}
            </td>

            {/* Name & Company */}
            <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ fontWeight: 500, color: '#111827' }}>{testimonial.name}</div>
              {testimonial.company && (
                <div style={{ fontSize: 14, color: '#6b7280' }}>{testimonial.company}</div>
              )}
            </td>

            {/* Position */}
            <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', color: '#374151' }}>
              {testimonial.position}
            </td>

            {/* Rating */}
            <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} style={{ color: '#f59e0b', fontSize: 16 }}>★</span>
                ))}
              </div>
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
                  background: testimonial.isActive ? '#d1fae5' : '#fee2e2',
                  color: testimonial.isActive ? '#065f46' : '#991b1b'
                }}
              >
                {testimonial.isActive ? 'Active' : 'Inactive'}
              </span>
            </td>

            {/* Actions */}
            <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
              <button
                onClick={() => handleEdit(testimonial)}
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
                onClick={() => handleDelete(testimonial._id)}
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