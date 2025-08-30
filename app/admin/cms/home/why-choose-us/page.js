'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

export default function WhyChooseUsPage() {
  const [whyChooseUsData, setWhyChooseUsData] = useState({
    features: [
      {
        icon: 'icon-office-building',
        title: 'Architecture Design',
        description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
      },
      {
        icon: 'icon-bed',
        title: 'The Joy of Best Living',
        description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
      },
      {
        icon: 'icon-targeted',
        title: 'Professional Planning',
        description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
      }
    ],
    leftImage1: '',
    leftImage2: '',
    shapeImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});
  const router = useRouter();

  const iconOptions = [
    'icon-office-building',
    'icon-bed',
    'icon-targeted',
    'icon-construction',
    'icon-architecture',
    'icon-design',
    'icon-planning',
    'icon-quality',
    'icon-innovation',
    'icon-expertise'
  ];

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchWhyChooseUsData();
  }, [router]);

  const fetchWhyChooseUsData = async () => {
    try {
      const response = await fetch('/api/content/home-sections?section=why-choose-us');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const section = data[0];
          setWhyChooseUsData({
            features: section.features || [
              {
                icon: 'icon-office-building',
                title: 'Architecture Design',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
              },
              {
                icon: 'icon-bed',
                title: 'The Joy of Best Living',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
              },
              {
                icon: 'icon-targeted',
                title: 'Professional Planning',
                description: 'Through a unique coN construction and design discipl nes expertise Concor and delivers'
              }
            ],
            leftImage1: section.leftImage1 || '',
            leftImage2: section.leftImage2 || '',
            shapeImage: section.shapeImage || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching why choose us data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [field]: file }));
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({ ...prev, [field]: previewUrl }));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', { 
        method: 'POST', 
        body: formData 
      });
      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...whyChooseUsData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setWhyChooseUsData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setWhyChooseUsData(prev => ({
      ...prev,
      features: [...prev.features, {
        icon: 'icon-office-building',
        title: 'New Feature',
        description: 'Enter feature description here'
      }]
    }));
  };

  const removeFeature = (index) => {
    if (whyChooseUsData.features.length > 1) {
      const newFeatures = whyChooseUsData.features.filter((_, i) => i !== index);
      setWhyChooseUsData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let leftImage1 = whyChooseUsData.leftImage1;
      let leftImage2 = whyChooseUsData.leftImage2;
      let shapeImage = whyChooseUsData.shapeImage;

      // Upload new images if selected
      if (selectedFiles.leftImage1) {
        leftImage1 = await uploadImage(selectedFiles.leftImage1);
      }
      if (selectedFiles.leftImage2) {
        leftImage2 = await uploadImage(selectedFiles.leftImage2);
      }
      if (selectedFiles.shapeImage) {
        shapeImage = await uploadImage(selectedFiles.shapeImage);
      }

      const sectionData = {
        name: 'why-choose-us',
        features: whyChooseUsData.features,
        leftImage1,
        leftImage2,
        shapeImage,
        type: 'why-choose-us',
        isActive: true,
        order: 2
      };

      const response = await fetch('/api/content/home-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });
      
      if (response.ok) {
        setSelectedFiles({});
        setImagePreviews({});
        alert('Why Choose Us section updated successfully!');
        fetchWhyChooseUsData();
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to update why choose us section');
      }
    } catch (error) {
      console.error('Error updating why choose us section:', error);
      alert('Failed to update why choose us section. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <AdminLayout title="Why Choose Us Section"><div>Loading...</div></AdminLayout>;

  return (
    <AdminLayout title="Manage Why Choose Us Section">
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <h2 style={{ marginBottom: 24 }}>Why Choose Us Section Settings</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Features Section */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Features</h3>
              <button 
                type="button"
                onClick={addFeature}
                style={{ 
                  background: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: 6, 
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                + Add Feature
              </button>
            </div>

            {whyChooseUsData.features.map((feature, index) => (
              <div key={index} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: 20, 
                marginBottom: 16,
                background: '#f9fafb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h4 style={{ margin: 0 }}>Feature {index + 1}</h4>
                  {whyChooseUsData.features.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => removeFeature(index)}
                      style={{ 
                        background: '#ef4444', 
                        color: 'white', 
                        border: 'none', 
                        padding: '6px 12px', 
                        borderRadius: 4, 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Icon:</label>
                    <select 
                      value={feature.icon} 
                      onChange={e => handleFeatureChange(index, 'icon', e.target.value)}
                      style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Title:</label>
                    <input 
                      type="text" 
                      value={feature.title} 
                      onChange={e => handleFeatureChange(index, 'title', e.target.value)}
                      required
                      style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                      placeholder="Enter feature title"
                    />
                  </div>
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Description:</label>
                  <textarea 
                    value={feature.description} 
                    onChange={e => handleFeatureChange(index, 'description', e.target.value)}
                    required
                    rows={3}
                    style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6, resize: 'vertical' }}
                    placeholder="Enter feature description"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Images Section */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ marginBottom: 16 }}>Images</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Left Image 1:</label>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: 12, 
                  borderRadius: 4, 
                  marginBottom: 8,
                  border: '1px solid #e9ecef',
                  fontSize: '12px'
                }}>
                  📏 Recommended: 400×300 pixels
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleFileSelect('leftImage1', e)}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                />
                {(imagePreviews.leftImage1 || whyChooseUsData.leftImage1) && (
                  <img 
                    src={imagePreviews.leftImage1 || whyChooseUsData.leftImage1} 
                    alt="Left Image 1 Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      borderRadius: 6,
                      marginTop: 8,
                      border: '1px solid #ddd'
                    }} 
                  />
                )}
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Left Image 2:</label>
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: 12, 
                  borderRadius: 4, 
                  marginBottom: 8,
                  border: '1px solid #e9ecef',
                  fontSize: '12px'
                }}>
                  📏 Recommended: 400×300 pixels
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={e => handleFileSelect('leftImage2', e)}
                  style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
                />
                {(imagePreviews.leftImage2 || whyChooseUsData.leftImage2) && (
                  <img 
                    src={imagePreviews.leftImage2 || whyChooseUsData.leftImage2} 
                    alt="Left Image 2 Preview" 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      borderRadius: 6,
                      marginTop: 8,
                      border: '1px solid #ddd'
                    }} 
                  />
                )}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: '500' }}>Shape Image:</label>
              <div style={{ 
                background: '#f8f9fa', 
                padding: 12, 
                borderRadius: 4, 
                marginBottom: 8,
                border: '1px solid #e9ecef',
                fontSize: '12px'
              }}>
                📏 Recommended: 200×200 pixels (PNG with transparency)
              </div>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => handleFileSelect('shapeImage', e)}
                style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 6 }}
              />
              {(imagePreviews.shapeImage || whyChooseUsData.shapeImage) && (
                <img 
                  src={imagePreviews.shapeImage || whyChooseUsData.shapeImage} 
                  alt="Shape Image Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    height: 'auto', 
                    borderRadius: 6,
                    marginTop: 8,
                    border: '1px solid #ddd'
                  }} 
                />
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            style={{ 
              background: isSubmitting ? '#9ca3af' : '#2563eb', 
              color: 'white', 
              border: 'none', 
              padding: '14px 28px', 
              borderRadius: 6, 
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '500'
            }}
          >
            {isSubmitting ? 'Updating...' : 'Update Why Choose Us Section'}
          </button>
        </form>

        {/* Preview Section */}
        <div style={{ marginTop: 32, padding: 20, background: '#f8f9fa', borderRadius: 6 }}>
          <h3 style={{ marginBottom: 16 }}>💡 Preview</h3>
          <div style={{ 
            background: '#fff', 
            padding: 24, 
            borderRadius: 8,
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Left Side - Images */}
              <div>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  {(imagePreviews.shapeImage || whyChooseUsData.shapeImage) && (
                    <img 
                      src={imagePreviews.shapeImage || whyChooseUsData.shapeImage} 
                      alt="Shape" 
                      style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: 60, 
                        height: 60 
                      }} 
                    />
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {(imagePreviews.leftImage1 || whyChooseUsData.leftImage1) && (
                      <img 
                        src={imagePreviews.leftImage1 || whyChooseUsData.leftImage1} 
                        alt="Feature 1" 
                        style={{ 
                          width: '100%', 
                          height: 120, 
                          objectFit: 'cover',
                          borderRadius: 8
                        }} 
                      />
                    )}
                    {(imagePreviews.leftImage2 || whyChooseUsData.leftImage2) && (
                      <img 
                        src={imagePreviews.leftImage2 || whyChooseUsData.leftImage2} 
                        alt="Feature 2" 
                        style={{ 
                          width: '100%', 
                          height: 120, 
                          objectFit: 'cover',
                          borderRadius: 8
                        }} 
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side - Features */}
              <div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {whyChooseUsData.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: 24 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                        <div style={{ 
                          background: '#f59e0b', 
                          color: 'white', 
                          width: 50, 
                          height: 50, 
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0
                        }}>
                          <span className={feature.icon}></span>
                        </div>
                        <div>
                          <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: '600' }}>
                            {feature.title}
                          </h4>
                          <p style={{ margin: 0, color: '#6b7280', lineHeight: '1.5' }}>
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
