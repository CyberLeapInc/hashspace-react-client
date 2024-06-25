'use client'
import type { DependencyList, EffectCallback } from "react"
import { useEffect, useRef } from "react"
import moment from "moment";

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
    return moment(d * 1000).format('MM/DD/YYYY')
}