import Image from "next/image";
import BTC from "../../../public/btc.svg";
import DOGE from "../../../public/doge.svg";
import LTC from "../../../public/ltc.svg";
import React from "react";

export const CurrencyIcon = ({currency, size = 20}: {currency: string, size?: number}) => {
    switch (currency) {
        case 'BTC':
            return <Image  src={BTC} alt={'btc'} width={size} style={{
                minWidth: `${size}px`,
                maxWidth: `${size}px`,
            }}/>
        case 'DOGE':
            return <Image  src={DOGE} alt={'doge'} width={size} style={{
                minWidth: `${size}px`,
                maxWidth: `${size}px`,
            }}/>
        case 'LTC':
            return <Image  src={LTC} alt={'ltc'} width={size} style={{
                minWidth: `${size}px`,
                maxWidth: `${size}px`,
            }}/>
        default:
            return <Image  src={BTC} alt={'btc'} width={size} style={{
                minWidth: `${size}px`,
                maxWidth: `${size}px`,
            }}/>
    }
}

export default CurrencyIcon;