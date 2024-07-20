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
import {useTranslations} from 'next-intl';

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
    const t = useTranslations('finishPayment');

    return (
        <div>
            <div className={css.title}>{t('paymentDetails')}</div>
            <div className={css.tip}>{t('amountToTransfer')}</div>
            <div className={css.money}>{big(amount).toFixed(fixPos).toString()} <span className={css.unit}>{currentCurrency.currency}</span></div>
            <Counter key={duration} timeLeft={duration} onCountFinish={setTimeStatus}/>
            <div className={css.row}>
                <div style={{marginRight: '8px'}}>{t('orderId')}</div>
                <div className={css.elli}>{orderId}</div>
            </div>
            <div className={css.warning}>{t('warning')}</div>
            <div className={css.qrcodeWrapper}>
                <QRCodeSVG size={100} value={qrcodeUrl}/>
            </div>
            <div className={css.network}>
                {/*{JSON.stringify(currentCurrency)}*/}
                {t('transferNetwork')} {currentCurrency.networks[0].full_name}
            </div>
            <Clipboard str={qrcodeUrl}></Clipboard>
            <Button disabled={isCountDownFinish} onClick={finishPay} size={"large"} block shape={"round"}
                    type={"primary"} style={{height: '52px', marginTop: '33px'}}>{t('completedTransfer')}</Button>
        </div>
    )
}
