interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[]
  label?: string
  labelSize?: 'sm' | 'xs'
  placeholder?: string
  size?: 'md' | 'sm'
}

const labelCls = {
  sm: 'text-sm font-medium text-gray-700',
  xs: 'text-xs font-medium text-gray-600',
}

const sizeCls = {
  md: 'px-3 py-2 pr-8',
  sm: 'px-2 py-1.5 pr-7',
}

const iconSizeCls = {
  md: 'w-4 h-4 right-2.5',
  sm: 'w-3.5 h-3.5 right-2',
}

export function Select({
  options, label, labelSize = 'sm', placeholder,
  size = 'md', id, children, className = '', ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={labelCls[labelSize]}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          {...props}
          className={[
            'appearance-none border border-gray-300 rounded-lg text-sm w-full bg-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
            'text-gray-900 transition-colors cursor-pointer',
            sizeCls[size],
            className,
          ].join(' ')}
        >
          {children ?? (
            <>
              {placeholder && <option value="">{placeholder}</option>}
              {options?.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </>
          )}
        </select>
        <span className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 ${iconSizeCls[size]}`}>
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  )
}
