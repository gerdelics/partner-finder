interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
}

const variantClasses = {
  primary: 'bg-blue-700 hover:bg-blue-800 text-white border border-blue-700',
  danger: 'bg-red-600 hover:bg-red-700 text-white border border-red-600',
  ghost: 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-300',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
}

export function Button({ variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    />
  )
}
