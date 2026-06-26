import { Badge } from '@/components/atoms/Badge'
import { BoolIcon } from '@/components/atoms/BoolIcon'
import type { Partner } from '@/types/partner'

interface PartnerRowProps {
  partner: Partner
  isSelected: boolean
  onClick: (id: string) => void
}

export function PartnerRow({ partner, isSelected, onClick }: PartnerRowProps) {
  return (
    <tr
      onClick={() => onClick(isSelected ? '' : partner.id)}
      className={[
        'cursor-pointer transition-colors border-b border-gray-100',
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50',
      ].join(' ')}
    >
      <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{partner.name}</td>
      <td className="px-3 py-2 text-gray-600">
        {partner.phone && (
          <a
            href={`tel:${partner.phone}`}
            className="hover:text-blue-700 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {partner.phone}
          </a>
        )}
      </td>
      <td className="px-3 py-2 text-gray-600">
        {partner.email && (
          <a
            href={`mailto:${partner.email}`}
            className="hover:text-blue-700 hover:underline"
            onClick={e => e.stopPropagation()}
          >
            {partner.email}
          </a>
        )}
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {partner.countries.map(c => (
            <Badge key={c} label={c} variant="country" />
          ))}
        </div>
      </td>
      <td className="px-3 py-2">
        <div className="flex flex-wrap gap-1">
          {partner.vehicleTypes.map(v => (
            <Badge key={v} label={v} variant="vehicle" />
          ))}
        </div>
      </td>
      <td className="px-3 py-2 text-right text-gray-700 whitespace-nowrap">
        {partner.capacity !== null ? `${partner.capacity} t` : '–'}
      </td>
      <td className="px-3 py-2 text-center">
        <BoolIcon value={partner.tailLift} title="Emelőhátfal" />
      </td>
      <td className="px-3 py-2 text-center">
        <BoolIcon value={partner.adr} title="ADR" />
      </td>
      <td className="px-3 py-2 text-center">
        <BoolIcon value={partner.partialLoad} title="Részrakomány" />
      </td>
      <td className="px-3 py-2 max-w-48 truncate text-gray-500 text-sm" title={partner.notes}>
        {partner.notes}
      </td>
    </tr>
  )
}
