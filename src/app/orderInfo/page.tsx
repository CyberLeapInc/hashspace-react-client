'use client'
import React, {useState, useEffect, useContext, useRef, useCallback, useMemo} from 'react';
import Image, {StaticImageData} from "next/image";
import calAllgain from '../../../public/cal-allgain.png'
import calAllPay from '../../../public/cal-allpay.png'
import calDailyGain from '../../../public/cal-dailygain.png'
import calPayBackDay from '../../../public/cal-paybackday.png'
import calPayBackMoney from '../../../public/cal-paybackmoney.png'
import calProfit from '../../../public/cal-profit.png'
import {getOrderInfo, OrderDetailResponse, HashrateHistoryItem, getPaymentList, PaymentItem} from "@/service/api";
import { Table } from 'antd';
import dynamic from 'next/dynamic';
import type { TableProps } from 'antd';
import { Button } from 'antd';
import './index.css'
import css from './index.module.css'
import {MyContext} from "@/service/context";
import big from "big.js";

const Area = dynamic(() => import('@ant-design/plots').then(({ Area }) => Area), {
    ssr: false
})

const columns: TableProps<PaymentItem>['columns'] = [
    { title: '日期', dataIndex: 'created_at' },
    { title: '理论算力', dataIndex: 'theory_hashrate' },
    { title: '实际算力', dataIndex: 'real_hashrate' },
    { title: '算力达标率', dataIndex: 'compliance_rate', render: (v) => `${big(v).times(100).toFixed(2).toString()}%`
    },
    { title: '收益', dataIndex: 'income' },
    { title: '状态', dataIndex: 'status', render: (v) => v === 1 ? '已支付' : '待支付' },
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
        const priceNow = state.chainList.find((item) => item.currency === currency)?.last_usdt_price
        console.log(priceNow)
        const res = big(count).times(big(priceNow || 0)).toFixed(4).toString();
        return res;
    }
    const getInfo = (key: keyof OrderDetailResponse): string => {
        if (/income/.test(key)) {
            return `$${getMoney(rawData.currency, rawData[key] as string || '0')}`
        }
        return ''
    }
    const getUnit = (key: keyof OrderDetailResponse): string => {
        if (/hashrate/.test(key)) {
            return 'TH'
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
            <div className={css.calCard}>
                <div className={css.calCardTitle}>
                    <Image className={css.image} src={image} alt={alt}></Image>
                    {title}
                </div>
                <div className={css.calCardCount}>{!getUnit(showKey) && "$"}{getShowKey(showKey)}
                    <span className={css.unit}>{getUnit(showKey)}</span>
                </div>
                <div className={css.calCardInfo}>{getInfo(showKey)}</div>
            </div>
        )
    )
};

const DemoArea = ({dataList}: {
    dataList: HashrateHistoryItem[]
}) => {
    const [realData, setRealData] = useState<HashrateHistoryItem[]>(dataList);
    useEffect(() => {
        const temp = dataList.sort((a, b) => a.created_at - b.created_at);
        setRealData(temp)
    }, [dataList]);
    const config = {
        xField: (d: any) => {
            return new Date(d.created_at * 1000).toDateString();
        },
        yField: 'hashrate',
        style: {
            fill: 'linear-gradient(90deg, rgba(215, 173, 255, 0.3) 100%, rgba(104, 167, 255, 0.80) 0%)',
        },
        marginBottom: 0,
        marginTop: 50,
        paddingBottom: 25,
        height: 350,
    };
    return <Area width={410} {...config} data={realData}/>;
};

const OrderInfo = () => {
    const [orderId, setOrderId] = useState('');
    const [link, setLink] = useState('');
    const [paymentList, setPaymentList] = useState<PaymentItem[]>([]);
    const [orderInfo, setOrderInfo] = useState<OrderDetailResponse | null>(null);
    useEffect(() => {
        let tempOrderId = '';
        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search);
            tempOrderId = searchParams.get('orderId') || ''
            setOrderId(tempOrderId)
        }
        getOrderInfo(tempOrderId).then((res) => {
            console.log(res)
            setLink(res.pool_observer_link)
            setOrderInfo(res)
        })
        getPaymentList(tempOrderId).then((res) => {
            console.log(res)
            setPaymentList(res.list)
        })
    }, [orderId])

    return (
        <div style={{ minHeight: 'calc(100vh - 232px)', paddingTop: '25px' }}>
            <div className={css.calCardBig}>
                <div className={css.flexWrap}>
                    <div className={css.intro}>
                        <div className={css.loginHello}>算力数据</div>
                        <div className={css.calCardList}>
                            {cardData.map((card, index) => (
                                <Card rawData={orderInfo} key={index} {...card} />
                            ))}
                        </div>
                    </div>
                    <div className={css.divider}></div>
                    <div className={css.form}>
                        <div className={css.loginHello} style={{ display: 'flex', justifyContent: 'space-between' }}>算力数据
                            <Button href={link} shape={'round'} type={"primary"}>矿池观察者连接</Button>
                        </div>
                        <DemoArea dataList={orderInfo?.history || []}/>
                    </div>
                </div>
            </div>
            <div className={css.calCardBig}>
                <div className={css.loginHello}>收益明细</div>
                <Table
                    columns={columns}
                    dataSource={paymentList}
                    bordered
                />
            </div>
        </div>
    );
}

export default OrderInfo;
