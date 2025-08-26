'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchEnquiries();
  }, [router]);

  const fetchEnquiries = async () => {
    try {
      const response = await fetch('/api/content/enquiries');
      if (response.ok) {
        const data = await response.json();
        setEnquiries(data);
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/content/enquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Error updating enquiry:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`/api/content/enquiries/${id}/read`, {
        method: 'PUT'
      });
      
      if (response.ok) {
        fetchEnquiries();
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return '#ef4444';
      case 'read': return '#f59e0b';
      case 'replied': return '#10b981';
      case 'closed': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#10b981';
      case 'low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <AdminLayout title="Enquiries"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Enquiries">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Enquiries</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Total: {enquiries.length}
          </span>
          <span style={{ fontSize: '14px', color: '#ef4444' }}>
            New: {enquiries.filter(e => e.status === 'new').length}
          </span>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Email</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Subject</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Source</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Priority</th>
              <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ padding: 24, textAlign: 'center', color: '#6b7280' }}>
                  No enquiries found.
                </td>
              </tr>
            ) : (
              enquiries.map(enquiry => (
                <tr 
                  key={enquiry._id} 
                  style={{ 
                    background: !enquiry.isRead ? '#fef3c7' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setSelectedEnquiry(enquiry);
                    setShowDetails(true);
                    if (!enquiry.isRead) {
                      markAsRead(enquiry._id);
                    }
                  }}
                >
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      background: getStatusColor(enquiry.status),
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {enquiry.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontWeight: '500' }}>
                    {enquiry.name}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    {enquiry.email}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {enquiry.subject}
                    </div>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                      {enquiry.source.replace('-', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      background: getPriorityColor(enquiry.priority),
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: 8,
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {enquiry.priority}
                    </span>
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', fontSize: '12px', color: '#6b7280' }}>
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                      <select
                        value={enquiry.status}
                        onChange={(e) => updateEnquiryStatus(enquiry._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '4px 8px',
                          borderRadius: 4,
                          border: '1px solid #d1d5db',
                          fontSize: '12px'
                        }}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Enquiry Details Modal */}
      {showDetails && selectedEnquiry && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: 8,
            padding: 24,
            maxWidth: 600,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Enquiry Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Name</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{selectedEnquiry.name}</div>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Email</label>
                <div style={{ fontSize: '16px' }}>{selectedEnquiry.email}</div>
              </div>

              {selectedEnquiry.phone && (
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Phone</label>
                  <div style={{ fontSize: '16px' }}>{selectedEnquiry.phone}</div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Subject</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>{selectedEnquiry.subject}</div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Message</label>
                <div style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.6',
                  background: '#f8f9fa',
                  padding: 12,
                  borderRadius: 6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedEnquiry.message}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Source</label>
                  <div style={{ fontSize: '14px' }}>{selectedEnquiry.source}</div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Priority</label>
                  <div style={{ fontSize: '14px' }}>{selectedEnquiry.priority}</div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Date</label>
                <div style={{ fontSize: '14px' }}>{formatDate(selectedEnquiry.createdAt)}</div>
              </div>

              {selectedEnquiry.notes && (
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontSize: '12px', color: '#6b7280' }}>Notes</label>
                  <div style={{ fontSize: '14px' }}>{selectedEnquiry.notes}</div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Handle reply functionality
                  alert('Reply functionality to be implemented');
                }}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 6,
                  cursor: 'pointer'
                }}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 