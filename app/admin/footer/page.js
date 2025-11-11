'use client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/layout/AdminLayout'
import { Input, Textarea } from '@/components/forms'

export default function FooterAdminPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Section 1: About (logo, about, social links)
  const [aboutSection, setAboutSection] = useState({
    logoUrl: '',
    aboutText: '',
    socialLinks: [{ label: 'Ln', url: '#' }, { label: 'In', url: '#' }, { label: 'Fb', url: '#' }, { label: 'Bh', url: '#' }]
  })

  // Section 2: Navigation
  const [navSection, setNavSection] = useState({
    title: 'Navigation',
    showAbout: true,
    showServices: true,
    showProjects: true,
    showClients: true,
    showBlog: true,
    showContact: true
  })

  // Section 3: Quick Links
  const [quickSection, setQuickSection] = useState({
    title: 'Quick Link',
    showQuote: true,
    showVisit: true,
    showProfile: true,
    showHse: true,
    showPrivacy: true,
    showTerms: true
  })

  // Section 4: Newsletter
  const [newsSection, setNewsSection] = useState({
    title: 'Newsletter',
    description: 'Subscribe for design tips, project updates and news from Svelte.',
    placeholderEmail: 'email@example.com'
  })

  // Section 5: Bottom text
  const [bottomSection, setBottomSection] = useState({
    line1: '© 2025 Svelte Contracting LLC. All rights reserved.',
    line2: 'Registered in Abu Dhabi, UAE. Trade license available on request.'
  })

  useEffect(() => { loadAll() }, [])

  const parseContent = (content) => {
    if (!content || !content.en) return null
    try { return JSON.parse(content.en) } catch { return null }
  }

  const loadAll = async () => {
    try {
      const urls = [
        '/api/content/pages/footer/sections/about',
        '/api/content/pages/footer/sections/navigation',
        '/api/content/pages/footer/sections/quick-links',
        '/api/content/pages/footer/sections/newsletter',
        '/api/content/pages/footer/sections/bottom'
      ]
      const [aboutRes, navRes, quickRes, newsRes, bottomRes] = await Promise.all(urls.map(u => fetch(u, { cache: 'no-store' })))
      if (aboutRes.ok) {
        const j = await aboutRes.json(); const p = parseContent(j?.content)
        setAboutSection(s => ({
          logoUrl: p?.logoUrl || s.logoUrl,
          aboutText: p?.aboutText || s.aboutText,
          socialLinks: Array.isArray(p?.socialLinks) ? p.socialLinks : s.socialLinks
        }))
      }
      if (navRes.ok) {
        const j = await navRes.json(); const p = parseContent(j?.content)
        setNavSection(s => ({
          title: j?.title?.en || s.title,
          showAbout: p?.showAbout ?? s.showAbout,
          showServices: p?.showServices ?? s.showServices,
          showProjects: p?.showProjects ?? s.showProjects,
          showClients: p?.showClients ?? s.showClients,
          showBlog: p?.showBlog ?? s.showBlog,
          showContact: p?.showContact ?? s.showContact
        }))
      }
      if (quickRes.ok) {
        const j = await quickRes.json(); const p = parseContent(j?.content)
        setQuickSection(s => ({
          title: j?.title?.en || s.title,
          showQuote: p?.showQuote ?? s.showQuote,
          showVisit: p?.showVisit ?? s.showVisit,
          showProfile: p?.showProfile ?? s.showProfile,
          showHse: p?.showHse ?? s.showHse,
          showPrivacy: p?.showPrivacy ?? s.showPrivacy,
          showTerms: p?.showTerms ?? s.showTerms
        }))
      }
      if (newsRes.ok) {
        const j = await newsRes.json(); const p = parseContent(j?.content)
        setNewsSection(s => ({
          title: j?.title?.en || s.title,
          description: j?.description?.en || s.description,
          placeholderEmail: p?.placeholderEmail || s.placeholderEmail
        }))
      }
      if (bottomRes.ok) {
        const j = await bottomRes.json(); const p = parseContent(j?.content)
        setBottomSection({ line1: p?.line1 || bottomSection.line1, line2: p?.line2 || bottomSection.line2 })
      }
    } finally { setLoading(false) }
  }

  const uploadLogo = async (file) => {
    const fd = new FormData(); fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    if (!res.ok) throw new Error('Upload failed')
    const j = await res.json(); return j?.url || ''
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      const reqs = []
      reqs.push(fetch('/api/content/pages/footer/sections/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        content: { en: JSON.stringify({ logoUrl: aboutSection.logoUrl, aboutText: aboutSection.aboutText, socialLinks: aboutSection.socialLinks }) }
      }) }))
      reqs.push(fetch('/api/content/pages/footer/sections/navigation', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        title: { en: navSection.title || '' },
        content: { en: JSON.stringify({ showAbout: !!navSection.showAbout, showServices: !!navSection.showServices, showProjects: !!navSection.showProjects, showClients: !!navSection.showClients, showBlog: !!navSection.showBlog, showContact: !!navSection.showContact }) }
      }) }))
      reqs.push(fetch('/api/content/pages/footer/sections/quick-links', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        title: { en: quickSection.title || '' },
        content: { en: JSON.stringify({ showQuote: !!quickSection.showQuote, showVisit: !!quickSection.showVisit, showProfile: !!quickSection.showProfile, showHse: !!quickSection.showHse, showPrivacy: !!quickSection.showPrivacy, showTerms: !!quickSection.showTerms }) }
      }) }))
      reqs.push(fetch('/api/content/pages/footer/sections/newsletter', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        title: { en: newsSection.title || '' },
        description: { en: newsSection.description || '' },
        content: { en: JSON.stringify({ placeholderEmail: newsSection.placeholderEmail || '' }) }
      }) }))
      reqs.push(fetch('/api/content/pages/footer/sections/bottom', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        content: { en: JSON.stringify({ line1: bottomSection.line1 || '', line2: bottomSection.line2 || '' }) }
      }) }))
      const results = await Promise.all(reqs)
      const ok = results.every(r => r.ok)
      alert(ok ? 'Saved' : 'Failed to save some sections')
    } catch (e) {
      alert('Error saving')
    } finally { setSaving(false) }
  }

  if (loading) return <AdminLayout><div style={{ padding: 24 }}>Loading...</div></AdminLayout>

  return (
    <AdminLayout>
      <div style={{ padding: 24 }}>
        <style jsx>{`
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
          .row { display: grid; grid-template-columns: 1fr; gap: 12px; }
          @media (min-width: 900px) { .row-2 { grid-template-columns: 1fr 1fr; } .row-3 { grid-template-columns: 1fr 1fr 1fr; } }
          .inline { display: flex; gap: 8px; align-items: center; }
          .switch { width: 16px; height: 16px; }
          .logo-preview { width: 160px; height: auto; border: 1px dashed #d1d5db; border-radius: 6px; }
        `}</style>

        <h2 style={{ marginBottom: 16 }}>Footer CMS</h2>

        {/* Section 1: About */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>About Section</h3>
          <div className="row row-2">
            <div>
              <Input label="Logo URL" value={aboutSection.logoUrl} onChange={e => setAboutSection(p => ({ ...p, logoUrl: e.target.value }))} placeholder="/uploads/logo.png" />
              <input type="file" accept="image/*" onChange={async (e) => { if (!e.target.files?.[0]) return; const url = await uploadLogo(e.target.files[0]); setAboutSection(p => ({ ...p, logoUrl: url })) }} />
              {aboutSection.logoUrl ? (<div style={{ marginTop: 8 }}><img className="logo-preview" src={aboutSection.logoUrl} alt="logo" /></div>) : null}
            </div>
            <div>
              <Textarea label="About" rows={4} value={aboutSection.aboutText} onChange={e => setAboutSection(p => ({ ...p, aboutText: e.target.value }))} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <h4>Social Links</h4>
            {aboutSection.socialLinks.map((item, idx) => (
              <div className="row row-2" key={idx}>
                <Input label="Label" value={item.label} onChange={e => setAboutSection(p => ({ ...p, socialLinks: p.socialLinks.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) }))} />
                <Input label="URL" value={item.url} onChange={e => setAboutSection(p => ({ ...p, socialLinks: p.socialLinks.map((s, i) => i === idx ? { ...s, url: e.target.value } : s) }))} />
              </div>
            ))}
            <button onClick={() => setAboutSection(p => ({ ...p, socialLinks: [...p.socialLinks, { label: '', url: '' }] }))} style={{ marginTop: 8 }}>Add Link</button>
          </div>
        </div>

        {/* Section 2: Navigation */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Navigation Section</h3>
          <div className="row row-2">
            <Input label="Title" value={navSection.title} onChange={e => setNavSection(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="row row-3">
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showAbout} onChange={e => setNavSection(p => ({ ...p, showAbout: e.target.checked }))} /> About Us</label>
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showServices} onChange={e => setNavSection(p => ({ ...p, showServices: e.target.checked }))} /> Services</label>
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showProjects} onChange={e => setNavSection(p => ({ ...p, showProjects: e.target.checked }))} /> Projects</label>
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showClients} onChange={e => setNavSection(p => ({ ...p, showClients: e.target.checked }))} /> Clients</label>
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showBlog} onChange={e => setNavSection(p => ({ ...p, showBlog: e.target.checked }))} /> Blog</label>
            <label className="inline"><input className="switch" type="checkbox" checked={navSection.showContact} onChange={e => setNavSection(p => ({ ...p, showContact: e.target.checked }))} /> Contact Us</label>
          </div>
        </div>

        {/* Section 3: Quick Links */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Quick Link Section</h3>
          <div className="row row-2">
            <Input label="Title" value={quickSection.title} onChange={e => setQuickSection(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="row row-3">
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showQuote} onChange={e => setQuickSection(p => ({ ...p, showQuote: e.target.checked }))} /> Get a Quote</label>
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showVisit} onChange={e => setQuickSection(p => ({ ...p, showVisit: e.target.checked }))} /> Book a Site Visit</label>
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showProfile} onChange={e => setQuickSection(p => ({ ...p, showProfile: e.target.checked }))} /> Company Profile</label>
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showHse} onChange={e => setQuickSection(p => ({ ...p, showHse: e.target.checked }))} /> HSE Policy</label>
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showPrivacy} onChange={e => setQuickSection(p => ({ ...p, showPrivacy: e.target.checked }))} /> Privacy Policy</label>
            <label className="inline"><input className="switch" type="checkbox" checked={quickSection.showTerms} onChange={e => setQuickSection(p => ({ ...p, showTerms: e.target.checked }))} /> Terms of Use</label>
          </div>
        </div>

        {/* Section 4: Newsletter */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Newsletter Section</h3>
          <div className="row row-2">
            <Input label="Title" value={newsSection.title} onChange={e => setNewsSection(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <Textarea label="Description" rows={3} value={newsSection.description} onChange={e => setNewsSection(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="row row-2">
            <Input label="Email Placeholder" value={newsSection.placeholderEmail} onChange={e => setNewsSection(p => ({ ...p, placeholderEmail: e.target.value }))} />
          </div>
        </div>

        {/* Section 5: Bottom */}
        <div className="card">
          <h3 style={{ marginBottom: 12 }}>Footer Bottom</h3>
          <div>
            <Textarea label="Line 1" rows={2} value={bottomSection.line1} onChange={e => setBottomSection(p => ({ ...p, line1: e.target.value }))} />
          </div>
          <div>
            <Textarea label="Line 2" rows={2} value={bottomSection.line2} onChange={e => setBottomSection(p => ({ ...p, line2: e.target.value }))} />
          </div>
        </div>

        <div>
          <button disabled={saving} onClick={saveAll} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 8, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save All'}</button>
        </div>
      </div>
    </AdminLayout>
  )
}

