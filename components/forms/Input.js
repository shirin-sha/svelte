'use client'

export default function Input({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '', 
  required = false,
  multiline = false,
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
    ...style
  }

  // If multiline is true or value contains newlines, render as textarea
  const isMultiline = multiline || (value && typeof value === 'string' && value.includes('\n'))

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
      {isMultiline ? (
        <textarea
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          style={{ ...defaultStyle, resize: 'vertical', lineHeight: '1.4' }}
          {...props}
        />
      ) : (
        <input
          type={type}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={defaultStyle}
          {...props}
        />
      )}
    </div>
  )
}

