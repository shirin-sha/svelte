'use client'

export default function Select({ 
  label, 
  value, 
  onChange, 
  options = [],
  placeholder = 'Select an option',
  required = false,
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
    backgroundColor: '#fff',
    cursor: 'pointer',
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
      <select
        value={value || ''}
        onChange={onChange}
        required={required}
        style={defaultStyle}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          if (typeof option === 'string') {
            return (
              <option key={option} value={option}>
                {option}
              </option>
            )
          }
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </div>
  )
}


