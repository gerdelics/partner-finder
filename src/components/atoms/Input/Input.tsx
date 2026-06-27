interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  labelSize?: 'sm' | 'xs'
  error?: string
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

export function Input({
  label, labelSize = 'sm', error,
  size = 'md', id, type, className = '', ...props
}: InputProps) {
  const isDate = type === 'date'
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={labelCls[labelSize]}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        {...props}
        className={[
          'border rounded-lg text-sm w-full transition-colors text-gray-900',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          sizeCls[size],
          error ? 'border-red-400' : 'border-gray-300',
          isDate ? [
            '[color-scheme:light]',
            '[&::-webkit-calendar-picker-indicator]:opacity-40',
            '[&::-webkit-calendar-picker-indicator]:hover:opacity-80',
            '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
            '[&::-webkit-calendar-picker-indicator]:rounded',
            '[&::-webkit-calendar-picker-indicator]:transition-opacity',
          ].join(' ') : '',
          className,
        ].filter(Boolean).join(' ')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
