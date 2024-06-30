'use client'
import react, {useEffect, useState} from 'react'
import { uuid } from 'uuidv4';
import {getPubInfo,PaymentCurrency, getPaymentResult} from "@/service/api";
import {message} from "antd";
import React from "react";
import {SelectNetwork} from "@/components/SelectNetwork";
import {FinishPayment} from "@/components/FinishPayment";


export interface BuyProductProp {
    onBuy: (info: {currency: string, network: string, trace_id: string}) => Promise<{
        amount: string;
        address: string;
        order_id: string;
        expired_at: number;
    }>;
    /**
     * 总费用，如：$150； 总费用=算力费用+电费
     */
    total_cost: string | number;
    finishPay: () => void;
}

enum Step {
    selectNetwork,
    finish
}



export const BuyProduct = (data: BuyProductProp) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [step, setStep] = useState(Step.selectNetwork)
    const [isCountDownFinish, setIsCountDownFinish] = useState(false)
    const [uuidStr, setUuidStr] = useState(uuid());
    const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency[]>([])
    const [currentCurrency, setCurrentCurrency] = useState<PaymentCurrency>({
        currency: '',
        network: [],
        networks: []
    })
    const [currentNetWork, setCurrentNetwork] = useState('')
    const [currentNetWorks, setCurrentNetworks] = useState({
        name: '',
        full_name: ''
    })
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
                setCurrentNetwork(res.payment_currency[0].networks[0].name)
                setCurrentNetworks(res.payment_currency[0].networks[0])
            }
        })
    }, [setCurrentCurrency, setPaymentCurrency, setCurrentNetwork, setCurrentNetworks])
    const setCurrency = (data: PaymentCurrency) => {
        console.log(data)
        setCurrentCurrency(data)
        setCurrentNetwork(data.networks[0].name)
    }
    const setNetwork = (network: string) => {
        setCurrentNetwork(network)
        setCurrentNetworks(currentCurrency.networks.find(item => item.name === network) as { name: string; full_name: string })
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
        data.onBuy({
            currency: currentCurrency.currency,
            network: currentNetWork,
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
            step === Step.selectNetwork && (
                <SelectNetwork
                    paymentCurrency={paymentCurrency}
                    currentCurrency={currentCurrency}
                    currentNetWork={currentNetWork}
                    loading={loading}
                    setCurrency={setCurrency}
                    setNetwork={setNetwork}
                    goPay={goPay}
                    total_cost={data.total_cost}
                />)
        }
        {
            step === Step.finish && (
                <FinishPayment
                    duration={duration}
                    currentCurrency={{
                        currency: currentCurrency.currency,
                        network: [currentNetWork],
                        networks: [currentNetWorks]
                    }}
                    amount={amount}
                    orderId={orderId}
                    qrcodeUrl={qrcodeUrl}
                    isCountDownFinish={isCountDownFinish}
                    finishPay={finishPay}
                    setTimeStatus={setTimeStatus} />)
        }
        {contextHolder}
    </div>)
}

export default BuyProduct;
