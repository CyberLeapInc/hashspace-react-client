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