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
  md: 'px-3 py-2',
  sm: 'px-2 py-1.5',
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
      <select
        id={id}
        {...props}
        className={[
          'border border-gray-300 rounded-lg text-sm w-full bg-white',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
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
    </div>
  )
}
