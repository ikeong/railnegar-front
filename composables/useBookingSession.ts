/**
 * Booking session store — gives every booking flow a short-lived uuid so the
 * train-passengers page survives refresh and wallet-redirect.
 *
 * v2.6.0: localStorage-based with 1-hour expiry (frontend-only until the
 * backend search-session endpoint lands; same API shape, drop-in later).
 */

export interface BookingSessionData {
  selectedTrains: any[]
  passengers: { men: number; women: number; boys: number; girls: number; infants: number } | number
  compartmentType: string
  searchMode?: string
  subRequests?: { fromStationId: number; toStationId: number; travelDate: string }[]
  scattered?: boolean
  createdAt: string
  expiresAt: string
}

const SESSION_PREFIX = 'rn-session-'
const SESSION_TTL_MS = 60 * 60 * 1000 // 1 hour

export const useBookingSession = () => {
  /** Generate a fresh uuid (crypto.randomUUID with fallback). */
  const newUuid = (): string => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  /** Persist a booking session; returns the uuid. */
  const createSession = (data: Omit<BookingSessionData, 'createdAt' | 'expiresAt'>): string => {
    const uuid = newUuid()
    const now = Date.now()
    const session: BookingSessionData = {
      ...data,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + SESSION_TTL_MS).toISOString()
    }
    localStorage.setItem(SESSION_PREFIX + uuid, JSON.stringify(session))
    return uuid
  }

  /** Load a session by uuid; null if missing/expired. Expired sessions are purged. */
  const getSession = (uuid: string): BookingSessionData | null => {
    if (!uuid) return null
    const raw = localStorage.getItem(SESSION_PREFIX + uuid)
    if (!raw) return null
    try {
      const session = JSON.parse(raw) as BookingSessionData
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        localStorage.removeItem(SESSION_PREFIX + uuid)
        return null
      }
      return session
    } catch {
      localStorage.removeItem(SESSION_PREFIX + uuid)
      return null
    }
  }

  /** Keep a session alive (sliding expiry) — called when the page is visited. */
  const touchSession = (uuid: string): void => {
    const session = getSession(uuid)
    if (session) {
      session.expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()
      localStorage.setItem(SESSION_PREFIX + uuid, JSON.stringify(session))
    }
  }

  /** Remove a session (e.g. after successful booking). */
  const deleteSession = (uuid: string): void => {
    localStorage.removeItem(SESSION_PREFIX + uuid)
  }

  return { newUuid, createSession, getSession, touchSession, deleteSession }
}
