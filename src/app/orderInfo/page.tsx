'use client'
import React, {memo, useContext, useEffect, useState} from 'react';
import Image, {StaticImageData} from "next/image";
import calAllgain from '../../../public/cal-allgain.png'
import calAllPay from '../../../public/cal-allpay.png'
import calDailyGain from '../../../public/cal-dailygain.png'
import calPayBackDay from '../../../public/cal-paybackday.png'
import calPayBackMoney from '../../../public/cal-paybackmoney.png'
import calProfit from '../../../public/cal-profit.png'
import {
    getOrderInfo,
    getPaymentList,
    HashrateHistoryItem,
    Income,
    OrderDetailResponse,
    PaymentItem
} from "@/service/api";
import {Popover, TableProps} from 'antd';
import {Button, Table} from 'antd';
import dynamic from 'next/dynamic';
import './index.css'
import css from './index.module.css'
import {MyContext} from "@/service/context";
import big from "big.js";
import CurrencyIcon from "@/components/CurrencyIcon";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {formatThousands, getToFixedLength, parseHashrateByNumber} from "@/lib/utils";
import Clipboard from "@/components/Clipboard";
import moment from "moment";

const Area = dynamic(() => import('@ant-design/plots').then(({ Area }) => Area), {
    ssr: false
})


interface IncomeItemProps {
    list: Income[]
}
const IncomeItem = ({list}:IncomeItemProps) => {
    return <div>
        {
            list?.map((item, index) => (
                <div key={index} className={css.incomeItem}>
                    <CurrencyIcon currency={item.currency} />
                    <div style={{marginLeft: '4px', marginRight: '4px'}}>{formatThousands(Number(item.amount).toFixed(getToFixedLength(item.currency)))}</div>
                    <div> {item.currency}</div>
                </div>
            ))
        }
    </div>
}
const paidContent = (item: Income) => {
    return <div style={{display: 'flex', justifyContent: 'center', lineHeight: '42px', backgroundColor: '#F7F7F7', padding: '0 8px', borderRadius: '7px'}}><span>TXID:</span> <Clipboard maxTextWidth={'150px'} str={item.payment_link_source} linkUrl={item.payment_link} /></div>

}
const IncomeStatus = ({list}:IncomeItemProps) => {
    return <div>
        {
            list?.map((item, index) => (
                <div key={item.payment_link_source + index}>
                    {item.status === 1 ?
                        <Popover key={item.payment_link_source} zIndex={999} content={() => paidContent(item)}>
                            <div key={index} className={css.incomeItem}>
                                <div
                                    style={{color: item.status === 1 ? '#16C984' : '#EA2A2A'}}>{item.status === 1 ? '已支付' : '待支付'}</div>
                            </div>
                        </Popover>
                        : <div key={index} className={css.incomeItem}>
                            <div
                                style={{color: item.status === 1 ? '#16C984' : '#EA2A2A'}}>{item.status === 1 ? '已支付' : '待支付'}</div>
                        </div>
                    }
                </div>
            ))
        }
    </div>
}

const columns: TableProps<PaymentItem>['columns'] = [
    {title: '日期', dataIndex: 'created_at', render: (v) => moment(v * 1000).format('MM/DD/YYYY'), width: 200},
    {title: '理论算力', dataIndex: 'theory_hashrate', render: (v) => formatThousands(parseHashrateByNumber(v, 2).hashrate) + ' '+ parseHashrateByNumber(v, 0).unit + 'H/s' },
    { title: '实际算力', dataIndex: 'real_hashrate', render: (v) =>  formatThousands(parseHashrateByNumber(v, 2).hashrate)  + ' '+ parseHashrateByNumber(v, 0).unit + 'H/s' },
    { title: '算力达标率', dataIndex: 'compliance_rate', render: (v) => `${big(v).times(100).toFixed(2).toString()}%`},
    { title: '收益', dataIndex: 'income', render: (v) => <IncomeItem list={v}/> },
    { title: '状态', dataIndex: 'status', render: (v, record) => <IncomeStatus list={record.income || []} /> },
];

