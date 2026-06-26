interface BadgeProps {
  label: string
  variant?: 'country' | 'vehicle' | 'default'
}

const variantClasses = {
  country: 'bg-blue-100 text-blue-800',
  vehicle: 'bg-green-100 text-green-800',
  default: 'bg-gray-100 text-gray-700',
}

export function Badge({ label, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block px-1.5 py-0.5 rounded text-xs font-medium',
        variantClasses[variant],
      ].join(' ')}
    >
      {label}
    </span>
  )
}
