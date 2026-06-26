import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onReset: () => void
}

export function SearchBar({ value, onChange, onReset }: SearchBarProps) {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Input
          id="nlp-search"
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Pl. 18 tonnás hátfalas német..."
          label="Keresés"
        />
      </div>
      <Button variant="ghost" size="md" onClick={onReset} type="button">
        Törlés
      </Button>
    </div>
  )
}
