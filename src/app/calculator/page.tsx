'use client'
import React, {useContext, useEffect, useState} from 'react';
import calAllgain from '../../../public/cal-allgain.png'
import calAllPay from '../../../public/cal-allpay.png'
import calDailyGain from '../../../public/cal-dailygain.png'
import calPayBackDay from '../../../public/cal-paybackday.png'
import calPayBackMoney from '../../../public/cal-money.png'
import calProfit from '../../../public/cal-profit.png'
import Image from "next/image";
import {Button, Form, Input, Select} from 'antd';
import {useTranslations} from "next-intl";

import './index.css'
import css from './index.module.css'
import {fullRevenue, FullRevenueResponse, getProductList, Good, GoodListItem, GoodWrapper} from "@/service/api";
import {MyContext} from "@/service/context";
import big from "big.js";
import {cn, formatThousands, getToFixedLength, parseHashrateByNumber} from "@/lib/utils";
import IconList from "@/components/IconList";
import {CustomInput} from "@/components/CustomInput";
import _ from 'lodash'
import {useDebounceEffect} from "ahooks";

interface CurrencyListSelectorProps {
    goodItem: GoodListItem | null;
    onChange: (data: {[key: string] : number | string }) => void
}
const CurrencyListSelector = ({
    goodItem, onChange
}:CurrencyListSelectorProps) => {
    const [good, setGood] = useState<GoodListItem | null>(null)
    const [currencyDict, setCurrencyDict] = useState<{[key: string]: number | string}>({
        'BTC': 0,
        'LTC': 0,
        'DOGE': 0
    })
    const {state, dispatch} = useContext(MyContext)
    const [inputMarginLeft, setInputMarginLeft] = useState<string>('55px')
    const t = useTranslations('calculator');

    useEffect(() => {
        if (state.isMobile) {
            setInputMarginLeft('38px');
        } else {
            setInputMarginLeft('55px');
        }
    }, [state]);

    const getValue = (currency: string) => {
        if (!good) {
            return 0
        }
        return currencyDict[currency]
    }
    const handleChange = (currency: string, e: any) => {
        setCurrencyDict((prev) => {
            return {
                ...prev,
                [currency]: e.target.value
            }
        })
    }

    useEffect(() => {
        onChange(currencyDict);
    }, [currencyDict]);

    useEffect(() => {
        setGood(goodItem)
        const tempCurrencyDict: Record<string, string> = {}
        goodItem?.currency.map((item: string) => {
            tempCurrencyDict[item] = state.chainList.find((chain) => chain.currency === item)?.calculator_init_price || '0'
        })
        setCurrencyDict(tempCurrencyDict)
    }, [goodItem])
    return <>
        {
            good?.currency.map((item)=> {
                return <Form.Item label={t('formLabels.expectedPrice', {currency: item})} key={item} >
                    <CustomInput inputMarginLeft={inputMarginLeft} onChange={(e) => handleChange(item, e)} unit={'USDT'} defaultValue={getValue(item)} type={'number'}/>
                </Form.Item>
            })
        }
    </>
}