interface CardData {
    image: StaticImageData;
    alt: string;
    title: string;
    showKey: keyof OrderDetailResponse;
}

const cardData : CardData[] = [
    { image: calAllgain, alt: '总收入', title: '实时交付算力', showKey: 'realtime_hashrate'},
    { image: calAllPay, alt: '总支出', title: '昨日交付算力', showKey: 'yesterday_hashrate'},
    { image: calProfit, alt: '净利润', title: '昨日电费', showKey: 'yesterday_electricity_cost'},
    { image: calDailyGain, alt: '每日收入', title: '昨日收益', showKey: 'yesterday_income'},
    { image: calPayBackDay, alt: '回本天数', title: '总收益', showKey: 'total_income' },
    { image: calPayBackMoney, alt: '回本币价', title: '今日已挖预估', showKey: 'today_estimate_income' },
];

interface CardProps {
    image: StaticImageData;
    alt: string;
    title: string;
    showKey: keyof OrderDetailResponse,
    rawData: OrderDetailResponse | null;
}
const Card = ({ image, alt, title, showKey, rawData}:CardProps) => {
    const {state, dispatch} = useContext(MyContext)
    if (!rawData) return <></>
    const getShowKey = (key: keyof OrderDetailResponse): string => {
        return rawData[key] as string || '0'
    }
    const getMoney = (currency: string, count: number|string) => {
        if (!state.chainList) return '0';
        const priceNow = state.chainList.find((item) => item.currency === currency)?.last_usdt_price
        return big(count).times(big(priceNow || 0)).toFixed(getToFixedLength());
    }
    const getSummaryMoney = (key: keyof OrderDetailResponse): string => {
        let list: string[] = []
        rawData.coin_income.forEach(item => {
            list.push(getMoney(item.currency, item[key]))
        })
        return list.length ? list.reduce((a, b) => big(a).plus(b).toFixed(getToFixedLength())) : '0'
    }
    const getInfo = (key: keyof OrderDetailResponse) => {
        return <div>
            {
                rawData.coin_income?.map((item) => {
                    return <div key={item.currency}>{formatThousands(big(item[key]).toFixed(getToFixedLength(item.currency)))} <span className={css.unit}>{item.currency}</span> </div>
                })
            }
            <div className={css.money}>
                ≈ ${getSummaryMoney(key)}
            </div>
        </div>
    }
    const getUnit = (key: keyof OrderDetailResponse): string => {
        if (/hashrate/.test(key)) {
            return 'H/s'
        }
        if (/income/.test(key)) {
            return rawData.currency
        }
        if (/electricity_cost/.test(key)) {
            return ''
        }
        return ''
    }
    return (
        (
            <div className={state.isMobile ? css.mobileCalCard : css.calCard}>
                <div className={css.calCardTitle} style={{fontSize: state.isMobile ? '12px' : '14px'}}>
                    <Image className={css.image} src={image} alt={alt}></Image>
                    {title}
                </div>
                <div className={css.calCardCount}  style={{fontSize: state.isMobile ? '20px' : '16px'}}>
                    {
                        /income/.test(showKey) && getInfo(showKey)
                    }
                    {
                        !/income/.test(showKey) && <>

                            {!getUnit(showKey) && "$"}{formatThousands(Number(parseHashrateByNumber(Number(getShowKey(showKey))).hashrate).toFixed(getToFixedLength()))}
                            <span className={css.unit}  style={{fontSize: state.isMobile ? '12px' : '10px'}}>{parseHashrateByNumber(Number(getShowKey(showKey))).unit}{getUnit(showKey)}</span>
                        </>
                    }

                </div>
                {/*<div className={css.calCardInfo}>{getInfo(showKey)}</div>*/}
            </div>
        )
    )
};


