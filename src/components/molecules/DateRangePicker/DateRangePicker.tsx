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
  // draft holds the in-progress selection; null = not editing
  const [draft, setDraft] = useState<{ from: string; to: string } | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const closePopup = () => {
    setDraft(null)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) closePopup()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // While popup is open, show the draft (in-progress pick); otherwise the committed value
  const activeFrom = open && draft !== null ? draft.from : from
  const activeTo   = open && draft !== null ? draft.to   : to

  const range: DateRange | undefined = (activeFrom || activeTo) ? {
    from: activeFrom ? new Date(`${activeFrom}T00:00:00`) : undefined,
    to:   activeTo   ? new Date(`${activeTo}T00:00:00`)   : undefined,
  } : undefined

  const handleSelect = (r: DateRange | undefined) => {
    const f = r?.from ? toLocalStr(r.from) : ''
    const t = r?.to   ? toLocalStr(r.to)   : ''
    setDraft({ from: f, to: t })
    // Propagate to parent (and close) only when a complete range is chosen
    if (f && t && f !== t) {
      onChange(f, t)
      setDraft(null)
      setOpen(false)
    }
  }

  const hasValue = !!(from || to)

  // Button label: show draft progress while open, committed value when closed
  const labelFrom = open && draft ? draft.from : from
  const labelTo   = open && draft ? draft.to   : to
  const label = labelFrom && labelTo && labelFrom !== labelTo
    ? `${fmt(labelFrom)} – ${fmt(labelTo)}`
    : labelFrom ? `${fmt(labelFrom)} – …`
    : 'Időszak kiválasztása'

  return (
    <div ref={ref} className="relative inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => {
          if (open) { closePopup() } else { setDraft(null); setOpen(true) }
        }}
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

      {hasValue && !open && (
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
