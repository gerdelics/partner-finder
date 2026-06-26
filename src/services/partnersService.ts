import { ref, push, update, remove, onValue } from 'firebase/database'
import { db } from './firebase'
import type { Partner, PartnerInput } from '@/types/partner'

type RtdbPartnerData = Omit<Partner, 'id' | 'countries' | 'vehicleTypes' | 'createdAt' | 'updatedAt'> & {
  countries?: Record<string, boolean>
  vehicleTypes?: Record<string, boolean>
  createdAt?: string
  updatedAt?: string
}

const partnersRef = (uid: string) => ref(db, `users/${uid}/partners`)
const partnerRef = (uid: string, id: string) => ref(db, `users/${uid}/partners/${id}`)

function toRtdb(input: PartnerInput): RtdbPartnerData {
  const { countries, vehicleTypes, ...rest } = input
  return {
    ...rest,
    countries: Object.fromEntries(countries.map(c => [c, true])),
    vehicleTypes: Object.fromEntries(vehicleTypes.map(v => [v, true])),
  }
}

function fromRtdb(id: string, data: RtdbPartnerData): Partner {
  return {
    ...data,
    id,
    countries: data.countries ? Object.keys(data.countries) : [],
    vehicleTypes: data.vehicleTypes ? Object.keys(data.vehicleTypes) : [],
    createdAt: data.createdAt ?? new Date().toISOString(),
    updatedAt: data.updatedAt ?? new Date().toISOString(),
  }
}

export const subscribeToPartners = (
  uid: string,
  callback: (partners: Partner[]) => void
) => {
  return onValue(partnersRef(uid), snapshot => {
    const raw = snapshot.val() as Record<string, RtdbPartnerData> | null
    if (!raw) {
      callback([])
      return
    }
    const list = Object.entries(raw).map(([id, data]) => fromRtdb(id, data))
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    callback(list)
  })
}

export const addPartner = async (uid: string, input: PartnerInput) => {
  const now = new Date().toISOString()
  await push(partnersRef(uid), { ...toRtdb(input), createdAt: now, updatedAt: now })
}

export const updatePartner = async (uid: string, id: string, input: PartnerInput) => {
  await update(partnerRef(uid, id), {
    ...toRtdb(input),
    updatedAt: new Date().toISOString(),
  })
}

export const deletePartner = async (uid: string, id: string) => {
  await remove(partnerRef(uid, id))
}
