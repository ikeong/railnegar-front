import { usePersianNumber } from './usePersianNumber'

const { toLatinDigits } = usePersianNumber()

/** Convert Shamsi YYYY/MM/DD string to Gregorian YYYY-MM-DD string */
export function shamsiToGregorian(shamsiStr: string): string {
  if (!shamsiStr) return ''
  const clean = toLatinDigits(shamsiStr).replace(/[^\d]/g, '')
  if (clean.length < 8) return shamsiStr

  const jy = parseInt(clean.slice(0, 4), 10)
  const jm = parseInt(clean.slice(4, 6), 10)
  const jd = parseInt(clean.slice(6, 8), 10)

  if (jy >= 1900) {
    const mStr = String(jm).padStart(2, '0')
    const dStr = String(jd).padStart(2, '0')
    return `${jy}-${mStr}-${dStr}`
  }

  if (jy < 1200 || jm < 1 || jm > 12 || jd < 1 || jd > 31) return shamsiStr

  let gy = (jy <= 979) ? 621 : 1600
  let jyTemp = jy - ((jy <= 979) ? 0 : 979)

  let days = (365 * jyTemp) + Math.floor(jyTemp / 33) * 8 + Math.floor(((jyTemp % 33) + 3) / 4) +
             ((jm < 7) ? (jm - 1) * 31 : ((jm - 7) * 30) + 186) + jd - 1

  gy += 400 * Math.floor(days / 146097)
  days %= 146097

  if (days >= 36525) {
    days--
    gy += 100 * Math.floor(days / 36524)
    days %= 36524
    if (days >= 365) days++
  }

  gy += 4 * Math.floor(days / 1461)
  days %= 1461

  if (days >= 366) {
    days--
    gy += Math.floor(days / 365)
    days %= 365
  }

  const sal_a = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let gm = 0
  let dayCounter = days
  for (gm = 1; gm <= 12; gm++) {
    const v = sal_a[gm] ?? 30
    if (dayCounter < v) break
    dayCounter -= v
  }

  const mStr = String(gm).padStart(2, '0')
  const dStr = String(dayCounter + 1).padStart(2, '0')
  return `${gy}-${mStr}-${dStr}`
}

/** Convert Gregorian ISO / YYYY-MM-DD string to Shamsi YYYY/MM/DD string */
export function gregorianToShamsi(gregorianStr: string): string {
  if (!gregorianStr) return ''
  try {
    const d = new Date(gregorianStr)
    if (isNaN(d.getTime())) return gregorianStr
    const parts = new Intl.DateTimeFormat('en-US-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(d)

    let year = '', month = '', day = ''
    for (const p of parts) {
      if (p.type === 'year') year = p.value
      if (p.type === 'month') month = p.value
      if (p.type === 'day') day = p.value
    }
    if (year && month && day) {
      return `${year}/${month}/${day}`
    }
  } catch {}
  return gregorianStr
}

/** Mask Shamsi birth date input: 13XX/XX/XX or 14XX/XX/XX (year >= 1300) */
export function maskShamsiDate(val: string): string {
  const digits = toLatinDigits(val).replace(/[^\d]/g, '')
  if (!digits) return ''

  let result = digits.slice(0, 8)

  // Enforce year >= 1300
  if (result.length >= 2) {
    const prefix = parseInt(result.slice(0, 2), 10)
    if (prefix < 13) {
      result = '13' + result.slice(2)
    }
  }

  if (result.length > 4 && result.length <= 6) {
    return `${result.slice(0, 4)}/${result.slice(4)}`
  } else if (result.length > 6) {
    return `${result.slice(0, 4)}/${result.slice(4, 6)}/${result.slice(6, 8)}`
  }
  return result
}

/** Mask Miladi birth date input: YYYY/MM/DD */
export function maskMiladiDate(val: string): string {
  const digits = toLatinDigits(val).replace(/[^\d]/g, '')
  if (!digits) return ''

  const result = digits.slice(0, 8)

  if (result.length > 4 && result.length <= 6) {
    return `${result.slice(0, 4)}/${result.slice(4)}`
  } else if (result.length > 6) {
    return `${result.slice(0, 4)}/${result.slice(4, 6)}/${result.slice(6, 8)}`
  }
  return result
}

/** Calculate age category ('کودک' | 'بزرگسال') from birth date */
export function getPassengerAgeCategory(birthDateStr: string, isForeign = false): { label: 'کودک' | 'بزرگسال'; age: number } | null {
  if (!birthDateStr) return null

  let birthDateObj: Date | null = null

  if (!isForeign) {
    // Shamsi date YYYY/MM/DD
    const greg = shamsiToGregorian(birthDateStr)
    if (greg) {
      birthDateObj = new Date(greg)
    }
  } else {
    // Miladi date YYYY/MM/DD or YYYY-MM-DD
    const clean = toLatinDigits(birthDateStr).replace(/\//g, '-')
    birthDateObj = new Date(clean)
  }

  if (!birthDateObj || isNaN(birthDateObj.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const mDiff = today.getMonth() - birthDateObj.getMonth()
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }

  if (age < 0) age = 0

  return {
    label: age < 12 ? 'کودک' : 'بزرگسال',
    age
  }
}
