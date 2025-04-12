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

// Formats the hashrate based on the input value, precision, and unit
export function parseHashrateByNumber(
    value: number | string = 0,
    precision: number = 2,
    unit: string = ''
): { hashrate: string; unit: string } {
    // Handle undefined or invalid values
    if (value === undefined || value === null || isNaN(Number(value))) {
        return { hashrate: '0', unit: '' };
    }

    // Convert string to number if necessary
    if (typeof value === 'string') {
        value = Number(value);
    }

    // Ensure the value is non-negative
    if (value < 0) {
        return { hashrate: '0', unit: '' };
    }

    // List of hashrate units
    const HASHRATE_UNIT_LIST_FULL = ['K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

    // Convert input value based on the provided unit
    switch (unit) {
        case 'T':
            value *= Math.pow(10, 12);
            break;
        case 'M':
            value *= Math.pow(10, 6);
            break;
        case 'G':
            value *= Math.pow(10, 9);
            break;
        default:
            // If the unit is not recognized, assume no conversion
            break;
    }

    // Handle extremely large values
    if (value >= Math.pow(10, 27)) {
        return { hashrate: value.toFixed(precision), unit: '' };
    }

    // Determine the appropriate unit by dividing the value
    let pos = -1;
    while (value >= 1000 && pos < HASHRATE_UNIT_LIST_FULL.length - 1) {
        value /= 1000;
        pos++;
    }

    // Return the formatted hashrate and unit
    return {
        hashrate: value.toFixed(precision),
        unit: HASHRATE_UNIT_LIST_FULL[pos] || ''
    };
}

export function formatThousands(num: string | number, isDecimal = true) {
    // Ensure the input is a number.
    num = Number(num);
    if (isNaN(num)) {
        throw new Error('Input must be a number or a string that can be converted to a number.');
    }

    // Check if the number is negative.
    const isNegative = num < 0;
    // Make the number positive for formatting.
    num = Math.abs(num);

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
        return `${isNegative ? '-' : ''}${integer}${isDecimal ? '.' : ''}${isDecimal ? decimal : ''}`;
    } else {
        return `${isNegative ? '-' : ''}${integer}${isDecimal ? '.00' : ''}`;
    }
}


export function roundUp(num: number, precision: number) {
    precision = Math.pow(10, precision)
    return Math.ceil(num * precision) / precision
}