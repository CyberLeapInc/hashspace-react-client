import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getStateTextColor = (state: number, type: number | undefined) => {
  if (type === 2) {
    return '#333'
  } else if (type === 1) {
    switch (state){
      case 1:
        return '#999'
      case 2:
        return '#16C984'
      case 3:
        return '#EA2A2A'
      default:
        return '#333'
    }
  }
}

export const getAmountColor = (state: number, type: number | undefined) => {
    if (type === 2) {
        return '#EA2A2A'
    } else if (type === 1) {
        switch (state){
        case 2:
            return '#16C984'
        default:
            return '#999'
        }
    }
}

export const getToFixedLength = (currency?: string) => {
    switch (currency) {
        case 'BTC':
            return 8
        case 'DOGE':
            return 2
        case 'LTC':
            return 8
        default:
            return 2
    }
}

// 根据数字格式化算力
export function parseHashrateByNumber(value = 0, precision = 2, unit = '') {
    const HASHRATE_UNIT_LIST_FULL = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']
    if (unit === 'T') {
        value = value * Math.pow(10, 12)
    }
    if (value >= Math.pow(10, 27)) {
        return {
            hashrate: value,
            unit: ''
        }
    }

    let pos = -1

    while (value >= 1000) {
        value /= 1000
        pos++
    }

    return {
        hashrate: value.toFixed(precision),
        unit: HASHRATE_UNIT_LIST_FULL[pos] || ''
    }
}