const DemoArea = ({dataList, isMobile, unit}: {
    dataList: HashrateHistoryItem[],
    isMobile: boolean
    unit: string
}) => {
    const [realData, setRealData] = useState<HashrateHistoryItem[]>(dataList);
    useEffect(() => {
        const temp = dataList.sort((a, b) => a.created_at - b.created_at);
        setRealData(temp)
    }, [dataList]);
    const config = {
        xField: (d: any) => {
            return moment(d.created_at * 1000).format('MM/DD/YYYY');
        },
        yField: (d: any) => {
            return Number(d.hashrate)
        },
        style: {
            fill: 'linear-gradient(90deg, rgba(215, 173, 255, 0.3) 100%, rgba(104, 167, 255, 0.80) 0%)',
        },
        interaction: {
            tooltip: { render: (event: string, { title, items }: {title: string; items: any}) => <div>
                    <div>日期：{title}</div>
                    <div>算力：{items[0].value.toFixed(2).toString()+ unit + 'H/s'}</div>
                </div>,},
        },
        marginBottom: 0,
        marginTop: 20,
        paddingBottom: 55,
        paddingLeft: 20,
        height: isMobile ? 202 : 285,
    };
    // @ts-ignore
    return <Area width={isMobile ? 332 : 420} {...config} data={realData}></Area>;
};

const OrderInfo = () => {
    const [orderId, setOrderId] = useState('');
    const [link, setLink] = useState('');
    const [paymentList, setPaymentList] = useState<PaymentItem[]>([]);
    const [orderInfo, setOrderInfo] = useState<OrderDetailResponse | null>(null);
    const {state, dispatch} = useContext(MyContext)
    useOnMountUnsafe(() => {
        let tempOrderId = '';
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            tempOrderId = searchParams.get('orderId') || ''
            setOrderId(tempOrderId)
        }
        getOrderInfo(tempOrderId).then((res) => {
            setLink(res.pool_observer_link)
            setOrderInfo(res)
        })
        getPaymentList(tempOrderId).then((res) => {
            setPaymentList(res.list)
        })
    })

    return (
        <div style={{ minHeight: 'calc(100vh - 232px)', paddingTop: '25px', margin: state.isMobile ? '0 16px 20px' : '' }}>
            <div className={state.isMobile ? css.mobileCalCardBig : css.calCardBig}>
                <div className={css.flexWrap}>
                    <div className={css.intro}>
                        <div className={'login-hello'}>算力数据</div>
                        <div className={state.isMobile ? css.mobileCalCardList : css.calCardList}>
                            {cardData.map((card, index) => (
                                <Card rawData={orderInfo} key={card.showKey} {...card} />
                            ))}
                        </div>
                    </div>
                    {
                        !state.isMobile && (
                            <>
                                <div className={css.divider}></div>
                                <div className={css.form}>
                                    <div className={'login-hello'}
                                         style={{display: 'flex', justifyContent: 'space-between'}}>算力曲线
                                        <Button href={link} shape={'round'} type={"primary"}>矿池观察者连接</Button>
                                    </div>
                                    <div style={{marginTop: '50px', marginBottom: '10px'}} className={css.legend}>
                                        <span className={css.try}></span>
                                        <span>{orderInfo?.item.good.unit}H/s</span>
                                    </div>
                                    <DemoArea unit={orderInfo?.item.good.unit || ''} isMobile={false} dataList={orderInfo?.history || []}/>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
            {
                state.isMobile && (
                    <div className={state.isMobile ? css.mobileCalCardBig : css.calCardBig}>
                        <div className={css.form}>
                            <div className={css.loginHello} style={{display: 'flex', justifyContent: 'space-between'}}>
                                算力曲线
                            </div>
                            <DemoArea  unit={orderInfo?.item.good.unit || ''} isMobile={true} dataList={orderInfo?.history || []}/>
                            <Button className={css.blockBtn} href={link} shape={'round'} type={"primary"}>矿池观察者连接</Button>
                        </div>
                    </div>
                )
            }
            <div className={state.isMobile ? css.mobileCalCardBig : css.calCardBig}>
                <div className={'login-hello'}>收益明细</div>
                <Table
                    scroll={{ x: 850 }}
                    columns={columns}
                    dataSource={paymentList}
                />
            </div>
        </div>
    );
}

export default OrderInfo;
