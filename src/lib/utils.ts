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
    if (value === undefined) return {
        hashrate: 0,
        unit: ''
    }
    if (typeof value === 'string') {
        value = Number(value)
    }
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

export function formatThousands(num: string | number, isDecimal = true) {
    // Ensure the input is a number.
    num = Number(num);
    if (isNaN(num)) {
        throw new Error('Input must be a number or a string that can be converted to a number.');
    }

    // Split the number into its integer and decimal parts.
    let [integer, decimal] = num.toString().split('.');

    // Convert the integer part to an array of characters.
    const chars = integer.split('');

    // Reverse the array and insert a comma after every third digit.
    for (let i = chars.length - 3; i > 0; i -= 3) {
        chars.splice(i, 0, ',');
    }

    // Reverse the array again and join it back into a string.
    integer = chars.join('');
    if (decimal?.length === 1) {
        decimal = decimal + '0'
    }

    // If there was a decimal part, add it back to the end of the string.
    if (decimal !== undefined) {
        return `${integer}${isDecimal? '.' : ''}${isDecimal ? decimal : ''}`;
    } else {
        return `${integer}${isDecimal ? '.00' : ''}`;
    }
}