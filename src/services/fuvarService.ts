import { ref, push, update, remove, onValue } from 'firebase/database'
import { db } from './firebase'
import type { Fuvar, FuvarInput } from '@/types/fuvar'

const fuvarokRef = (uid: string) => ref(db, `users/${uid}/fuvarok`)
const fuvarRef = (uid: string, id: string) => ref(db, `users/${uid}/fuvarok/${id}`)

function fromRtdb(id: string, data: Omit<Fuvar, 'id'>): Fuvar {
  return {
    ...data,
    id,
    ugyfelAr: data.ugyfelAr ?? null,
    tomeg: data.tomeg ?? null,
    partnerId: data.partnerId ?? null,
    fuvarozóAr: data.fuvarozóAr ?? null,
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  }
}

export const subscribeToFuvarok = (
  uid: string,
  callback: (fuvarok: Fuvar[]) => void
) => {
  return onValue(fuvarokRef(uid), snapshot => {
    const raw = snapshot.val() as Record<string, Omit<Fuvar, 'id'>> | null
    if (!raw) { callback([]); return }
    const list = Object.entries(raw).map(([id, data]) => fromRtdb(id, data))
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    callback(list)
  })
}

export const addFuvar = async (uid: string, input: FuvarInput) => {
  const now = new Date().toISOString()
  await push(fuvarokRef(uid), { ...input, createdAt: now, updatedAt: now })
}

export const updateFuvar = async (uid: string, id: string, input: FuvarInput) => {
  await update(fuvarRef(uid, id), { ...input, updatedAt: new Date().toISOString() })
}

export const deleteFuvar = async (uid: string, id: string) => {
  await remove(fuvarRef(uid, id))
}
