import css from './index.module.css'
import {useState} from "react";
import {cn} from "@/lib/utils";

interface InputProps {
    defaultValue?: string | number;
    type?: string;
    unit?: string;
    step?: number;
    min?: number;
    max?: number;
    onBlur?: (v: any) => void;
    onFocus?: (v: any) => void;
    onChange: (value: any) => void;
    inputMarginLeft?: string;
}

export const CustomInput = ({
    defaultValue,
    type,
    unit,
    onChange,
    step,
    min,
    max,
    onBlur,
    onFocus,
    inputMarginLeft
                            }: InputProps) => {
    const [isFocus,setIsFocus] = useState(false)
    const handleOnBlur = (v:any) => {
        setIsFocus(false)
        onBlur && onBlur(v)
    }
    const handleOnFocus = (v:any) => {
        setIsFocus(true)
        onFocus && onFocus(v)
    }
    return (
        <div className={cn(css.inputWrapper, isFocus && css.inputWrapperFocus)}>
            <input style={{
                marginLeft: inputMarginLeft|| ''
            }} className={css.input} defaultValue={defaultValue} type={type} step={step} max={max} min={min} onChange={onChange} onFocus={handleOnFocus} onBlur={handleOnBlur}/>
            <div className={css.unit}>{unit}</div>
        </div>
    )
}