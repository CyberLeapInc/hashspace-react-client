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
import {Counter} from "@/components/Counter";
import big from "big.js";

export const FinishPayment: React.FC<{
    duration: number;
    currentCurrency: PaymentCurrency;
    amount: string;
    orderId: string;
    qrcodeUrl: string;
    isCountDownFinish: boolean;
    finishPay: () => void;
    setTimeStatus: () => void;
    fixPos?: number
}> = ({duration, currentCurrency, amount, orderId, qrcodeUrl, isCountDownFinish, finishPay, setTimeStatus,fixPos = 8}) => {
    return (
        <div>
            <div className={css.title}>支付详情</div>
            <div className={css.tip}>待转账金额</div>
            <div className={css.money}>{big(amount).toFixed(fixPos).toString()} <span className={css.unit}>{currentCurrency.currency}</span></div>
            <Counter key={duration} timeLeft={duration} onCountFinish={setTimeStatus}/>
            <div className={css.row}>
                <div>订单ID</div>
                <div>{orderId}</div>
            </div>
            <div className={css.warning}>请按待转账金额付款，不同网络费用各不相同，转账时需要注意网络手续费</div>
            <div className={css.qrcodeWrapper}>
                <QRCodeSVG size={100} value={qrcodeUrl}/>
            </div>
            <div className={css.network}>
                {/*{JSON.stringify(currentCurrency)}*/}
                转账网络: {currentCurrency.networks[0].full_name}
            </div>
            <Clipboard str={qrcodeUrl}></Clipboard>
            <Button disabled={isCountDownFinish} onClick={finishPay} size={"large"} block shape={"round"}
                    type={"primary"} style={{height: '52px', marginTop: '33px'}}>已完成转账</Button>
        </div>
    )
}
