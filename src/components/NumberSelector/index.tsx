import react, {useState, useEffect} from 'react'
import css from './index.module.css'
import {PlusOutlined, MinusOutlined} from "@ant-design/icons";

export interface NumberSelector {
    value: number
    unit: string
    step: number
    min?: number
    max?: number
    onChange: (res: number) => void,
    styles? : Record<string, any>
}

export const NumberSelector = ({value,onChange, unit = 'T', step = 1, min = 0, max = 9999999, styles = {}}: NumberSelector) => {
    const [currentValue, setCurrentValue] = useState(value)

    useEffect(() => {
        setCurrentValue(value);
    }, [value]);

    const handleOpera = (type: boolean) => {
        let res = currentValue;
        if (type) {
            if (res + step <= max) {
                res += step;
            }
        } else {
            if (res - step >= min) {
                res -= step;
            }
        }
        setCurrentValue(res)
        onChange&&onChange(res);
    }
    return (<div className={css.numberSelectorWrapper} style={{...styles}}>
        <div className={css.handler} onClick={() => handleOpera(false)}>
            <MinusOutlined />
        </div>
        <div>
            {unit === '$' ? unit : ''}{currentValue}{unit !== '$' ? unit : ''}
        </div>
        <div className={css.handler} onClick={() => handleOpera(true)}>
            <PlusOutlined />
        </div>
    </div>)
}

export default NumberSelector