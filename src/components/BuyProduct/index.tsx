'use client'
import react, {useEffect, useState} from 'react'
import css from './index.module.css';
import { uuid } from 'uuidv4';
import {getPubInfo,PaymentCurrency, buyProduct, getPaymentResult} from "@/service/api";
import {Button, message} from "antd";
import {cn} from "@/lib/utils";
import React from "react";
import {QRCodeSVG} from "qrcode.react";
import Clipboard from "@/components/Clipboard";
import big from "big.js";
import moment from 'moment'


export interface BuyProductProp {

    /**
     * 电费，如：$120； 电费=electricity_day * good.electricity_cost * hashrate_qty
     */
    electricity_cost: string;
    /**
     * 充值电费天数，如：10天;  限制 最小good.min_electricity_day;  步长为 good.step_electricity_day
     */
    electricity_day: number;
    /**
     * 下单购买的算力商品ID，如：BTC001
     */
    good_id: string;
    /**
     * 算力费用，如：$30； 算力费用=hashrate_qty*good.cost
     */
    hashrate_cost: string;
    /**
     * 购买算力数量，如：100 T; 限制 最小为 good.min_qty;  步长为 good.step_qty; 最大为 good.total_remain_qty
     */
    hashrate_qty: string | number;
    /**
     * 总费用，如：$150； 总费用=算力费用+电费
     */
    total_cost: string;
    finishPay: () => void;
    [property: string]: any;
}

enum Step {
    selectNetwork,
    finish
}

