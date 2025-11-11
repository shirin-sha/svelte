'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Input, Textarea } from '@/components/forms'

export default function ContactFormAdmin() {
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: '',
    description: '',
    namePlaceholder: '',
    emailPlaceholder: '',
    phonePlaceholder: '',
    subjectPlaceholder: '',
    messagePlaceholder: '',
    buttonText: ''
  })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/pages/contact/sections/contact-form', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        const title = data?.title?.en || ''
        const description = data?.description?.en || ''
        let parsed = null
        try { parsed = data?.content?.en ? JSON.parse(data.content.en) : null } catch (_) { parsed = null }
        setForm({ 
          title, 
          description,
          namePlaceholder: parsed?.namePlaceholder || '',
          emailPlaceholder: parsed?.emailPlaceholder || '',
          phonePlaceholder: parsed?.phonePlaceholder || '',
          subjectPlaceholder: parsed?.subjectPlaceholder || '',
          messagePlaceholder: parsed?.messagePlaceholder || '',
          buttonText: parsed?.buttonText || ''
        })
      }
    } finally { setLoading(false) }
  }

  const save = async () => {
    try {
      const payload = {
        title: { en: form.title || '' },
        description: { en: form.description || '' },
        content: { en: JSON.stringify({
          namePlaceholder: form.namePlaceholder || '',
          emailPlaceholder: form.emailPlaceholder || '',
          phonePlaceholder: form.phonePlaceholder || '',
          subjectPlaceholder: form.subjectPlaceholder || '',
          messagePlaceholder: form.messagePlaceholder || '',
          buttonText: form.buttonText || ''
        })}
      }
      const res = await fetch('/api/content/pages/contact/sections/contact-form', {
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
          .grid-2 { display: grid; grid-template-columns: 1fr; gap: 12px; }
          @media (min-width: 640px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
        `}</style>
        <h2 style={{ marginBottom: 16 }}>Contact Form Section</h2>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Input label="Title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <Textarea label="Description" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Input label="Name Placeholder" value={form.namePlaceholder} onChange={e => setForm(p => ({ ...p, namePlaceholder: e.target.value }))} />
          <Input label="Email Placeholder" value={form.emailPlaceholder} onChange={e => setForm(p => ({ ...p, emailPlaceholder: e.target.value }))} />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Input label="Phone Placeholder" value={form.phonePlaceholder} onChange={e => setForm(p => ({ ...p, phonePlaceholder: e.target.value }))} />
          <Input label="Subject Placeholder" value={form.subjectPlaceholder} onChange={e => setForm(p => ({ ...p, subjectPlaceholder: e.target.value }))} />
        </div>
        <div className="grid-2" style={{ marginBottom: 16 }}>
          <Input label="Message Placeholder" value={form.messagePlaceholder} onChange={e => setForm(p => ({ ...p, messagePlaceholder: e.target.value }))} />
          <Input label="Button Text" value={form.buttonText} onChange={e => setForm(p => ({ ...p, buttonText: e.target.value }))} />
        </div>
        <div>
          <button onClick={save} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </AdminLayout>
  )
}


