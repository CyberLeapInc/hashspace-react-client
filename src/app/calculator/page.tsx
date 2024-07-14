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

import './index.css'
import css from './index.module.css'
import {fullRevenue, FullRevenueResponse, getProductList, Good, GoodListItem, GoodWrapper} from "@/service/api";
import {MyContext} from "@/service/context";
import big from "big.js";
import {cn, formatThousands, getToFixedLength, parseHashrateByNumber} from "@/lib/utils";
import IconList from "@/components/IconList";

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
                return <Form.Item label={`预期${item}币价`} key={item} >
                    <Input addonAfter={<div>USDT</div>} type={'number'} value={getValue(item)} onChange={(e) => handleChange(item, e)}/>
                </Form.Item>
            })
        }
    </>
}

const CurrencyDifficulty = ({currency, onChange}: {currency: string; onChange: (data: {
    [key: string]: number | string
    }) => void}) => {
    const {state, dispatch} = useContext(MyContext);
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
        <Form.Item label="预期难度">
            <Input className={css.diffInput}
                   value={difficultyInner}
                   onChange={handleDifficulty}
            />
        </Form.Item>
        <div style={{
            display: 'flex',
            gap: '9px',
            marginLeft: '100px',
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
                        <span className={'intro-label'}>{currency}价格：</span>
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
                            <span className={'intro-label'}>BTC价格：</span>
                            <span className={'intro-value'}>${formatThousands(state?.chainList?.find((item) => {
                                return item.currency === 'BTC'
                            })?.last_usdt_price || '')}</span>
                        </div>
                        <div className={'intro-single'} style={{textAlign: 'center'}}>
                            <span className={'intro-label'}>挖矿难度：</span>
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
                            <span className={'intro-label'}>全网算力: </span>
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
        fullRevenue({
            price: currencyPrice,
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
                getFullRevenue()
            }
        })
    }
    const handleGoodItemChange = (goodId: string) => {
        currentGood?.list?.find(
            (item) => {
                if (item.good_id === goodId) {
                    setGoodId(goodId)
                    setGoodItem(item)
                }
            }
        )
        setTimeout(() => {
            getFullRevenue()
        }, 0)
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
    return <div style={{height: 'calc(100vh - 232px)',paddingTop: '25px'}}>
        <div className={'cal-card-big'}>
            <div className={'flex-wrap'}>
                <div className={'intro'}>
                    <div className={'login-hello'}>收益挖矿计算器</div>
                    <TitleBar currencyDifficulty={currencyDifficulty} currencyList={goodItem?.currency || []} currencyPrice={currencyPrice} />
                    <div className={'cal-card-list'}>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title2'}>
                                <Image src={calAllgain} alt={'总收入'}></Image>
                                总收入
                            </div>
                            {
                                goodItem?.currency.map((item) => {
                                    return <div className={'cal-card-count2'} key={item}>
                                        <span style={{
                                            wordWrap: 'break-word',
                                            overflowWrap: 'break-word',
                                            flexWrap: 'wrap',
                                        }}>{}</span>
                                        {formatThousands(big(fullRevenueData?.total_coin_income[item] || 0).toNumber().toFixed(getToFixedLength(item)))}
                                        <span  className={'small-text'}>{item}</span>
                                    </div>
                                })
                            }
                            <div className={'cal-card-info2'}>{
                                getTotalPrice(fullRevenueData.total_coin_income)
                            }</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title2'}>
                                <Image src={calAllPay} alt={'总支出'}></Image>
                                总支出
                            </div>
                            <div className={'cal-card-count2'}>${formatThousands(big(fullRevenueData?.total_cost || '0').toFixed(getToFixedLength()))}</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title2'}>
                                <Image src={calProfit} alt={'净利润'}></Image>
                                净利润
                            </div>
                            <div className={'cal-card-count2'}>${formatThousands(big(fullRevenueData?.net_income || '0').toFixed(getToFixedLength()))}</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title2'}>
                                <Image src={calDailyGain} alt={'每日收入'}></Image>
                                每日收入
                            </div>
                            {
                                fullRevenueData.daily_coin_income ? Object.keys(fullRevenueData.daily_coin_income).map((item) => {
                                    return <div className={'cal-card-count2'} key={item}>
                                        {formatThousands(big(fullRevenueData.daily_coin_income[item] || 0).toFixed(getToFixedLength(item)))}
                                        <span className={'small-text'}>{item}</span>
                                    </div>
                                }) : null
                            }
                            <div className={'cal-card-info2'}>{getTotalPrice(fullRevenueData.daily_coin_income)}</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title2'}>
                                <Image src={calPayBackDay} alt={'回本天数'}></Image>
                                回本天数
                            </div>
                            <div className={'cal-card-count2'}>{formatThousands(fullRevenueData.payback_day || 0, false) === '-1' ? '无法回本' : `${formatThousands(fullRevenueData.payback_day || 0, false)}天`}</div>
                        </div>
                        {
                            goodItem?.mining_currency === 'BTC' ? (
                                <div className={'cal-card'}>
                                    <div className={'cal-card-title2'}>
                                        <Image src={calPayBackMoney} alt={'回本币价'}></Image>
                                        回本币价
                                    </div>
                                    <div
                                        className={'cal-card-count2'}>${formatThousands(big(fullRevenueData?.payback_price || 0).toFixed(getToFixedLength()))}</div>
                                </div>
                            ):null
                        }
                        {
                            goodItem?.mining_currency === 'LTC' ? (
                                <div className={'cal-card'}>
                                    <div className={'cal-card-title2'}>
                                        <Image src={calPayBackMoney} alt={'回本币价'}></Image>
                                        总电费
                                    </div>
                                    <div
                                        className={'cal-card-count2'}>${formatThousands(big(fullRevenueData?.electricity_cost || 0).toFixed(getToFixedLength()))}</div>
                                </div>
                            ):null
                        }
                    </div>
                </div>
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
                        <Form.Item label="选择币种">
                            <Select size={"large"} value={selectedMineCurrency} onSelect={handleCurrencyChange}>
                                {mineCurrencyList.map((item) => {
                                    return <Select.Option value={item} key={item}>
                                        <CurrencySelectorContent currency={item} />
                                    </Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item label="选择套餐">
                            <Select size={"large"} value={goodId} onSelect={handleGoodItemChange}>
                                {
                                    goodItemList.map((item) => {
                                        return <Select.Option value={item.good_id} key={item.good_id}>
                                            <div className={css.selectOptionCus}>{item.name}</div>
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="算力数量">
                            <Input addonAfter={<div>{currentGood?.mining_currency === 'BTC' ? 'T' : 'M'}H/s</div>} type={'number'} defaultValue={buyCount} step={1} onChange={handleBuyCountChange}/>
                        </Form.Item>
                        <CurrencyListSelector onChange={handleCurrencyPriceChange} goodItem={goodItem}/>
                        {
                            goodItem?.mining_currency === 'BTC' ? <CurrencyDifficulty onChange={setCurrencyDifficulty} currency={goodItem.mining_currency || 'BTC'}/> : null
                        }
                        <Button onClick={getFullRevenue} type="primary" shape="round" size={'large'} block>
                            开始计算
                        </Button>
                    </Form>
                </div>
            </div>

        </div>
    </div>
}

export default Calculator;