'use client'
import css from './index.module.css'
import {Button, Checkbox, Divider, Input, Modal, Slider} from "antd";
import {cn} from "@/lib/utils";
import * as echarts from 'echarts';
import React, {useEffect, useRef, useState} from "react";
import {getProductDetail, GoodDetail, getPublicMarket} from "@/service/api";
import {getLocalDate} from '@/lib/clientUtils'
import {BuyProduct, BuyProductProp} from "@/components/BuyProduct";
import NumberSelector from "@/components/NumberSelector";
import big from "big.js";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import BTC from '../../../public/btc.svg'
import DOGE from '../../../public/doge.svg'
import LTC from '../../../public/ltc.svg'
import Image from "next/image";

const option = {
    xAxis: {
        type: 'category',
        data: ['投资回报率', '预期收益']
    },
    yAxis: {
        type: 'value',
        show: false
    },
    series: [
        {
            data: [120, 210],
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                valueAnimation: true
            },
            itemStyle: {
                normal: {
                    barBorderRadius: [6, 6, 0, 0]
                }
            }
        }
    ]
};

const DEFAULT_BUY_DAYS = 10;

const ProductDetail = () => {
    const ref = useRef();
    const [goodDetail, setGoodDetail] = useState<GoodDetail>()
    const [goodId, setGoodId] = useState('')
    const [targetPrice, setTargetPrice] = useState(0)
    const [targetDogePrice, setDogeTargetPrice] = useState(0)
    const [targetLtcPrice, setLtcTargetPrice] = useState(0)
    const [isShowBuyProduct, setIsShowBuyProduct] = useState(false)
    const [buyCount, setBuyCount] = useState(0)
    const [buyDays,setBuyDays] = useState(DEFAULT_BUY_DAYS)
    const [btnValueList, setBtnValueList] = useState([0])
    const [hashrateCost,setHashrateCost] = useState('0')
    const [electricityCost,setElectricityCost] = useState('0')
    const [totalCost, setTotalCost] = useState('0')
    const [checkboxValue, setCheckboxValue] = useState(false)
    const [buyProductKey, setBuyProductKey] = useState(0)

    const getImage = (currency: string) => {
        if (currency === 'BTC') return BTC;
        if (currency === 'DOGE') return DOGE;
        if (currency === 'LTC') return LTC;
    }

    const getPrice = (currency: string) => {
        if (currency === 'DOGE') return targetDogePrice
        if (currency === 'LTC') return targetLtcPrice
    }

    const onTargetPriceChange = (v: number, type = 'BTC') => {
        if (type === 'BTC') {
            setTargetPrice(v)
        }
        if (type === 'DOGE') {
            setDogeTargetPrice(v)
        }
        if (type === 'LTC') {
            setLtcTargetPrice(v)
        }

    }
    const handleBuyCountChange= (v: number) => {
        setBuyCount(v);
    }
    const handleBuyDaysChange = (v:number) => {
        setBuyDays(v);
    }
    const quickSetBuyCount = (v: number) => {
        setBuyCount(v)
    }
    const onCheckBoxChange = (e: CheckboxChangeEvent) => {
        setCheckboxValue(e.target.checked)
    }
    const toggleModal = (state: boolean) => {
        setBuyProductKey(buyProductKey +1)
        setTimeout(() => {
            setIsShowBuyProduct(state)
        })
    }
    const medianAndMax = (min: number, max: number, step: number) => {
        let values = [];
        for(let i = min; i <= max; i += step) {
            values.push(i);
        }

        let median;
        if (values.length % 2 === 0) { // 数组长度为偶数
            median = (values[values.length / 2 - 1]);
        } else { // 数组长度为奇数
            median = values[(values.length - 1) / 2];
        }

        return {
            max: values[values.length - 1],
            median: median
        };
    }

    useEffect(() => {
        let tempGoodId = '';
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            tempGoodId = searchParams.get('good_id') || ''
            setGoodId(tempGoodId)
        }
        getProductDetail(tempGoodId).then(res => {
            setGoodDetail(res.item)
            setBuyCount(Number(res.item.min_qty))
            const {
                median,max
            } = medianAndMax(Number(res.item.min_qty), Number(res.item.max_qty), Number(res.item.step_qty))
            setBtnValueList([Number(res.item.min_qty)||0, median, max])
        })
        // getPublicMarket().then(res => {
        //     console.log(res)
        // })
    }, [goodId]);

    useEffect(() => {
        let res = big(goodDetail?.price || '0').mul(big(buyCount))
        setHashrateCost(res.toString())
    }, [buyCount, goodDetail]);

    useEffect(() => {
        setElectricityCost(big(goodDetail?.daily_electricity || '0').mul(big(buyDays).mul(buyCount)).toString())
    }, [buyDays, goodDetail, buyCount]);

    useEffect(() => {
        setTotalCost(big(electricityCost).add(big(hashrateCost)).toString())
    }, [electricityCost, hashrateCost]);

    useEffect(() => {
        const myChart = echarts.init(ref.current)
        myChart.setOption(option)
        return () => {
            myChart.dispose();
        }
    }, [ref])


    return (
        <div className={css.productDetailBg}>
            <div className={css.contentWrapper}>
                <div className={css.productDetailWrapper}>
                    <div className={css.left}>
                        <div className={css.block}>
                            <div className={css.productTitle}>S19J Pro</div>
                            <div className={css.productInfo}>
                                <span>106T</span>
                                <Divider orientationMargin={40} style={{height: '25px',marginLeft: '40px', marginRight: '40px'}} type={'vertical'}/>
                                <span>19.5J/T</span>
                                <Divider orientationMargin={40} style={{height: '25px',marginLeft: '40px', marginRight: '40px'}} type={'vertical'}/>
                                <span>2068W</span>
                            </div>
                            <div style={{height: '220px',lineHeight: '220px', textAlign: 'center'}}>产品{goodId}对应的图片展示在这里</div>
                        </div>
                        <div style={{display: 'flex', gap: '20px',paddingTop: '20px'}}>
                            <div className={cn(css.chart, css.block)}>
                                {/*@ts-ignore*/}
                                <div style={{height: '170px', width: '100%'}} ref={ref}></div>
                                <div className={css.range}>
                                    <div className={css.text}>2</div>
                                    <div className={css.text}>2</div>
                                </div>
                            </div>
                            <div className={cn(css.block)}>
                                {goodDetail?.currency.length === 1 && (
                                    <div>
                                        <div className={css.tip}>左右滑动调整价格</div>
                                        <div className={css.coinImg}><Image src={BTC} alt={'btc'}/></div>
                                        <Slider min={0} max={200000} value={targetPrice} onChange={onTargetPriceChange}
                                                defaultValue={30} disabled={false}/>
                                        <div className={css.coinText}>预期BTC价格 <span
                                            style={{color: '#3c53ff', fontWeight: 'bold'}}>${targetPrice}</span></div>
                                    </div>
                                )}
                                {
                                    goodDetail?.currency.length === 2 && (
                                        <div>
                                            <div className={css.tip}>左右滑动调整价格</div>
                                            {goodDetail.currency.map(currency => {
                                                return (
                                                    <div key={currency}>
                                                    <div className={css.inlineSlider} >
                                                        <Image className={css.inlineCoinImg} src={getImage(currency)} alt={'btc'}/>
                                                        <Slider style={{flex: 1}} min={0} max={200000}
                                                                onChange={(v) => onTargetPriceChange(v, currency)}
                                                                defaultValue={30} disabled={false}/>
                                                    </div>
                                                    <div>
                                                        <div className={cn(css.coinText, css.coinTextLittle)} style={{textAlign: "left"}}>预期{currency}价格 <span
                                                            style={{
                                                                color: '#3c53ff',
                                                                fontWeight: 'bold'
                                                            }}>${getPrice(currency)}</span></div>
                                                    </div>
                                                </div>)
                                            })}
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={css.productName}>{goodDetail?.name}</div>
                        <div className={css.date}
                             suppressHydrationWarning>{getLocalDate(goodDetail?.start_at)} - {getLocalDate(goodDetail?.end_at)}</div>
                        <div className={css.card}>
                            <div className={css.row}>
                            <div className={css.label}>选择数量</div>
                                <div className={css.info}>
                                    <NumberSelector
                                        unit={goodDetail?.unit || ''}
                                        min={Number(goodDetail?.min_qty) || 0}
                                        max={Number(goodDetail?.max_qty)}
                                        step={Number(goodDetail?.step_qty) || 1}
                                        value={buyCount}
                                        onChange={handleBuyCountChange}
                                    ></NumberSelector>
                                </div>
                            </div>
                            <div className={css.row}>
                                <div className={css.label}></div>
                                <div className={css.info}>
                                    {
                                        btnValueList.map(item => {
                                            return (
                                                <Button onClick={() => quickSetBuyCount(item)} key={item} className={cn(css.button)} type={item === buyCount ? 'primary' : 'default'} size={"small"}>{item}{goodDetail?.unit || ''}</Button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className={css.row}>
                                <div className={css.label}>电费天数</div>
                                <div className={css.info}>
                                    <NumberSelector
                                        min={1}
                                        max={9999999}
                                        step={1}
                                        value={buyDays}
                                        unit={'天'}
                                        onChange={handleBuyDaysChange}
                                    />
                                </div>
                            </div>
                            <div className={css.row}>
                                <div className={css.label}>合约费用</div>
                                <div className={css.info}>${hashrateCost}</div>
                            </div>
                            <div className={css.row}>
                                <div className={css.label}>电费</div>
                                <div className={css.info}>${electricityCost}</div>
                            </div>
                            <Divider />
                            <div className={css.row}>
                                <div className={css.label}>合计费用</div>
                                <div className={cn(css.info, css.summary)}>${totalCost}</div>
                            </div>
                        </div>
                        <div style={{marginTop: '40px'}}>
                            <Checkbox onChange={onCheckBoxChange} className={css.checkbox}>我接受<a href={''}>《服务协议》</a>和<a href={''}>《隐私政策》</a><a href={''}>《免责声明》</a>。</Checkbox>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Button
                                onClick={() => toggleModal(true)}
                                disabled={!checkboxValue} size={"large"} shape={"round"} type={"primary"} style={{height: '52px', width: '265px'}}>立即购买</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={isShowBuyProduct} width={420} footer={''} onCancel={() => toggleModal(false)}>
                <BuyProduct finishPay={() => toggleModal(false)} key={buyProductKey} electricity_cost={electricityCost} electricity_day={buyDays} good_id={goodDetail?.good_id || ''} hashrate_cost={hashrateCost} hashrate_qty={buyCount} total_cost={totalCost} ></BuyProduct>
            </Modal>
        </div>
    )
}

export default ProductDetail