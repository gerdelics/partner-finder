interface BoolIconProps {
  value: boolean
  title?: string
}

export function BoolIcon({ value, title }: BoolIconProps) {
  if (value) {
    return (
      <span title={title} className="text-green-600 font-bold" aria-label="igen">
        ✓
      </span>
    )
  }
  return (
    <span title={title} className="text-gray-400" aria-label="nem">
      –
    </span>
  )
}
