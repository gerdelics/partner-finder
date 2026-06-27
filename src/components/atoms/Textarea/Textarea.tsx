interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  labelSize?: 'sm' | 'xs'
  error?: string
}

const labelCls = {
  sm: 'text-sm font-medium text-gray-700',
  xs: 'text-xs font-medium text-gray-600',
}

export function Textarea({
  label, labelSize = 'sm', error,
  id, className = '', ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className={labelCls[labelSize]}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        {...props}
        className={[
          'border rounded-lg px-3 py-2 text-sm w-full transition-colors resize-none',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error ? 'border-red-400' : 'border-gray-300',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
