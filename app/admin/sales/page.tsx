'use client'

import { useEffect, useState, useMemo } from 'react'
import { client } from '@/lib/client'
import {
  getOrdersByDateRangeQuery,
  getSalesRecordsByMonthQuery,
  getSalesRecordsByDateRangeQuery,
} from '@/lib/client/queries'
import type { Order, SalesRecord } from '@/types/admin-types'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SalesSummaryCards } from '@/components/admin/sales/sales-summary-cards'
import { DateRangePicker } from '@/components/admin/sales/date-range-picker'
import { exportOrdersToCSV, exportSalesRecordsToCSV } from '@/lib/export-helpers'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function toDateString(d: Date): string {
  return d.toISOString().split('T')[0]
}

function getDayStartEnd(d: Date) {
  const ds = toDateString(d)
  return { start: `${ds}T00:00:00.000Z`, end: `${ds}T23:59:59.999Z` }
}

function getMonthRange(year: number, month: number) {
  const start = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export default function SalesPage() {
  const [tab, setTab] = useState('daily')

  // Daily state
  const [dailyDate, setDailyDate] = useState<Date>(new Date())
  const [dailyOrders, setDailyOrders] = useState<Order[]>([])
  const [dailyLoading, setDailyLoading] = useState(false)

  // Monthly state
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [monthlyRecords, setMonthlyRecords] = useState<SalesRecord[]>([])
  const [monthlyLoading, setMonthlyLoading] = useState(false)

  // Custom range state
  const [rangeStart, setRangeStart] = useState<Date | undefined>()
  const [rangeEnd, setRangeEnd] = useState<Date | undefined>()
  const [rangeRecords, setRangeRecords] = useState<SalesRecord[]>([])
  const [rangeOrders, setRangeOrders] = useState<Order[]>([])
  const [rangeLoading, setRangeLoading] = useState(false)

  // Fetch daily orders (active + archived)
  useEffect(() => {
    if (tab !== 'daily') return
    setDailyLoading(true)
    const { start, end } = getDayStartEnd(dailyDate)
    client.fetch(getOrdersByDateRangeQuery, { startDate: start, endDate: end })
      .then((data: Order[]) => setDailyOrders(data || []))
      .finally(() => setDailyLoading(false))
  }, [dailyDate, tab])

  // Fetch monthly sales records
  useEffect(() => {
    if (tab !== 'monthly') return
    setMonthlyLoading(true)
    const { start, end } = getMonthRange(selectedYear, selectedMonth)
    client.fetch(getSalesRecordsByMonthQuery, { monthStart: start, monthEnd: end })
      .then((data: SalesRecord[]) => setMonthlyRecords(data || []))
      .finally(() => setMonthlyLoading(false))
  }, [selectedYear, selectedMonth, tab])

  // Fetch custom range
  useEffect(() => {
    if (tab !== 'custom' || !rangeStart || !rangeEnd) return
    setRangeLoading(true)
    const start = toDateString(rangeStart)
    const end = toDateString(rangeEnd)

    Promise.all([
      client.fetch(getSalesRecordsByDateRangeQuery, { startDate: start, endDate: end }),
      client.fetch(getOrdersByDateRangeQuery, {
        startDate: `${start}T00:00:00.000Z`,
        endDate: `${end}T23:59:59.999Z`,
      }),
    ]).then(([records, orders]) => {
      setRangeRecords(records || [])
      setRangeOrders(orders || [])
    }).finally(() => setRangeLoading(false))
  }, [rangeStart, rangeEnd, tab])

  // Daily summary
  const dailySummary = useMemo(() => {
    const completed = dailyOrders.filter((o) => o.status !== 'cancelled')
    const revenue = completed.reduce((s, o) => s + o.total, 0)
    const avg = completed.length > 0 ? Math.round(revenue / completed.length) : 0

    const itemCounts: Record<string, number> = {}
    completed.forEach((o) => o.items.forEach((i) => {
      itemCounts[i.menuItemTitle] = (itemCounts[i.menuItemTitle] || 0) + i.quantity
    }))
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

    return { totalOrders: dailyOrders.length, totalRevenue: revenue, avgOrderValue: avg, topItem }
  }, [dailyOrders])

  // Monthly summary
  const monthlySummary = useMemo(() => {
    const totalOrders = monthlyRecords.reduce((s, r) => s + r.totalOrders, 0)
    const totalRevenue = monthlyRecords.reduce((s, r) => s + r.netRevenue, 0)
    const avg = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    const allTopItems = monthlyRecords.flatMap((r) => r.topItems || [])
    const itemCounts: Record<string, number> = {}
    allTopItems.forEach((i) => { itemCounts[i.itemTitle] = (itemCounts[i.itemTitle] || 0) + i.quantity })
    const topItem = Object.entries(itemCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    return { totalOrders, totalRevenue, avgOrderValue: avg, topItem }
  }, [monthlyRecords])

  // Range summary
  const rangeSummary = useMemo(() => {
    const archivedOrders = rangeRecords.reduce((s, r) => s + r.totalOrders, 0)
    const archivedRevenue = rangeRecords.reduce((s, r) => s + r.netRevenue, 0)
    const activeCompleted = rangeOrders.filter((o) => o.status !== 'cancelled')
    const activeRevenue = activeCompleted.reduce((s, o) => s + o.total, 0)
    const totalOrders = archivedOrders + rangeOrders.length
    const totalRevenue = archivedRevenue + activeRevenue
    const avg = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    return { totalOrders, totalRevenue, avgOrderValue: avg }
  }, [rangeRecords, rangeOrders])

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]

  return (
    <div className="bg-brand-bg min-h-screen py-12 px-4">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-brand-text-muted hover:text-brand-primary mb-3">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-3xl text-brand-text">Sales Reports</h1>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-brand-elevated border border-white/10 mb-6">
            <TabsTrigger value="daily" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              Daily
            </TabsTrigger>
            <TabsTrigger value="monthly" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="custom" className="data-[state=active]:bg-brand-primary data-[state=active]:text-white text-brand-text-secondary">
              Custom Range
            </TabsTrigger>
          </TabsList>

          {/* Daily Tab */}
          <TabsContent value="daily" className="space-y-6">
            <div className="flex items-center justify-between">
              <DateRangePicker
                startDate={dailyDate}
                endDate={dailyDate}
                onStartChange={(d) => d && setDailyDate(d)}
                onEndChange={() => {}}
              />
              {dailyOrders.length > 0 && (
                <button
                  onClick={() => exportOrdersToCSV(dailyOrders, `daily-sales-${toDateString(dailyDate)}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              )}
            </div>

            {dailyLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              </div>
            ) : (
              <>
                <SalesSummaryCards {...dailySummary} />
                {dailyOrders.length > 0 && (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
                          <TableHead className="text-brand-text-secondary">Order #</TableHead>
                          <TableHead className="text-brand-text-secondary">Time</TableHead>
                          <TableHead className="text-brand-text-secondary">Customer</TableHead>
                          <TableHead className="text-brand-text-secondary">Items</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Total</TableHead>
                          <TableHead className="text-brand-text-secondary">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyOrders.map((o) => (
                          <TableRow key={o._id} className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-brand-text font-medium">#{o.orderNumber}</TableCell>
                            <TableCell className="text-brand-text-secondary text-sm">
                              {new Date(o.orderDate).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                            </TableCell>
                            <TableCell className="text-brand-text">{o.customerName || 'Walk-in'}</TableCell>
                            <TableCell className="text-brand-text-secondary text-sm">
                              {o.items.map((i) => `${i.menuItemTitle} x${i.quantity}`).join(', ')}
                            </TableCell>
                            <TableCell className="text-right text-brand-text font-medium">Rs. {o.total}</TableCell>
                            <TableCell className="capitalize text-brand-text-secondary text-sm">{o.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Monthly Tab */}
          <TabsContent value="monthly" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
                  <SelectTrigger className="w-36 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    {months.map((m, i) => (
                      <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={String(selectedYear)} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                  <SelectTrigger className="w-24 bg-brand-elevated border-white/10 text-brand-text">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-brand-elevated border-white/10">
                    {years.map((y) => (
                      <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {monthlyRecords.length > 0 && (
                <button
                  onClick={() => exportSalesRecordsToCSV(monthlyRecords, `monthly-sales-${selectedYear}-${String(selectedMonth).padStart(2, '0')}`)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary"
                >
                  <Download className="h-4 w-4" /> Export CSV
                </button>
              )}
            </div>

            {monthlyLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              </div>
            ) : (
              <>
                <SalesSummaryCards {...monthlySummary} />
                {monthlyRecords.length > 0 ? (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
                          <TableHead className="text-brand-text-secondary">Date</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Orders</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Revenue</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Discount</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Net Revenue</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Cash</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Online</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {monthlyRecords.map((r) => (
                          <TableRow key={r._id} className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-brand-text font-medium">{r.date}</TableCell>
                            <TableCell className="text-right text-brand-text">{r.totalOrders}</TableCell>
                            <TableCell className="text-right text-brand-text">Rs. {r.totalRevenue}</TableCell>
                            <TableCell className="text-right text-green-400">Rs. {r.totalDiscount}</TableCell>
                            <TableCell className="text-right text-brand-text font-medium">Rs. {r.netRevenue}</TableCell>
                            <TableCell className="text-right text-brand-text-secondary">Rs. {r.paymentBreakdown?.cash || 0}</TableCell>
                            <TableCell className="text-right text-brand-text-secondary">Rs. {r.paymentBreakdown?.online || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-brand-text-muted py-12">No archived sales data for this month. Archive completed orders to see data here.</p>
                )}
              </>
            )}
          </TabsContent>

          {/* Custom Range Tab */}
          <TabsContent value="custom" className="space-y-6">
            <div className="flex items-center justify-between">
              <DateRangePicker
                startDate={rangeStart}
                endDate={rangeEnd}
                onStartChange={setRangeStart}
                onEndChange={setRangeEnd}
              />
              {(rangeRecords.length > 0 || rangeOrders.length > 0) && (
                <div className="flex gap-2">
                  {rangeRecords.length > 0 && (
                    <button
                      onClick={() => exportSalesRecordsToCSV(rangeRecords, 'custom-sales')}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary"
                    >
                      <Download className="h-4 w-4" /> Archived Data
                    </button>
                  )}
                  {rangeOrders.length > 0 && (
                    <button
                      onClick={() => exportOrdersToCSV(rangeOrders, 'custom-orders')}
                      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-brand-elevated px-3 py-2 text-sm text-brand-text hover:border-brand-primary"
                    >
                      <Download className="h-4 w-4" /> Active Orders
                    </button>
                  )}
                </div>
              )}
            </div>

            {rangeLoading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
              </div>
            ) : rangeStart && rangeEnd ? (
              <>
                <SalesSummaryCards {...rangeSummary} />
                {rangeRecords.length > 0 && (
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 bg-brand-elevated hover:bg-brand-elevated">
                          <TableHead className="text-brand-text-secondary">Date</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Orders</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Revenue</TableHead>
                          <TableHead className="text-brand-text-secondary text-right">Net Revenue</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rangeRecords.map((r) => (
                          <TableRow key={r._id} className="border-white/5 hover:bg-white/5">
                            <TableCell className="text-brand-text font-medium">{r.date}</TableCell>
                            <TableCell className="text-right text-brand-text">{r.totalOrders}</TableCell>
                            <TableCell className="text-right text-brand-text">Rs. {r.totalRevenue}</TableCell>
                            <TableCell className="text-right text-brand-text font-medium">Rs. {r.netRevenue}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-brand-text-muted py-12">Select a date range to view sales data.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