const CurrencyDifficulty = ({currency, onChange}: {currency: string; onChange: (data: {
    [key: string]: number | string
    }) => void}) => {
    const {state, dispatch} = useContext(MyContext);
    const t = useTranslations('calculator');
    const [difficultySolid, setDifficultySolid] = useState<string>('')
    const [difficultyInner, setDifficultyInner] = useState<string>('')
    const [currentRange, setCurrentRange] = useState<number>(0)
    const rangeList = [-0.05, 0, 0.05]
    const handleDifficulty = (e: any) => {
        setDifficultyInner(e.target.value)
    }
    useEffect(() => {
        state?.chainList?.find((chain) => {
            if (chain.currency === currency) {
                console.log(chain.difficulty)
                setDifficultySolid(chain.difficulty)
                setDifficultyInner(chain.difficulty)
            }
        })
    }, [currency, state]);
    useEffect(() => {
        if (currentRange === 0) {
            setDifficultyInner(difficultySolid)
        }
        setDifficultyInner(big(difficultySolid || 0).times(big(1 + currentRange)).toFixed(0).toString())
    }, [currentRange, difficultySolid]);
    useEffect(() => {
        onChange({[currency]: difficultyInner})
    }, [difficultyInner]);
    return <div>
        <Form.Item label={t('formLabels.expectedDifficulty')}>
            <Input size={"large"} className={css.diffInput}
                   value={difficultyInner}
                   onChange={handleDifficulty}
            />
        </Form.Item>
        <div style={{
            display: 'flex',
            gap: '9px',
            marginLeft: state.isMobile ? '0' : '100px',
            marginTop: '-10px',
            marginBottom: '40px'
        }}>
            {
                rangeList.map((item) => {
                    return <Button onClick={() => setCurrentRange(item)} key={item} className={cn(css.rangeItem, currentRange === item && css.rangeItemSelected)} size={'small'}>{item * 100}%</Button>
                })
            }
        </div>
    </div>
}

const TitleBar = ({currencyPrice, currencyList, currencyDifficulty}: {currencyPrice: {[key: string]:string|number},currencyDifficulty :  {[key: string]:string|number}, currencyList: string[]}) => {
    const {state, dispatch} = useContext(MyContext)
    const [currencyListInner, setCurrencyListInner] = useState<string[]>([])
    const [currencyPriceInner, setCurrencyPriceInner] = useState<{[key: string]:string|number}>({})
    const [diffculity, setDiffculity] = useState<{[key: string]:string|number}>({
        'BTC': 0,
        'LTC': 0,
        'DOGE': 0
    })
    const [networkHashrate, setNetworkHashrate] = useState<string>('0')
    const t = useTranslations('calculator');

    useEffect(() => {
        if (!state) return
        const diff = state.chainList.find((chain) => chain.currency === 'BTC')?.difficulty || '0';
        const network_hashrate = state.chainList.find((chain) => chain.currency === 'BTC')?.network_hashrate || '0';
        setDiffculity(currencyDifficulty)
        setNetworkHashrate(network_hashrate)
        setCurrencyListInner(currencyList)
        setCurrencyPriceInner(currencyPrice)
    }, [currencyList, currencyPrice,currencyDifficulty, state]);
    return (
        <div className={'intro-title'}>
            {
                currencyListInner.length > 1 ? currencyListInner.map((currency) => {
                    return <div className={'intro-single'} style={{textAlign:'center'}} key={currency}>
                        <span className={'intro-label'}>{t('currencyPrice', {currency})}:</span>
                        <span className={'intro-value'}>${
                            Number(formatThousands(state?.chainList?.find((item) => {
                                return item.currency === currency
                            })?.last_usdt_price || '')).toFixed(getToFixedLength())
                        }</span>
                    </div>
                }) : null
            }
            {
                currencyListInner.length === 1 ?
                    <>
                        <div className={'intro-single'}>
                            <span className={'intro-label'}>{t('introLabels.btcPrice')}</span>
                            <span className={'intro-value'}>${formatThousands(state?.chainList?.find((item) => {
                                return item.currency === 'BTC'
                            })?.last_usdt_price || '')}</span>
                        </div>
                        <div className={'intro-single'} style={{textAlign: 'center', maxWidth: '125px'}}>
                            <span className={'intro-label'}>{t('introLabels.miningDifficulty')}:</span>
                            <span className={'intro-value'}>{state?.chainList?.find((item) => {
                                return item.currency === 'BTC'
                            })?.difficulty && (parseHashrateByNumber(
                                Number(state?.chainList?.find((item) => {
                                    return item.currency === 'BTC'
                                })?.difficulty)
                            ).hashrate + parseHashrateByNumber(
                                Number(state?.chainList?.find((item) => {
                                    return item.currency === 'BTC'
                                })?.difficulty)
                            ).unit)}</span>
                        </div>
                        <div className={'intro-single'} style={{textAlign: 'right'}}>
                            <span className={'intro-label'}>{t('introLabels.networkHashrate')}: </span>
                            <span className={'intro-value'}>{parseHashrateByNumber(Number(networkHashrate)).hashrate + ' ' + parseHashrateByNumber(Number(networkHashrate)).unit}H/s</span>
                        </div>
                    </> : null
            }

        </div>
    )
}

