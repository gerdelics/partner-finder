import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'

const HU_MONTHS = ['Január','Február','Március','Április','Május','Június','Július','Augusztus','Szeptember','Október','November','December']
const HU_WEEKDAYS = ['V','H','K','Sz','Cs','P','Sz']

function toLocalStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function fmt(str: string): string {
  if (!str) return ''
  const [y, m, d] = str.split('-')
  return `${d}.${m}.${y}`
}

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  label?: string
  labelSize?: 'sm' | 'xs'
  required?: boolean
  id?: string
}

const labelCls = {
  sm: 'text-sm font-medium text-gray-700',
  xs: 'text-xs font-medium text-gray-600',
}

export function DatePicker({ value, onChange, label, labelSize = 'sm', required, id }: DatePickerProps) {
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

  const selected = value ? new Date(`${value}T00:00:00`) : undefined

  const handleSelect = (date: Date | undefined) => {
    onChange(date ? toLocalStr(date) : '')
    if (date) setOpen(false)
  }

  const defaultMonth = selected ?? new Date()

  return (
    <div ref={ref} className="relative flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={labelCls[labelSize]}>
          {label}{required && ' *'}
        </label>
      )}
      <button
        id={id}
        type="button"
        onClick={() => setOpen(o => !o)}
        className={[
          'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm border w-full text-left transition-colors',
          open
            ? 'border-blue-500 ring-2 ring-blue-500 bg-white text-gray-900'
            : value
            ? 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
            : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400',
        ].join(' ')}
      >
        <svg className="w-4 h-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="flex-1">{value ? fmt(value) : 'Dátum kiválasztása'}</span>
        {value && (
          <span
            role="button"
            tabIndex={0}
            onClick={e => { e.stopPropagation(); onChange(''); setOpen(false) }}
            onKeyDown={e => e.key === 'Enter' && (e.stopPropagation(), onChange(''), setOpen(false))}
            className="text-gray-300 hover:text-gray-500 text-xs leading-none"
            aria-label="Törlés"
          >✕</span>
        )}
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white rounded-2xl border border-gray-200 shadow-2xl p-3">
          <DayPicker
            mode="single"
            navLayout="around"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={defaultMonth}
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
