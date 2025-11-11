'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Input, Textarea } from '@/components/forms'

export default function OurPromiseAdmin() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([
    { icon: 'fas fa-clipboard-list', title: '', description: '' },
    { icon: 'fas fa-screwdriver-wrench', title: '', description: '' },
    { icon: 'fas fa-calendar-check', title: '', description: '' },
    { icon: 'fas fa-leaf', title: '', description: '' },
  ])

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/pages/about/sections/our-promise', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        let parsed = null
        try { parsed = data?.content?.en ? JSON.parse(data.content.en) : null } catch (_) { parsed = null }
        if (parsed?.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
          setItems(parsed.items.map(i => ({ icon: i.icon || '', title: i.title || '', description: i.description || '' })))
        }
      }
    } finally { setLoading(false) }
  }

  const handleItemChange = (idx, field, value) => {
    const clone = [...items]
    clone[idx] = { ...clone[idx], [field]: value }
    setItems(clone)
  }

  const save = async () => {
    const payload = {
      content: { en: JSON.stringify({ items: items.map(i => ({ icon: i.icon || '', title: i.title || '', description: i.description || '' })) }) }
    }
    const res = await fetch('/api/content/pages/about/sections/our-promise', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (res.ok) alert('Saved')
    else alert('Failed to save')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: 24 }}>Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Our Promise</h2>
        <div style={{ marginTop: 16 }}>
          {items.map((it, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16, padding: 16, border: '1px solid #e5e7eb', borderRadius: 8, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Icon</label>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input type="text" value={it.icon} onChange={e => handleItemChange(idx, 'icon', e.target.value)} style={{ flex: 1, padding: 12, border: '1px solid #d1d5db', borderRadius: 8 }} placeholder="e.g., fas fa-clipboard-list" />
                  <span className={it.icon} style={{ fontSize: 20, width: 28, textAlign: 'center', color: '#6b7280' }} />
                </div>
              </div>
              <Input label="Title" value={it.title} onChange={e => handleItemChange(idx, 'title', e.target.value)} />
              <Textarea label="Description" value={it.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} rows={3} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={save} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </AdminLayout>
  )
}


