export interface ClientProfile {
  id: number
  name: string
  tier: string
  phone?: string
}

const PROFILE_KEY = 'rn-profile'

export const useProfile = () => {
  const isClient = typeof window !== 'undefined'

  const getProfile = (): ClientProfile | null => {
    if (!isClient) return null
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return null
    try {
      return JSON.parse(raw) as ClientProfile
    } catch {
      return null
    }
  }

  const saveProfile = (profile: ClientProfile) => {
    if (!isClient) return
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }

  const clearProfile = () => {
    if (!isClient) return
    localStorage.removeItem(PROFILE_KEY)
  }

  const saveProfileFromVerify = (data: {
    apiKey?: string
    client?: { id: number; name?: string; tier?: string }
  }) => {
    if (data.client) {
      saveProfile({
        id: data.client.id,
        name: data.client.name || 'کاربر',
        tier: data.client.tier || 'REGULAR'
      })
    }
  }

  const getTierLabel = (tier: string): string => {
    switch (tier) {
      case 'ROYAL': return 'طلایی'
      case 'SPECIAL': return 'نقره‌ای'
      case 'BASIC': return 'معمولی'
      default: return 'معمولی'
    }
  }

  const getTierColor = (tier: string): string => {
    switch (tier) {
      case 'ROYAL': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'SPECIAL': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-primary bg-primary/5 border-primary/20'
    }
  }

  /** Agency = SPECIAL or ROYAL tier (they get the agency fee discount). */
  const isAgencyTier = (tier: string): boolean => {
    return tier === 'SPECIAL' || tier === 'ROYAL'
  }

  return {
    getProfile,
    saveProfile,
    clearProfile,
    saveProfileFromVerify,
    getTierLabel,
    getTierColor,
    isAgencyTier
  }
}
