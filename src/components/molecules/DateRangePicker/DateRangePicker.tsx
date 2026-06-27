import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import type { DateRange } from 'react-day-picker'

const HU_MONTHS = ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December']
const HU_WEEKDAYS = ['V','H','K','Sz','Cs','P','Sz']

function toLocalStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmt(str: string): string {
  const [y, m, d] = str.split('-')
  return `${d}.${m}.${y}`
}

interface DateRangePickerProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
  onClear: () => void
}

export function DateRangePicker({ from, to, onChange, onClear }: DateRangePickerProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const range: DateRange | undefined = (from || to) ? {
    from: from ? new Date(`${from}T00:00:00`) : undefined,
    to: to ? new Date(`${to}T00:00:00`) : undefined,
  } : undefined

  const handleSelect = (r: DateRange | undefined) => {
    const f = r?.from ? toLocalStr(r.from) : ''
    const t = r?.to ? toLocalStr(r.to) : ''
    onChange(f, t)
    // v10: empty range → { from: date, to: date } (min=0 default), so guard against same-day close
    if (f && t && f !== t) setOpen(false)
  }

  const hasValue = !!(from || to)
  const label = from && to
    ? `${fmt(from)} – ${fmt(to)}`
    : from ? `${fmt(from)} – …`
    : 'Időszak kiválasztása'

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
          hasValue || open
            ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
        ].join(' ')}
      >
        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {label}
      </button>

      {hasValue && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Törlés"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors text-xs leading-none"
        >
          ✕
        </button>
      )}

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white rounded-2xl border border-gray-200 shadow-2xl p-3">
          <DayPicker
            mode="range"
            navLayout="around"
            selected={range}
            onSelect={handleSelect}
            showOutsideDays
            fixedWeeks
            formatters={{
              formatCaption: (d: Date) => `${HU_MONTHS[d.getMonth()]} ${d.getFullYear()}`,
              formatWeekdayName: (d: Date) => HU_WEEKDAYS[d.getDay()],
            }}
          />
        </div>
      )}
    </div>
  )
}
