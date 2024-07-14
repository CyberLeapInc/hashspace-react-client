'use client'
import css from './index.module.css'
import {Button, Checkbox, Divider, Input, Modal, Slider} from "antd";
import {cn, getToFixedLength, roundUp} from "@/lib/utils";
import React, {useCallback, useEffect, useRef, useState,useContext} from "react";
import {getProductDetail, GoodDetail, buyProduct, fullRevenue, FullRevenueRequest} from "@/service/api";
import {getLocalDate} from '@/lib/clientUtils'
import {BuyProduct, BuyProductProp} from "@/components/BuyProduct";
import NumberSelector from "@/components/NumberSelector";
import big from "big.js";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {PriceSlider} from "@/components/PriceSlider";
import { ColumnConfig } from '@ant-design/plots';
import {useDebounceFn} from "ahooks";
import {MyContext} from "@/service/context";

import dynamic from 'next/dynamic'
import Link from "next/link";

const Column = dynamic(() => import('@ant-design/plots').then(({ Column }) => Column), {
    ssr: false
})

const data = [
    { type: 'hashrate_cost', value: 0 },
    { type: 'total_income', value: 0 },
];

const DemoColumn = ({data, isMobile}: {data: any[], isMobile: boolean}) => {
    const [dataList, setDataList] = useState(data || [])
    useEffect(() => {
        setDataList(data)
    }, [data]);
    const config: ColumnConfig = {
        xField: 'type',
        yField: 'value',
        marginBottom: 12,
        paddingBottom: 20,
        tooltip: false,
        interactions: [
            {
                type: "active-region",
                enable: false,
            },
        ],
        axis: {
            y: {
                label: false,
                tick: false,
            },
            x: {
                labelFontSize: 14,
                labelFill: 'rgba(51, 51, 51, 1)',
                tick: false,
                labelFormatter: (v: string) => {
                    if (v === 'hashrate_cost') {
                        return '云算力费用'
                    }
                    if (v === 'total_income') {
                        return '预期收益'
                    }
                },
                labelSpacing: 9,
            }
        },
        style: {
            fill: (data: any) => {
                if (data.type === 'hashrate_cost') {
                    return '#3C53FF';
                }
                return '#393535';
            },
            radiusTopLeft: isMobile ? 6 : 6,
            radiusTopRight: isMobile ? 6 : 6,
            maxWidth: 28,
        },
        hoverable: false,
        label: {
            text: ({type, value} : {type: string, value: string}) => {
                return `$${big(value).toFixed(2)}`
            },
            textBaseline: 'bottom',

        },
        legend: false,
        height: 166
    };
    return <Column {...config} width={204} data={dataList}/>;
};

const DEFAULT_BUY_DAYS = 10;