const CurrencySelectorContent =  ({currency} : {currency: string}) => {
    const [currencyList, setCurrencyList] = useState<string[]>([])
    useEffect(() => {
        setCurrencyList(currency === 'BTC' ? [currency] : ['DOGE', 'LTC'])
    }, [currency]);
    return <div className={css.selectOptionCus}> <IconList list={currencyList} />{currencyList.join('&')}</div>
}

const Calculator = () => {
    const t = useTranslations('calculator');
    const {state, dispatch} = useContext(MyContext)
    const [mineCurrencyList, setMineCurrencyList] = useState(['BTC', 'LTC'])
    const [selectedMineCurrency, setSelectedMineCurrency] = useState<string>('BTC')
    const [goodsList, setGoodsList] = useState<GoodWrapper[]>([])
    const [currentGood, setCurrentGood] = useState<GoodWrapper | null>(null)
    const [goodItem, setGoodItem] = useState<GoodListItem | null>(null)
    const [goodItemList, setGoodItemList] = useState<GoodListItem[]>([])
    const [goodId, setGoodId] = useState<string>('')
    const [buyCount, setBuyCount] = useState<number>(100)
    const [currencyPrice, setCurrencyPrice] = useState<{ [key: string]: number | string }>({
        'BTC': 0,
        'LTC': 0,
        'DOGE': 0
    })
    const [currencyDifficulty, setCurrencyDifficulty] = useState<{[key: string]: number | string}>({
        'BTC': 0,
        'LTC': 0,
        'DOGE': 0
    })
    const [fullRevenueData, setFullRevenueData] = useState<FullRevenueResponse>({
        currency: "",
        daily_coin_income: {
            BTC: '',
            LTC: ''
        },
        daily_income: "",
        hashrate_cost: "",
        net_income: "",
        payback_day: 0,
        payback_price: "",
        roi: "",
        total_coin_income: {
            BTC: '',
            DOGE: '',
            LTC: ''
        },
        total_cost: "",
        total_income: ""
    })
    const getFullRevenue = () => {
        const sum = Number(currencyPrice['BTC']) + Number(currencyPrice['LTC']) + Number(currencyPrice['DOGE'])
        if (sum === 0 || _.isEmpty(currencyPrice)) return;
        fullRevenue({
            price: {
                BTC: '0',
                LTC: '0',
                DOGE: '0',
                ...currencyPrice
            },
            difficulty: currentGood?.mining_currency === 'BTC' ? String(currencyDifficulty['BTC']) : '',
            good_id: goodId,
            hashrate_qty: String(buyCount)
        }).then(res => {
            setFullRevenueData(res)
        })
    }
    useEffect(() => {
        getProductList().then(res => {
            const tempMineCurrencyList = res.goods.map((item) => {
                return item.mining_currency
            })
            setMineCurrencyList(tempMineCurrencyList);
            setSelectedMineCurrency(tempMineCurrencyList[0])
            setGoodsList(res.goods);
            setCurrentGood(res.goods[0]);
            setGoodItemList(res.goods[0].list || [])
            setGoodItem(res.goods && res.goods[0] && res.goods[0].list && res.goods[0].list[0] ? res.goods[0].list[0] : null)
            // @ts-ignore
            setGoodId(res.goods[0].list[0].good_id)

        })
    }, [setMineCurrencyList, setSelectedMineCurrency, setGoodsList, setCurrentGood, setGoodItemList, setGoodItem, setGoodId])

    const handleCurrencyChange = (mineCurrency: string) => {
        console.log(mineCurrency)
        goodsList.find((item) => {
            if (item.mining_currency === mineCurrency) {
                setCurrentGood(item)
                setSelectedMineCurrency(mineCurrency)
                setGoodItemList(item.list || [])
                setGoodItem(item.list && item.list[0] ? item.list[0] : null)
                // @ts-ignore
                setGoodId(item.list && item.list[0] ? item.list[0].good_id : '')
            }
        })
    }
    useDebounceEffect(() => {
        getFullRevenue()
    }, [selectedMineCurrency, goodId, goodItem,currencyPrice], {
        wait: 50,
        leading: false,
        trailing: true,
    })
    const handleGoodItemChange = (goodId: string) => {
        currentGood?.list?.find(
            (item) => {
                if (item.good_id === goodId) {
                    setGoodId(goodId)
                    setGoodItem(item)
                }
            }
        )
    }

    const handleBuyCountChange = (e: any) => {
        setBuyCount(e.target.value)
    }
    const onFormLayoutChange = (v: string) => {
        console.log(v)
    }
    const handleCurrencyPriceChange = (data: {[key: string] : number | string }) => {
        setCurrencyPrice(data)
    }
    const [inputMarginLeft, setInputMarginLeft] = useState<string>('55px')

    useEffect(() => {
        if (state.isMobile) {
            setInputMarginLeft('38px');
        } else {
            setInputMarginLeft('55px');
        }
    }, [state]);
    const getTotalPrice = (data: {
        [key: string]: string | number
    }) => {
        if (!data) {
            return '0'
        }
        let res = big(0)
        Object.keys(data).map((item: string) => {
            const price = state.chainList.find((chain) => chain.currency === item)?.calculator_init_price || '0';
            res = big(data[item] || '0').times(price).add(res);
        })
        return '≈$' + formatThousands(res.toFixed(getToFixedLength()));
    }
    return <div style={{height: !state.isMobile ?  'calc(100vh - 232px)' : '',paddingTop: '25px'}}>
        <div className={state.isMobile ? css.calCardBigMobile : css.calCardBig}>
            <div className={'flex-wrap'}>
                <div className={'intro'}>
                    <div className={state.isMobile ? css.titleMobile : css.title}>{t('title')}</div>
                    {!state.isMobile && <TitleBar currencyDifficulty={currencyDifficulty} currencyList={goodItem?.currency || []} currencyPrice={currencyPrice} />}
                    <div className={cn(state.isMobile ? css.calCardListMobile : css.calCardList)}>
                        <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                            <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calAllgain} alt={t('cardTitles.totalIncome')}></Image>
                                {t('cardTitles.totalIncome')}
                            </div>
                            {
                                goodItem?.currency.map((item) => {
                                    return <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount} key={item}>
                                        {formatThousands(big(fullRevenueData?.total_coin_income[item] || 0).toNumber().toFixed(getToFixedLength(item)))}
                                        <span  className={state.isMobile ? css.smallTextMobile : css.smallText}>{item}</span>
                                    </div>
                                })
                            }
                            <div className={state.isMobile ? css.calCardInfoMobile : css.calCardInfo}>
                                ≈${fullRevenueData.total_income ? formatThousands(big(fullRevenueData.total_income || '0').toFixed(getToFixedLength())) : '0'}
                            </div>
                        </div>
                        <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                            <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calAllPay} alt={t('cardTitles.totalExpenditure')}></Image>
                                {t('cardTitles.totalExpenditure')}
                            </div>
                            <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount} >${formatThousands(big(fullRevenueData?.total_cost || '0').toFixed(getToFixedLength()))}</div>
                        </div>
                        <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                            <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calProfit} alt={t('cardTitles.netProfit')}></Image>
                                {t('cardTitles.netProfit')}
                            </div>
                            <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount} >${formatThousands(big(fullRevenueData?.net_income || '0').toFixed(getToFixedLength()))}</div>
                        </div>
                        <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                            <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calDailyGain} alt={t('cardTitles.dailyIncome')}></Image>
                                {t('cardTitles.dailyIncome')}
                            </div>
                            {
                                fullRevenueData.daily_coin_income ? Object.keys(fullRevenueData.daily_coin_income).map((item) => {
                                    return (
                                        <div key={item}  className={state.isMobile ? css.calCardCountMobile : css.calCardCount}>
                                            {formatThousands(big(fullRevenueData.daily_coin_income[item] || 0).toFixed(getToFixedLength(item)))}
                                            <span className={state.isMobile ? css.smallTextMobile : css.smallText}>{item}</span>
                                        </div>
                                    )
                                }) : null
                            }
                            <div className={state.isMobile ? css.calCardInfoMobile : css.calCardInfo}>
                                ≈${formatThousands(big(fullRevenueData.daily_income || '0').toFixed(getToFixedLength()))}
                            </div>
                        </div>
                        <div className={cn(state.isMobile ? css.calCardMobile : css.calCard)}>
                            <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                            <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calPayBackDay} alt={t('cardTitles.paybackDay')}></Image>
                                {t('cardTitles.paybackDay')}
                            </div>
                            <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount} >{formatThousands(fullRevenueData.payback_day || 0, false) === '-1' ? t('unableToPayback') : `${formatThousands(fullRevenueData.payback_day || 0, false)}${t('paybackInDays')}`}</div>
                        </div>
                        {
                            goodItem?.mining_currency === 'BTC' ? (
                                <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                                    <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                        <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calPayBackMoney} alt={t('cardTitles.paybackPrice')}></Image>
                                        {t('cardTitles.paybackPrice')}
                                    </div>
                                    <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount} >${formatThousands(big(fullRevenueData?.payback_price || 0).toFixed(getToFixedLength()))}</div>
                                </div>
                            ):null
                        }
                        {
                            goodItem?.mining_currency === 'LTC' ? (
                                <div className={cn(state.isMobile? css.calCardMobile : css.calCard)}>
                                    <div className={state.isMobile ? css.itemTitleMobile : css.itemTitle}>
                                        <Image className={state.isMobile ? css.calIconMobile : css.calIcon} src={calPayBackMoney} alt={t('cardTitles.totalElectricityFee')}></Image>
                                        {t('cardTitles.totalElectricityFee')}
                                    </div>
                                    <div className={state.isMobile ? css.calCardCountMobile : css.calCardCount}>${formatThousands(big(fullRevenueData?.electricity_cost || 0).toFixed(getToFixedLength()))}</div>
                                </div>
                            ):null
                        }
                    </div>
                </div>
                {
                    !state.isMobile && (
                        <>
                            <div className={'divider'}></div>
                            <div className={'form'}>
                                <Form
                                    labelCol={{span: 6}}
                                    wrapperCol={{span: 18}}
                                    layout="horizontal"
                                    initialValues={{size: 'large'}}
                                    onValuesChange={onFormLayoutChange}
                                    size={'large'}
                                    style={{maxWidth: 1200, marginTop: '72px'}}
                                >
                                    <Form.Item label={t('formLabels.selectCurrency')}>
                                        <Select size={"large"} value={selectedMineCurrency} onSelect={handleCurrencyChange}>
                                            {mineCurrencyList.map((item) => {
                                                return <Select.Option value={item} key={item}>
                                                    <CurrencySelectorContent currency={item}/>
                                                </Select.Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label={t('formLabels.selectPackage')}>
                                        <Select size={"large"} value={goodId} onSelect={handleGoodItemChange}>
                                            {
                                                goodItemList.map((item) => {
                                                    return <Select.Option value={item.good_id} key={item.good_id}>
                                                        <div className={css.selectOptionCus}>
                                                            <div>
                                                                <div>{item.name}</div>
                                                            </div>
                                                        </div>
                                                    </Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label={t('formLabels.hashrateQuantity')}>
                                        <CustomInput inputMarginLeft={inputMarginLeft} onChange={handleBuyCountChange}
                                                     defaultValue={buyCount} type={'number'}
                                                     unit={currentGood?.mining_currency === 'BTC' ? 'TH/s' : 'MH/s'}
                                                     step={1} min={0} max={999999999999999}/>
                                        {/*<Input addonAfter={<div>{currentGood?.mining_currency === 'BTC' ? 'T' : 'M'}H/s</div>} type={'number'} defaultValue={buyCount} step={1} onChange={handleBuyCountChange}/>*/}
                                    </Form.Item>
                                    <CurrencyListSelector onChange={handleCurrencyPriceChange} goodItem={goodItem}/>
                                    {
                                        goodItem?.mining_currency === 'BTC' ?
                                            <CurrencyDifficulty onChange={setCurrencyDifficulty}
                                                                currency={goodItem.mining_currency || 'BTC'}/> : null
                                    }
                                    <Button onClick={getFullRevenue} type="primary" shape="round" size={'large'} block>
                                        {t('startCalculation')}
                                    </Button>
                                </Form>
                            </div>
                        </>
                    )
                }

            </div>

        </div>
        {
            state.isMobile && (
                <div className={state.isMobile ? css.calCardBigMobile : css.calCardBig} style={{marginBottom: '40px'}}>
                    <div className={'form'}>
                        <Form
                            labelCol={{span: 6}}
                            wrapperCol={{span: 18}}
                            layout="horizontal"
                            initialValues={{size: 'large'}}
                            onValuesChange={onFormLayoutChange}
                            size={"small"}
                        >
                            <Form.Item label={t('formLabels.selectCurrency')}>
                                <Select size={"large"} value={selectedMineCurrency} onSelect={handleCurrencyChange}>
                                    {mineCurrencyList.map((item) => {
                                        return <Select.Option value={item} key={item}>
                                            <CurrencySelectorContent currency={item}/>
                                        </Select.Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item label={t('formLabels.selectPackage')}>
                                <Select size={"large"} value={goodId} onSelect={handleGoodItemChange}>
                                    {
                                        goodItemList.map((item) => {
                                            return <Select.Option value={item.good_id} key={item.good_id}>
                                                <div className={css.selectOptionCus}>
                                                    <div>
                                                        <div>{item.name}</div>
                                                    </div>
                                                </div>
                                            </Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item label={t('formLabels.hashrateQuantity')}>
                                <CustomInput inputMarginLeft={inputMarginLeft} onChange={handleBuyCountChange}
                                             defaultValue={buyCount} type={'number'}
                                             unit={currentGood?.mining_currency === 'BTC' ? 'TH/s' : 'MH/s'}
                                             step={1} min={0} max={999999999999999}/>
                                {/*<Input addonAfter={<div>{currentGood?.mining_currency === 'BTC' ? 'T' : 'M'}H/s</div>} type={'number'} defaultValue={buyCount} step={1} onChange={handleBuyCountChange}/>*/}
                            </Form.Item>
                            <CurrencyListSelector onChange={handleCurrencyPriceChange} goodItem={goodItem}/>
                            {
                                goodItem?.mining_currency === 'BTC' ?
                                    <CurrencyDifficulty onChange={setCurrencyDifficulty}
                                                        currency={goodItem.mining_currency || 'BTC'}/> : null
                            }
                            <Button onClick={getFullRevenue} type="primary" shape="round" size={'large'} block>
                                {t('startCalculation')}
                            </Button>
                        </Form>
                    </div>
                </div>
            )
        }
    </div>
}

export default Calculator;