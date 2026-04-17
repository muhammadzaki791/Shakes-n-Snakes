'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, Mail, Trash2 } from 'lucide-react'
import { client, writeClient } from '@/lib/client'

interface Subscriber {
  _id: string
  email: string
  source: string
  subscribedAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  async function fetchSubscribers() {
    const data = await client.fetch(
      `*[_type == "newsletter"] | order(subscribedAt desc) { _id, email, source, subscribedAt }`
    )
    setSubscribers(data)
    setLoading(false)
  }

  function exportCSV() {
    const headers = 'Email,Source,Subscribed At\n'
    const rows = subscribers
      .map((s) => `${s.email},${s.source},${s.subscribedAt}`)
      .join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-brand-bg min-h-screen py-12 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">
              Newsletter Subscribers
            </h1>
            <p className="text-brand-text-secondary">
              {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
            </p>
          </div>
          {subscribers.length > 0 && (
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white hover:bg-brand-primary-hover transition-colors"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-brand-card p-12 text-center">
            <Mail className="mx-auto h-12 w-12 text-brand-text-muted mb-4" />
            <p className="text-brand-text-secondary">No subscribers yet</p>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-brand-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-brand-elevated">
                  <th className="px-4 py-3 text-left font-[family-name:var(--font-accent)] text-brand-text-secondary">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left font-[family-name:var(--font-accent)] text-brand-text-secondary">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-[family-name:var(--font-accent)] text-brand-text-secondary">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub._id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-brand-text">{sub.email}</td>
                    <td className="px-4 py-3 text-brand-text-secondary">{sub.source}</td>
                    <td className="px-4 py-3 text-brand-text-secondary">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
