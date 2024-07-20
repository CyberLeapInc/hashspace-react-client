import Slider from "antd/es/slider";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import css from './index.module.css'
import BTC from "../../../public/btc.svg";
import DOGE from "../../../public/doge.svg";
import LTC from "../../../public/ltc.svg";
import {getChainList, Chain} from "@/service/api";
import {useMount} from "ahooks";

import {formatThousands, getToFixedLength} from "../../lib/utils";
import Big from "big.js";
import {useTranslations} from 'next-intl';

type currency = 'BTC' | 'DOGE' | 'LTC'
type currencyList = currency[]

interface PriceSliderProps {
    currencyList: currencyList
    onTargetPriceChange: (v: number, currency: currency) => void
    isMobile?: boolean
}

export const PriceSlider = ({currencyList, onTargetPriceChange, isMobile = false}:PriceSliderProps) => {
    const t = useTranslations('priceSlider');
    const [targetBTCPrice, setBTCTargetPrice] = useState(0)
    const [targetDogePrice, setDogeTargetPrice] = useState(0)
    const [targetLtcPrice, setLtcTargetPrice] = useState(0)
    const [chainList, setChainList] = useState<Chain[]>([])

    useMount(() => {
        getChainList().then((res) => {
            const chainList = res.list
            setChainList(chainList)
            chainList.map(chain => {
                if (chain.currency === 'BTC') {
                    setBTCTargetPrice(Number(chain.calculator_init_price))
                    onTargetPriceChange(Number(chain.calculator_init_price), 'BTC')
                }
                if (chain.currency === 'DOGE') {
                    setDogeTargetPrice(Number(chain.calculator_init_price))
                    onTargetPriceChange(Number(chain.calculator_init_price), 'DOGE')
                }
                if (chain.currency === 'LTC') {
                    setLtcTargetPrice(Number(chain.calculator_init_price))
                    onTargetPriceChange(Number(chain.calculator_init_price), 'LTC')
                }

            })
        })
    })

    const getChain = (currency: currency) => {
        return chainList.find(chain => chain.currency === currency);
    }

    const getInitPrice = (currency: currency) => {
        const chain = getChain(currency)
        if (chain) {
            return Number(chain.calculator_init_price)
        }
        return 0
    }

    const getMaxPrice = (currency: currency) => {
        const chain = getChain(currency)
        if (chain) {
            return Number(chain.calculator_max_price)
        }
        return 0
    }

    const getMinPrice = (currency: currency) => {
        const chain = getChain(currency)
        if (chain) {
            return Number(chain.calculator_min_price)
        }
        return 0
    }

    const getStep = (currency: currency) => {
        const chain = getChain(currency)
        if (chain) {
            return Number(chain.calculator_price_step)
        }
        return 1
    }

    const getPrice = (currency: currency) => {
        if (currency === 'DOGE') return Number(Big(targetDogePrice).toFixed(getToFixedLength()))
        if (currency === 'LTC') return Number(Big(targetLtcPrice).toFixed(getToFixedLength()))
        if (currency === 'BTC') return Number(Big(targetBTCPrice).toFixed(getToFixedLength()))
        return 0
    }

    const getImage = (currency: currency) => {
        if (currency === 'BTC') return BTC;
        if (currency === 'DOGE') return DOGE;
        if (currency === 'LTC') return LTC;
    }

    const handlePriceChange = (v: number, currency: currency) => {
        if (currency === 'DOGE') {
            setDogeTargetPrice(v)
        }
        if (currency === 'LTC') {
            setLtcTargetPrice(v)
        }
        if (currency === 'BTC') {
            setBTCTargetPrice(v)
        }
        onTargetPriceChange(v, currency);
    }

    if (currencyList.length === 1) {
        const currency = currencyList[0];
        return (
            <div>
                <div className={css.tip}>{t('slideToAdjustPrice')}</div>
                <div className={css.coinImg} style={{
                    marginTop: '29px',
                    marginBottom: '19px'
                }}>
                    <Image src={getImage(currency)} alt={currency}/>
                </div>
                <Slider min={getMinPrice(currency)} max={getMaxPrice(currency)}
                        value={getPrice(currency)} onChange={(v) => handlePriceChange(v, currency)}
                        step={getStep(currency)} disabled={false}
                        tooltip={{
                            formatter: null,
                            open: false
                        }}
                />
                <div className={css.coinText} style={{
                    marginTop: '32px'
                }}>{t('expectedPrice')}{t('currencyPrice')} <span
                    style={{color: '#3c53ff', fontWeight: 'bold'}}>${  formatThousands(getPrice(currency))}</span></div>
            </div>
        )
    } else {
        return (
            <div>
                <div className={css.tip}>{t('slideToAdjustPrice')}</div>
                {currencyList.map((currency,index) => {
                    return (
                        <div style={{padding: index === 0 ? '16px 0 0' : '28px 0 0'}} key={currency}>
                            <div className={css.inlineSlider}>
                                <Image className={css.inlineCoinImg} src={getImage(currency)} alt={currency}/>
                                <Slider style={{flex: 1}}
                                        tooltip={{
                                            formatter: null,
                                            open: false
                                        }}
                                        min={getMinPrice(currency)} max={getMaxPrice(currency)}
                                        value={getPrice(currency)} step={getStep(currency)}
                                        onChange={(v) => handlePriceChange(v, currency)}
                                        disabled={false}/>
                            </div>
                            <div>
                                <div className={css.coinText} style={{textAlign: "left"}}>{t('expectedPrice')}{t('currencyPrice')} <span
                                    style={{
                                        color: '#3c53ff',
                                        fontWeight: 'bold'
                                    }}>${ formatThousands(getPrice(currency)) }</span></div>
                            </div>
                        </div>)
                })}
            </div>
        )
    }
}

export default PriceSlider;
