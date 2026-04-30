import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getClient } from '@/lib/client'

const adminEmails = process.env.NEXT_PUBLIC_CLERK_ADMIN_EMAIL_ADDRESSES?.split(',').map((e) =>
  e.trim().toLowerCase()
) || []

type Action =
  | { op: 'create'; doc: Record<string, unknown> }
  | { op: 'patch'; id: string; set?: Record<string, unknown>; unset?: string[]; inc?: Record<string, number> }
  | { op: 'delete'; id: string }
  | { op: 'createOrReplace'; doc: Record<string, unknown> & { _id: string } }

async function assertAdmin() {
  try {
    const user = await currentUser()
    if (!user) return { ok: false, status: 401 as const, error: 'Unauthorized' }
    const email = user.primaryEmailAddress?.emailAddress?.toLowerCase()
    if (!email || !adminEmails.includes(email)) {
      return { ok: false, status: 403 as const, error: 'Forbidden' }
    }
    return { ok: true as const }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Auth check failed'
    return { ok: false, status: 500 as const, error: `Auth error: ${message}` }
  }
}

export async function POST(request: Request) {
  const auth = await assertAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let body: { actions?: Action[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const actions = body.actions
  if (!Array.isArray(actions) || actions.length === 0) {
    return NextResponse.json({ error: 'No actions provided' }, { status: 400 })
  }

  const client = getClient(process.env.SANITY_API_WRITE_TOKEN)

  try {
    const results = []
    for (const action of actions) {
      if (action.op === 'create') {
        results.push(await client.create(action.doc as { _type: string }))
      } else if (action.op === 'createOrReplace') {
        results.push(await client.createOrReplace(action.doc as { _id: string; _type: string }))
      } else if (action.op === 'patch') {
        let p = client.patch(action.id)
        if (action.set) p = p.set(action.set)
        if (action.unset) p = p.unset(action.unset)
        if (action.inc) p = p.inc(action.inc)
        results.push(await p.commit())
      } else if (action.op === 'delete') {
        results.push(await client.delete(action.id))
      } else {
        return NextResponse.json({ error: 'Unknown op' }, { status: 400 })
      }
    }
    return NextResponse.json({ results })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sanity write failed'
    console.error('Admin sanity write error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
