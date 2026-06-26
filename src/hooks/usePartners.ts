import { useEffect, useState } from 'react'
import type { Partner, PartnerInput } from '@/types/partner'
import {
  subscribeToPartners,
  addPartner as serviceAdd,
  updatePartner as serviceUpdate,
  deletePartner as serviceDelete,
} from '@/services/partnersService'

export function usePartners(uid: string | null) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) {
      setLoading(false)
      return
    }

    // Seed from localStorage for instant display
    const cacheKey = `pf_partners_${uid}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        setPartners(JSON.parse(cached) as Partner[])
      } catch {
        // ignore corrupt cache
      }
    }

    setLoading(true)
    const unsubscribe = subscribeToPartners(uid, list => {
      setPartners(list)
      localStorage.setItem(cacheKey, JSON.stringify(list))
      setLoading(false)
    })
    return unsubscribe
  }, [uid])

  return {
    partners,
    loading,
    addPartner: (input: PartnerInput) => serviceAdd(uid!, input),
    updatePartner: (id: string, input: PartnerInput) => serviceUpdate(uid!, id, input),
    deletePartner: (id: string) => serviceDelete(uid!, id),
  }
}
