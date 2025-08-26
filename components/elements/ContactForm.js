'use client';
import { useState } from 'react';

export default function ContactForm({ contactData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to submit form' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="contact-page__form contact-form-validated">
      {submitStatus && (
        <div style={{
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '16px',
          background: submitStatus.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: submitStatus.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${submitStatus.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {submitStatus.message}
        </div>
      )}

      <div className="row">
        {contactData?.showNameField && (
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="contact-page__input-box">
              <input 
                type="text" 
                placeholder={contactData?.nameLabel || "Your Name*"} 
                name="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required={contactData?.showNameField}
              />
            </div>
          </div>
        )}
        
        {contactData?.showEmailField && (
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="contact-page__input-box">
              <input 
                type="email" 
                placeholder={contactData?.emailLabel || "Your Email*"} 
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required={contactData?.showEmailField}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="row">
        {contactData?.showPhoneField && (
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="contact-page__input-box">
              <input 
                type="text" 
                placeholder={contactData?.phoneLabel || "Phone*"} 
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required={contactData?.showPhoneField}
              />
            </div>
          </div>
        )}
        
        {contactData?.showSubjectField && (
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
            <div className="contact-page__input-box">
              <input 
                type="text" 
                placeholder={contactData?.subjectLabel || "Subject*"} 
                name="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required={contactData?.showSubjectField}
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          {contactData?.showMessageField && (
            <div className="contact-page__input-box">
              <textarea 
                name="message" 
                placeholder={contactData?.messageLabel || "Write Message*"}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required={contactData?.showMessageField}
              ></textarea>
            </div>
          )}
          
          <div className="contact-page__btn">
            <button 
              className="thm-btn" 
              type="submit"
              disabled={submitting}
              data-loading-text="Please wait..."
            >
              <span className="txt">
                {submitting ? 'Sending...' : (contactData?.submitButtonText || 'SEND MESSAGE')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
} 