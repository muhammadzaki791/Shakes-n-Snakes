'use client'

import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  startDate: Date | undefined
  endDate: Date | undefined
  onStartChange: (date: Date | undefined) => void
  onEndChange: (date: Date | undefined) => void
}

function formatDate(date: Date | undefined): string {
  if (!date) return 'Pick date'
  return date.toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }: DateRangePickerProps) {
  const [startOpen, setStartOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Popover open={startOpen} onOpenChange={setStartOpen}>
        <PopoverTrigger asChild>
          <button className={cn(
            'flex items-center gap-2 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm',
            startDate ? 'text-brand-text' : 'text-brand-text-muted'
          )}>
            <CalendarIcon className="h-4 w-4" />
            {formatDate(startDate)}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-brand-elevated border-white/10" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(date) => { onStartChange(date); setStartOpen(false) }}
            disabled={(date) => date > new Date()}
          />
        </PopoverContent>
      </Popover>

      <span className="text-brand-text-muted">to</span>

      <Popover open={endOpen} onOpenChange={setEndOpen}>
        <PopoverTrigger asChild>
          <button className={cn(
            'flex items-center gap-2 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm',
            endDate ? 'text-brand-text' : 'text-brand-text-muted'
          )}>
            <CalendarIcon className="h-4 w-4" />
            {formatDate(endDate)}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-brand-elevated border-white/10" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(date) => { onEndChange(date); setEndOpen(false) }}
            disabled={(date) => date > new Date() || (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
