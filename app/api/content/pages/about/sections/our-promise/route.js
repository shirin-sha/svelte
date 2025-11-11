import { NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import Page from '@/models/Page'

export async function GET() {
  try {
    await dbConnect()
    let page = await Page.findOne({ slug: 'about' }).lean()
    if (!page) {
      return NextResponse.json({ title: { en: '' }, subtitle: { en: '' }, content: { en: JSON.stringify({ items: [] }) } })
    }
    const section = (page.sections || []).find(s => s.name === 'our-promise')
    if (!section) {
      return NextResponse.json({ title: { en: '' }, subtitle: { en: '' }, content: { en: JSON.stringify({ items: [] }) } })
    }
    return NextResponse.json({
      title: section.title || { en: '' },
      subtitle: section.subtitle || { en: '' },
      content: section.content || { en: JSON.stringify({ items: [] }) }
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch our-promise section' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    await dbConnect()
    const body = await req.json()

    let page = await Page.findOne({ slug: 'about' })
    if (!page) {
      page = new Page({ name: 'About', slug: 'about', sections: [] })
    }
    if (!page.sections || !Array.isArray(page.sections)) page.sections = []

    const idx = page.sections.findIndex(s => s && s.name === 'our-promise')
    const updated = {
      name: 'our-promise',
      title: body.title || { en: '' },
      subtitle: body.subtitle || { en: '' },
      content: body.content || { en: JSON.stringify({ items: [] }) },
      isActive: idx !== -1 ? page.sections[idx].isActive : true,
      order: idx !== -1 && page.sections[idx].order !== undefined ? page.sections[idx].order : (page.sections.length + 1),
      type: 'text',
    }
    if (idx !== -1) page.sections.splice(idx, 1)
    page.sections.push(updated)

    page.markModified('sections')
    await page.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update our-promise section' }, { status: 500 })
  }
}



