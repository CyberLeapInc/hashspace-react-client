'use client'
import type { DependencyList, EffectCallback } from "react"
import { useEffect, useRef } from "react"

export function useOnMountUnsafe(effect: EffectCallback) {
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            effect()
        }
    }, [])
}

export const getLocalDate = (timeStamp :number | undefined = 0) => {
    let d = timeStamp || 0;
    return new Date(d * 1000).toLocaleDateString()
}