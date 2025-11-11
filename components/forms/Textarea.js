'use client'

export default function Textarea({ 
  label, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  rows = 3,
  style = {},
  ...props 
}) {
  const defaultStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    lineHeight: '1.4',
    ...style
  }

  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ 
          display: 'block', 
          marginBottom: 8, 
          fontWeight: '600', 
          color: '#374151' 
        }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <textarea
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        style={defaultStyle}
        {...props}
      />
    </div>
  )
}



