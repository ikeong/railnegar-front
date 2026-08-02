export const usePersianNumber = () => {
  const formatPrice = (price: number): string => {
    const formatted = new Intl.NumberFormat('fa-IR').format(price)
    return convertToPersianDigits(formatted)
  }
  
  const formatNumber = (num: number): string => {
    const formatted = new Intl.NumberFormat('fa-IR').format(num)
    return convertToPersianDigits(formatted)
  }
  
  const convertToPersianDigits = (str: string): string => {
    const persianDigits: { [key: string]: string } = {
      '0': '۰',
      '1': '۱',
      '2': '۲',
      '3': '۳',
      '4': '۴',
      '5': '۵',
      '6': '۶',
      '7': '۷',
      '8': '۸',
      '9': '۹'
    }
    return str.toString().replace(/[0-9]/g, digit => persianDigits[digit] ?? digit)
  }
  
  const toPersianDigits = (num: number | string): string => {
    return convertToPersianDigits(String(num))
  }

  const toLatinDigits = (str: string): string => {
    const latinMap: { [key: string]: string } = {
      '۰': '0',
      '۱': '1',
      '۲': '2',
      '۳': '3',
      '۴': '4',
      '۵': '5',
      '۶': '6',
      '۷': '7',
      '۸': '8',
      '۹': '9'
    }
    return String(str).replace(/[۰-۹]/g, digit => latinMap[digit] ?? digit)
  }

  return {
    formatPrice,
    formatNumber,
    convertToPersianDigits,
    toPersianDigits,
    toLatinDigits
  }
}
