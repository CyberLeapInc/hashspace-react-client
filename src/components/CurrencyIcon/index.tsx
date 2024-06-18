import Image from "next/image";
import BTC from "../../../public/btc.svg";
import DOGE from "../../../public/doge.svg";
import LTC from "../../../public/ltc.svg";
import React from "react";

export const CurrencyIcon = ({currency, size = 20}: {currency: string, size?: number}) => {
    switch (currency) {
        case 'BTC':
            return <Image style={{marginRight: '5px'}} src={BTC} alt={'btc'} width={size}/>
        case 'DOGE':
            return <Image style={{marginRight: '5px'}} src={DOGE} alt={'doge'} width={size}/>
        case 'LTC':
            return <Image style={{marginRight: '5px'}} src={LTC} alt={'ltc'} width={size}/>
        default:
            return <Image style={{marginRight: '5px'}} src={BTC} alt={'btc'} width={size}/>
    }
}

export default CurrencyIcon;