const Counter: React.FC<{
    timeLeft: number;
    onCountFinish: () => void;
}> = ({ timeLeft, onCountFinish }) => {
    const [time, setTime] = useState(timeLeft);
    const [timeStr, setTimeStr] = useState('')

    const secondsToMMSS =(seconds: number) => {
        let duration = moment.duration(seconds, 'seconds');
        let hours = duration.hours();
        let minutes = duration.minutes();
        let secs = duration.seconds();
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (time <= 0) {
            onCountFinish();
            return;
        }

        const intervalId = setInterval(() => {
            const timeLeft = time - 1
            setTime(timeLeft);
            setTimeStr(secondsToMMSS(timeLeft))
        }, 1000);

        // Cleanup the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [time, timeStr, onCountFinish]);

    return (
        <div className={css.counter}>
            {time > 0 ? (
                <span>剩余有效时间 {timeStr} </span>
            ) : (
                <span>已超时</span>
            )}
        </div>
    );
};

export const BuyProduct = (data: BuyProductProp) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [step, setStep] = useState(Step.selectNetwork)
    const [isCountDownFinish, setIsCountDownFinish] = useState(false)
    const [uuidStr, setUuidStr] = useState(uuid());
    const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<PaymentCurrency>({
        currency: '',
        network: []
    })
    const [currentNetWork, setCurrentNetwork] = useState('')
    const [qrcodeUrl, setQrcodeUrl] = useState('');
    const [amount, setAmount] = useState('0')
    const [orderId, setOrderId] = useState('')
    const [pollingIntervalId, setPollingIntervalId] = useState(0);
    const [loading, setLoading] = useState(false)
    const [duration, setDuration] = useState(0)


    useEffect(() => {
        getPubInfo().then(res => {
            setPaymentCurrency(res.payment_currency)
            if (res.payment_currency.length > 0) {
                setCurrentCurrency(res.payment_currency[0]);
                setCurrentNetwork(res.payment_currency[0].network[0])
            }
        })
    }, [setCurrentCurrency, setPaymentCurrency, setCurrentNetwork])
    const setCurrency = (data: PaymentCurrency) => {
        setCurrentCurrency(data)
        setCurrentNetwork(data.network[0])
    }
    const setNetwork = (network: string) => {
        setCurrentNetwork(network)
    }

    const setTimeStatus = () => {
        messageApi.error('支付超时')
        setIsCountDownFinish(true)
        data.finishPay();
    }

    const finishPay = () => {
        data.finishPay();
    }

    const pollPaymentResult = (id: string) => {
        const intervalId = setInterval(() => {
            getPaymentResult(id).then(response => {
                const state = response.state;

                switch (state) {
                    case 1:
                        console.log("待支付");
                        break;
                    case 2:
                        messageApi.success('支付成功');
                        clearInterval(intervalId); // 如果已支付，停止轮询
                        break;
                    case 3:
                        messageApi.error('支付超时');
                        console.log("支付超时");
                        clearInterval(intervalId); // 如果支付超时，停止轮询
                        break;
                    default:
                        messageApi.error('未知状态');
                        clearInterval(intervalId); // 如果支付超时，停止轮询
                        break;
                }
            }).catch(error => {
                clearInterval(intervalId); // 如果请求失败，停止轮询
                messageApi.error(error.message || 'unknown error');
            });
        }, 3000) as unknown as number; // 每3秒请求一次
        setPollingIntervalId(intervalId)
    };

    useEffect(() => {
        return () => {
            if (pollingIntervalId) {
                console.log('clear time out')
                clearInterval(pollingIntervalId as unknown as number);
            }
        };
    }, [pollingIntervalId]);

    const goPay = () => {
        setLoading(true)
        buyProduct({
            currency: currentCurrency.currency,
            electricity_cost: big(data.electricity_cost).toString(),
            electricity_day: data.electricity_day,
            good_id: data.good_id,
            hashrate_cost: data.hashrate_cost,
            hashrate_qty: data.hashrate_qty.toString(),
            network: currentNetWork,
            total_cost: data.total_cost,
            trace_id: uuidStr
        }).then(res => {
            console.log(res)
            setAmount(res.amount);
            setQrcodeUrl(res.address)
            setOrderId(res.order_id);
            setStep(Step.finish)
            setDuration(res.expired_at - (new Date().getTime() / 1000))
            pollPaymentResult(uuidStr);
        }).catch(e => {
            console.log(e.message)
            messageApi.error(e.message);
        }).finally(() => {
            setLoading(false)
        })

    }


    return (<div>
        {
            step === Step.selectNetwork && (<div>
                <div className={css.title}>订单支付</div>
                <div className={css.tip}>待付金额</div>
                <div className={css.money}>${data.total_cost}</div>
                <div className={css.info}>选择币种</div>
                <div>
                    {paymentCurrency.map(item => {
                        return (<Button block
                                        className={cn(css.bigButton, currentCurrency.currency === item.currency ? css.selectedCurrency : '')}
                                        key={item.currency} onClick={() => setCurrency(item)}>
                            {item.currency}
                        </Button>)
                    })}
                </div>
                <div className={css.info}>选择网络</div>
                <div style={{display: "flex", gap: '10px'}}>
                    {
                        currentCurrency.network.map(item => {
                            return <Button
                                className={cn(css.smallButton, currentNetWork === item ? css.selectedCurrency : '')}
                                onClick={() => setNetwork(item)}
                                key={item}>
                                {item}
                            </Button>
                        })
                    }
                </div>
                <div>
                    <Button disabled={loading} loading={loading} className={css.payButton} type={"primary"} block shape={"round"} onClick={goPay}>立即支付</Button>
                </div>
            </div>)
        }
        {
            step === Step.finish && (<div>
                <div className={css.title}>支付详情</div>
                <div className={css.tip}>待转账金额</div>
                <div className={css.money}>{currentCurrency.currency} {amount}</div>
                <Counter timeLeft={duration} onCountFinish={setTimeStatus}/>
                <div className={css.row}>
                    <div>订单ID</div>
                    <div>{orderId}</div>
                </div>
                <div className={css.warning}>请按待转账金额付款，不同网络费用各不相同，转账时需要注意网络手续费</div>
                <div className={css.qrcodeWrapper}>
                    <QRCodeSVG size={100} value={qrcodeUrl} />
                </div>
                <div className={css.network}>
                    转账网络: {currentNetWork}
                </div>
                <Clipboard str={qrcodeUrl}></Clipboard>
                <Button disabled={isCountDownFinish} onClick={finishPay} size={"large"} block shape={"round"} type={"primary"} style={{height: '52px', marginTop: '40px'}}>已完成转账</Button>

            </div>)
        }
        {contextHolder}
    </div>)
}

export default BuyProduct;
