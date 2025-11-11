'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Input, Textarea } from '@/components/forms'

export default function GetInTouchAdmin() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    subtitle: '',
    addressLabel: '',
    address: '',
    addressIcon: '',
    phoneLabel: '',
    phone: '',
    phoneIcon: '',
    emailLabel: '',
    email: '',
    emailIcon: '',
    mapEmbedUrl: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/pages/contact/sections/getintouch', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const subtitle = data?.subtitle?.en || ''
        const title = data?.title?.en || ''
        let parsed = null
        try { parsed = data?.content?.en ? JSON.parse(data.content.en) : null } catch (_) { parsed = null }
        setForm({
          title,
          description: parsed?.description || '',
          subtitle,
          addressLabel: parsed?.addressLabel || '',
          address: parsed?.address || '',
          addressIcon: parsed?.addressIcon || '',
          phoneLabel: parsed?.phoneLabel || '',
          phone: parsed?.phone || '',
          phoneIcon: parsed?.phoneIcon || '',
          emailLabel: parsed?.emailLabel || '',
          email: parsed?.email || '',
          emailIcon: parsed?.emailIcon || '',
          mapEmbedUrl: parsed?.mapEmbedUrl || ''
        })
      }
    } finally { setLoading(false) }
  }

  const save = async () => {
    try {
      const payload = {
        title: { en: form.title || '' },
        subtitle: { en: form.subtitle || '' },
        content: { en: JSON.stringify({
          description: form.description || '',
          addressLabel: form.addressLabel || '',
          address: form.address || '',
          addressIcon: form.addressIcon || '',
          phoneLabel: form.phoneLabel || '',
          phone: form.phone || '',
          phoneIcon: form.phoneIcon || '',
          emailLabel: form.emailLabel || '',
          email: form.email || '',
          emailIcon: form.emailIcon || '',
          mapEmbedUrl: form.mapEmbedUrl || ''
        })}
      }
      const res = await fetch('/api/content/pages/contact/sections/getintouch', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
      })
      if (res.ok) alert('Saved')
      else alert('Failed to save')
    } catch (e) {
      alert('Error saving')
    }
  }

  if (loading) return <AdminLayout><div style={{ padding: 24 }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <style jsx>{`
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            align-items: end;
            margin-bottom: 16px;
          }
          .grid-3 {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
            margin-bottom: 12px;
          }
          @media (min-width: 640px) {
            .grid-2 { grid-template-columns: 1fr 1fr; }
          }
          @media (min-width: 900px) {
            .grid-2 { grid-template-columns: 2fr 2fr; }
            .grid-3 { grid-template-columns: 1fr 2fr 1fr; }
          }
        `}</style>
        <h2 style={{ marginBottom: 16 }}>Get In Touch Section</h2>
        <div className="grid-2">
          <Input label="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <Input label="Subtitle" value={form.subtitle} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Textarea label="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} />
        </div>
        <div className="grid-3">
          <Input label="Address Label" value={form.addressLabel} onChange={e => setForm(p => ({ ...p, addressLabel: e.target.value }))} />
          <Input label="Address" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} />
          <Input label="Address Icon" value={form.addressIcon} onChange={e => setForm(p => ({ ...p, addressIcon: e.target.value }))} placeholder="e.g., fas fa-map-marker-alt" />
        </div>
        <div className="grid-3">
          <Input label="Phone Label" value={form.phoneLabel} onChange={e => setForm(p => ({ ...p, phoneLabel: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          <Input label="Phone Icon" value={form.phoneIcon} onChange={e => setForm(p => ({ ...p, phoneIcon: e.target.value }))} placeholder="e.g., fas fa-phone" />
        </div>
        <div className="grid-3">
          <Input label="Email Label" value={form.emailLabel} onChange={e => setForm(p => ({ ...p, emailLabel: e.target.value }))} />
          <Input label="Email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          <Input label="Email Icon" value={form.emailIcon} onChange={e => setForm(p => ({ ...p, emailIcon: e.target.value }))} placeholder="e.g., fas fa-envelope" />
        </div>

        <Input 
          label="Map Embed URL" 
          value={form.mapEmbedUrl} 
          onChange={e => setForm(p => ({ ...p, mapEmbedUrl: e.target.value }))} 
          placeholder="https://www.google.com/maps/embed?pb=..."
        />
        <div style={{ marginTop: 16 }}>
          <button onClick={save} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </AdminLayout>
  )
}


