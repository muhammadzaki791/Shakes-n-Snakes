'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { client } from '@/lib/client'
import { getSearchResultsQuery } from '@/lib/client/queries'
import { getMenuItemPath } from '@/lib/client/utils'
import { urlFor } from '@/sanity/lib/image'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'
import type { SearchResult } from '@/types/menu-types'

const placeholderTexts = [
  'Craving a shake?...',
  'Search for fries...',
  'Find your favourite...',
  'Try our biryani...',
  'Feeling thirsty?...',
]

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeout = setTimeout(async () => {
      setIsLoading(true)
      try {
        const data = await client.fetch(getSearchResultsQuery, { searchTerm: `${query}*` })
        setResults(data || [])
        setIsOpen(true)
      } catch {
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return (
    <div ref={containerRef} className="relative w-full md:w-64">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results.length > 0 && setIsOpen(true)}
          className="w-full rounded-full border border-white/10 bg-brand-elevated py-2 pl-10 pr-4 text-sm text-brand-text placeholder:text-transparent focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
        />
        {!query && (
          <div className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2">
            <TypewriterEffect texts={placeholderTexts} className="text-sm text-brand-text-muted" />
          </div>
        )}
        {isLoading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-brand-primary" />}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-white/10 bg-brand-card shadow-xl overflow-hidden z-50">
          {results.map((item) => (
            <Link
              key={item._id}
              href={getMenuItemPath(item as Pick<import('@/types/menu-types').MenuItem, '_type' | 'slug'>)}
              onClick={() => { setIsOpen(false); setQuery('') }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-brand-elevated transition-colors"
            >
              {item.image && (
                <img
                  src={urlFor(item.image).width(40).height(40).url()}
                  alt={item.title}
                  className="h-10 w-10 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-brand-text truncate">{item.title}</p>
                <p className="text-xs font-[family-name:var(--font-accent)] text-brand-yellow">{item.priceDisplay}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim() && results.length === 0 && !isLoading && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-white/10 bg-brand-card p-4 text-center text-sm text-brand-text-muted z-50">
          No items found
        </div>
      )}
    </div>
  )
}
