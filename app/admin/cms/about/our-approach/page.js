'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Input, Textarea } from '@/components/forms'

export default function OurApproachAdmin() {
  const [loading, setLoading] = useState(true)
  const [header, setHeader] = useState({ subtitle: '', title: '' })
  const [description, setDescription] = useState('')
  const [image1, setImage1] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [buttonUrl, setButtonUrl] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/content/pages/about/sections/our-approach', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setHeader({ subtitle: data?.subtitle?.en || '', title: data?.title?.en || '' })
        let parsed = null
        try { parsed = data?.content?.en ? JSON.parse(data.content.en) : null } catch (_) { parsed = null }
        setDescription(parsed?.description || '')
        setImage1(parsed?.image1 || '')
        setButtonText(parsed?.buttonText || '')
        setButtonUrl(parsed?.buttonUrl || '')
        setPreviewUrl(parsed?.image1 || '')
      }
    } finally { setLoading(false) }
  }

  const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Upload failed')
    const data = await res.json()
    return data.url
  }

  const save = async () => {
    let imgUrl = image1
    try {
      if (selectedFile) {
        imgUrl = await uploadImage(selectedFile)
        setImage1(imgUrl)
      }
    } catch (e) {
      alert('Image upload failed')
      return
    }
    const payload = {
      title: { en: header.title || '' },
      subtitle: { en: header.subtitle || '' },
      content: { en: JSON.stringify({ description: description || '', image1: imgUrl || '', buttonText: buttonText || '', buttonUrl: buttonUrl || '' }) },
    }
    const res = await fetch('/api/content/pages/about/sections/our-approach', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (res.ok) alert('Saved')
    else alert('Failed to save')
  }

  if (loading) return (<AdminLayout><div style={{ padding: 24 }}>Loading...</div></AdminLayout>)

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Our Approach</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Subtitle" value={header.subtitle} onChange={e => setHeader(p => ({ ...p, subtitle: e.target.value }))} />
          <Input label="Title" value={header.title} onChange={e => setHeader(p => ({ ...p, title: e.target.value }))} />
        </div>
        <Textarea label="Description" value={description} onChange={e => setDescription(e.target.value)} rows={4} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Input label="Button Text" value={buttonText} onChange={e => setButtonText(e.target.value)} />
          <Input label="Button URL" value={buttonUrl} onChange={e => setButtonUrl(e.target.value)} placeholder="/projects" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Left Image</label>
          {previewUrl ? (
            <div style={{ marginBottom: 8 }}>
              <img src={previewUrl} alt="Preview" style={{ maxWidth: 220, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </div>
          ) : null}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (file) {
                setSelectedFile(file)
                const url = URL.createObjectURL(file)
                setPreviewUrl(url)
              }
            }}
          />
        </div>
        <div style={{ marginTop: 16 }}>
          <button onClick={save} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
        </div>
      </div>
    </AdminLayout>
  )
}


