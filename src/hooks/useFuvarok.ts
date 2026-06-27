import { useEffect, useState } from 'react'
import { subscribeToFuvarok, addFuvar, updateFuvar, deleteFuvar } from '@/services/fuvarService'
import type { Fuvar, FuvarInput } from '@/types/fuvar'

export function useFuvarok(uid: string) {
  const [fuvarok, setFuvarok] = useState<Fuvar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cached = localStorage.getItem(`pf_fuvarok_${uid}`)
    if (cached) { try { setFuvarok(JSON.parse(cached)) } catch { /* ignore */ } }

    const unsub = subscribeToFuvarok(uid, list => {
      setFuvarok(list)
      setLoading(false)
      localStorage.setItem(`pf_fuvarok_${uid}`, JSON.stringify(list))
    })
    return unsub
  }, [uid])

  return {
    fuvarok,
    loading,
    addFuvar: (input: FuvarInput) => addFuvar(uid, input),
    updateFuvar: (id: string, input: FuvarInput) => updateFuvar(uid, id, input),
    deleteFuvar: (id: string) => deleteFuvar(uid, id),
  }
}
