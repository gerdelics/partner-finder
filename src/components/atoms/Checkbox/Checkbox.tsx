interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  id: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, label, id, disabled }: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="inline-flex items-center gap-2 cursor-pointer select-none"
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}
