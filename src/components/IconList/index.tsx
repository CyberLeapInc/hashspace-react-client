import CurrencyIcon from "@/components/CurrencyIcon";
import css from './index.module.css'

export const IconList = ({list, size = 20}: {list: string[], size?: number}) => {
    return (
        <div style={{
            display: 'flex',
            marginRight: `${size/4}px`,
        }}>
            {list.map((item, index) => {
                return (
                    <div key={index} style={{marginLeft: `${(0 - 20*0.4)}px`, zIndex: list.length - index}} className={css.iconWrapper}>
                        <CurrencyIcon key={index} currency={item} size={size}/>
                    </div>
                )
            })}
        </div>
    )
}

export default IconList;