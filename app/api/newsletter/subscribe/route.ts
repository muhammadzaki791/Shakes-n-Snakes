import { NextResponse } from 'next/server'
import { getClient } from '@/lib/client'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email, source = 'website' } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    // Check for existing subscriber
    const existing = await getClient(process.env.SANITY_API_WRITE_TOKEN).fetch(
      `*[_type == "newsletter" && email == $email][0]._id`,
      { email }
    )

    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 })
    }

    // Hash IP for privacy
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0] || 'unknown'
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').slice(0, 16)

    await getClient(process.env.SANITY_API_WRITE_TOKEN).create({
      _type: 'newsletter',
      email,
      source,
      ipHash,
      subscribedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
