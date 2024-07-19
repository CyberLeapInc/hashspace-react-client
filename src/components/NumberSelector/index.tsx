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

    const calInputWidth = (value: number | string) => {
        const temp = value.toString();
        let width = 0;
        for (let i = 0; i < temp.length; i++) {
            const charCode = temp.charCodeAt(i);
            if (charCode >= 0x4E00 && charCode <= 0x9FFF) {
                width += 20; // 中文字符
            } else {
                width += 13; // 其他字符
            }
        }
        return width + 'px';
    }
    return (<div className={css.numberSelectorWrapper} style={{...styles}}>
        <div className={css.handler} onClick={() => handleOpera(false)}>
            <MinusOutlined />
        </div>
        <div>
            <div style={{display: 'flex', alignItems: 'center', textAlign: 'right'}}>
                {
                    unit === '$' && <span
                        className={css.unit}
                        style={{
                        width: calInputWidth('$'),
                        display: 'inline-block',
                        textAlign: 'right',
                    }}>$</span>
                }
                <input
                    style={{
                        outline: 'none',
                        textAlign:  unit === '$' ? 'left' :'right',
                        width: calInputWidth(currentValue),
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: '20px'
                    }}
                    value={currentValue}
                    type={'text'}
                    onChange={event => {
                        if (isNaN(Number(event.target.value))) {
                            return
                        }
                        setCurrentValue(Number(event.target.value))
                    }}
                    onBlur={(e) => {
                        let tempV = Number(e.target.value);
                        const remainder = tempV % step; // 计算余数

                        if (remainder !== 0) { // 如果不能被 step 整除
                            if (remainder >= step / 2) { // 如果余数大于等于 step 的一半，则向上取整
                                tempV = tempV - remainder + step;
                            } else { // 否则，向下取整
                                tempV = tempV - remainder;
                            }
                        }

                        if (tempV > max) {
                            tempV = max;
                        } else if (tempV < min) {
                            tempV = min;
                        }

                        setCurrentValue(tempV);
                        onChange&&onChange(tempV);
                    }}
                />
                {
                    unit !== '$' && <span
                        className={css.unit}
                        style={{
                        width: calInputWidth(unit || ''),
                        display: 'inline-block',
                        textAlign: 'left'
                    }}>{unit || ''}</span>
                }
            </div>

        </div>
        <div className={css.handler} onClick={() => handleOpera(true)}>
            <PlusOutlined/>
        </div>
    </div>)
}

export default NumberSelector