const ProductDetail = () => {
    'use client'
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
    const [dataList, setDataList] = useState(data || [])
    const [revenueData, setRevenueData] = useState({roi: '0', total_income: '0'})
    const [isShowSetDogeAddress, setIsShowSetDogeAddress] = useState(false)
    const {state, dispatch} = useContext(MyContext)

    const onTargetPriceChange = (v: number, currency = 'BTC') => {
        if (currency === 'BTC') {
            setTargetPrice(v)
        }
        if (currency === 'DOGE') {
            setDogeTargetPrice(v)
        }
        if (currency === 'LTC') {
            setLtcTargetPrice(v)
        }
    }
    const getPrice = useCallback((currency: string) => {
        if (currency === 'BTC') return targetPrice
        if (currency === 'DOGE') return targetDogePrice
        if (currency === 'LTC') return targetLtcPrice
    }, [targetPrice, targetDogePrice, targetLtcPrice])

    const getDifficulty = useCallback((currency: string) => {
        return state.chainList.find(chain => chain.currency === currency)?.difficulty
    }, [state.chainList])
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
    const deb = useDebounceFn(() => {
        const fullRevenueRequest: FullRevenueRequest = {
            price: {
                BTC: String(targetPrice),
                DOGE: String(targetDogePrice),
                LTC: String(targetLtcPrice),
            },
            good_id: goodId,
            hashrate_qty: String(buyCount),
            difficulty: getDifficulty(goodDetail?.mining_currency || 'BTC') || '0',
        }
        fullRevenue(fullRevenueRequest).then(res => {
            setDataList([
                { type: 'hashrate_cost', value: Number(hashrateCost) },
                { type: 'total_income', value: Number(res.total_income) },
            ])
            setRevenueData({
                roi: big(res.roi).times(100).toFixed(2).toString() + '%',
                total_income: '$' + big(res.total_income).toFixed(4).toString()
            })
        })
    }, {wait: 1000, leading: false, trailing: true})

    useEffect(()=> {
        deb.run()
    }, [targetPrice, targetDogePrice, targetLtcPrice, buyCount, buyDays, goodId])

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
    }, [goodId]);

    useEffect(() => {
        let res = big(goodDetail?.price || '0').mul(big(buyCount))
        setHashrateCost(res.toString())
    }, [buyCount, goodDetail]);

    useEffect(() => {
        setElectricityCost(roundUp(big(goodDetail?.daily_electricity || '0').mul(big(buyDays).mul(buyCount)).toNumber(), 2).toString())
    }, [buyDays, goodDetail, buyCount]);

    useEffect(() => {
        setTotalCost(big(electricityCost).add(big(hashrateCost)).toString())
    }, [electricityCost, hashrateCost]);


    const getBuyProductInfo = ({currency, network, trace_id}:{currency: string, network: string, trace_id: string}) => {
        return buyProduct({
            currency,
            electricity_cost: big(electricityCost).toString(),
            electricity_day: buyDays,
            good_id:goodDetail?.good_id || '',
            hashrate_cost: hashrateCost,
            hashrate_qty: buyCount.toString(),
            network,
            total_cost: totalCost,
            trace_id
        });
    }

    const goBuyCheck = () => {
        if (goodDetail?.mining_currency === 'LTC') {
            state.userInfo.address.find(item => item.currency === 'LTC')?.address ? toggleModal(true) : setIsShowSetDogeAddress(true)
        } else {
            toggleModal(true)
        }
    }



    return (
        <div className={cn(state.isMobile ? css.mobileProductDetailBg : css.productDetailBg)}>
            <div className={cn(state.isMobile ? css.mobileContentWrapper : css.contentWrapper)}>
                <div className={cn(state.isMobile ? css.mobileProductDetailWrapper:css.productDetailWrapper)}>
                    <div className={cn(state.isMobile ? css.mobileLeft : css.left)}>
                        <div className={css.block}>
                            <div className={css.productTitle}>S19J Pro</div>
                            <div className={css.productInfo}>
                                <span>106T</span>
                                <Divider orientationMargin={40} style={{height: '25px',marginLeft: '40px', marginRight: '40px'}} type={'vertical'}/>
                                <span>19.5J/T</span>
                                <Divider orientationMargin={40} style={{height: '25px',marginLeft: '40px', marginRight: '40px'}} type={'vertical'}/>
                                <span>2068W</span>
                            </div>
                            <div style={{height: '290px',lineHeight: '220px', textAlign: 'center'}}>产品{goodId}对应的图片展示在这里</div>
                        </div>
                        <div style={{display: 'flex', gap: '20px',paddingTop: '20px', flexDirection: state.isMobile ? 'column' : 'row'}}>
                            <div className={cn(css.chart, css.block)}>
                                <div className={css.roi} style={{paddingBottom: '20px'}}>
                                    <span>投资回报率: </span>
                                    <span style={{color: '#3C53FF', fontWeight: 'bold'}}>{revenueData.roi}</span>
                                </div>
                                {/*@ts-ignore*/}
                                <div style={{height: '170px', width: '100%'}}>
                                    <DemoColumn isMobile={state.isMobile} data={dataList}></DemoColumn>
                                </div>
                            </div>
                            <div className={cn(css.block)} style={{paddingLeft: state.isMobile ? '40px':'', paddingRight: state.isMobile ? '40px':''}}>
                                <PriceSlider isMobile={state.isMobile} currencyList={goodDetail?.currency || []} onTargetPriceChange={onTargetPriceChange} />
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <div className={cn(state.isMobile? css.mobileProductName : css.productName)}>{goodDetail?.name}</div>
                        <div className={cn(state.isMobile? css.mobileDate : css.date)}
                             suppressHydrationWarning>{getLocalDate(goodDetail?.start_at)} - {getLocalDate(goodDetail?.end_at)}</div>
                        <div className={cn(state.isMobile ? css.mobileCard : css.card)}>
                            <div className={css.row}>
                                <div className={css.label}>选择数量</div>
                                <div className={css.info}>
                                    <NumberSelector
                                        styles={{
                                            width: state.isMobile ? '100%' : '356px',
                                            maxWidth: '100%'
                                        }}
                                        unit={goodDetail?.unit || ''}
                                        min={Number(goodDetail?.min_qty) || 0}
                                        max={Number(goodDetail?.max_qty)}
                                        step={Number(goodDetail?.step_qty) || 1}
                                        value={buyCount}
                                        onChange={handleBuyCountChange}
                                    ></NumberSelector>
                                </div>
                            </div>
                            {/*{*/}
                            {/*    !state.isMobile && <div className={css.row}>*/}
                            {/*        <div className={css.label}></div>*/}
                            {/*        <div className={css.info}>*/}
                            {/*            {*/}
                            {/*                btnValueList.map(item => {*/}
                            {/*                    return (*/}
                            {/*                        <Button onClick={() => quickSetBuyCount(item)} key={item}*/}
                            {/*                                className={cn(css.button)}*/}
                            {/*                                type={item === buyCount ? 'primary' : 'default'}*/}
                            {/*                                size={"small"}>{item}{goodDetail?.unit || ''}</Button>*/}
                            {/*                    )*/}
                            {/*                })*/}
                            {/*            }*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*}*/}
                            <div className={css.row}>
                                <div className={css.label}>电费天数</div>
                                <div className={css.info}>
                                    <NumberSelector
                                        styles={{
                                            width: state.isMobile ? '100%' : '356px',
                                            maxWidth: '100%'
                                        }}
                                        min={10}
                                        max={9999999}
                                        step={1}
                                        value={buyDays}
                                        unit={'天'}
                                        onChange={handleBuyDaysChange}
                                    />
                                </div>
                            </div>
                            <div className={css.row2}>
                                <div className={css.label} style={{textAlign: state.isMobile ? 'right' : 'left'}}>合约费用</div>
                                <div className={cn(css.info,state.isMobile ? css.label2 : '')}>${roundUp(Number(hashrateCost),2).toFixed(getToFixedLength())}</div>
                            </div>
                            <div className={css.row2} style={{
                                paddingBottom: state.isMobile ? '' :'8px'
                            }}>
                                <div className={css.label} style={{textAlign: state.isMobile ? 'right' : 'left'}}>电费</div>
                                <div className={cn(css.info,state.isMobile ? css.label2 : '')}>${roundUp(Number(electricityCost),2).toFixed(getToFixedLength())}</div>
                            </div>
                            {
                                !state.isMobile && <Divider />
                            }
                            <div className={css.row2} style={{
                                paddingBottom: state.isMobile ? '' :'10px',
                                paddingTop: state.isMobile ? '' :'10px'
                            }}>
                                <div className={css.label} style={{textAlign: state.isMobile ? 'right' : 'left'}}>合计费用</div>
                                <div className={cn(css.info,css.summary,state.isMobile ? css.label2 : '')}>${roundUp(Number(totalCost),2).toFixed(getToFixedLength())}</div>
                            </div>
                        </div>
                        {
                            goodDetail?.mining_currency === 'LTC' && <div className={css.dogeInfo}>*根据矿池要求，请您下单前先设置DOGE收款地址。</div>
                        }
                        <div style={{
                            marginTop: state.isMobile ? '0' : goodDetail?.mining_currency === 'LTC' ? '10px' : '42px',
                            marginBottom: state.isMobile ? '0' : '22px'
                        }}>
                            <Checkbox onChange={onCheckBoxChange} className={css.checkbox}>我接受<a href={'/user_agreement_cn.html'} target="_blank">《服务协议》</a>和<a href={'/privacy_policy_cn.html'} target="_blank">《隐私政策》</a><a href={'/disclaimer_cn.html'} target="_blank">《免责声明》</a>。</Checkbox>
                        </div>
                        <div style={{marginTop: '20px'}}>
                            <Button
                                onClick={goBuyCheck}
                                disabled={!checkboxValue} size={"large"} shape={"round"} type={"primary"} style={{height: '52px', width: state.isMobile ? '100%' : '265px'}}>立即购买</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={isShowSetDogeAddress} width={420} footer={null} onCancel={() => setIsShowSetDogeAddress(false)}>
                <div>
                    <div style={{
                        fontWeight: 400,
                        fontSize: '14px',
                        textAlign: 'center',
                        marginTop: '70px',
                        color: '#333333'
                    }}>
                        根据矿池要求，请您下单前先设置DOGE收款地址
                    </div>
                    <Link href={'/walletAddress'}>
                        <Button type={"primary"} shape={"round"} size={"large"} block style={{
                            marginTop: '60px'
                        }}>设置
                        </Button>
                    </Link>
                </div>
            </Modal>
            <Modal open={isShowBuyProduct} width={420} footer={''} onCancel={() => toggleModal(false)}>
                <BuyProduct finishPay={() => toggleModal(false)} key={buyProductKey} total_cost={totalCost}
                            onBuy={getBuyProductInfo}></BuyProduct>
            </Modal>
        </div>
    )
}

export default ProductDetail