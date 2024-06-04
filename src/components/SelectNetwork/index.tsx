'use client'
import react, {useEffect, useState} from 'react'
import { uuid } from 'uuidv4';
import {getPubInfo,PaymentCurrency, buyProduct, getPaymentResult} from "@/service/api";
import {Button, message} from "antd";
import {cn} from "@/lib/utils";
import React from "react";
import {QRCodeSVG} from "qrcode.react";
import Clipboard from "@/components/Clipboard";
import big from "big.js";
import moment from 'moment'
import css from './index.module.css';
export const SelectNetwork: React.FC<{
    paymentCurrency: PaymentCurrency[];
    currentCurrency: PaymentCurrency;
    currentNetWork: string;
    loading: boolean;
    setCurrency: (data: PaymentCurrency) => void;
    setNetwork: (network: string) => void;
    goPay: () => void;
    total_cost: string | number
}> = ({paymentCurrency, total_cost, currentCurrency, currentNetWork, loading, setCurrency, setNetwork, goPay}) => {
    return (
        <div>
            <div className={css.title}>订单支付</div>
            <div className={css.tip}>待付金额</div>
            <div className={css.money}>${total_cost}</div>
            <div className={css.info}>选择币种</div>
            <div>
                {paymentCurrency.map(item => {
                    return (
                        <Button block
                                className={cn(css.bigButton, currentCurrency.currency === item.currency ? css.selectedCurrency : '')}
                                key={item.currency} onClick={() => setCurrency(item)}>
                            {item.currency}
                        </Button>
                    )
                })}
            </div>
            <div className={css.info}>选择网络</div>
            <div style={{display: "flex", gap: '10px'}}>
                {
                    currentCurrency.network.map(item => {
                        return (
                            <Button
                                className={cn(css.smallButton, currentNetWork === item ? css.selectedCurrency : '')}
                                onClick={() => setNetwork(item)}
                                key={item}>
                                {item}
                            </Button>
                        )
                    })
                }
            </div>
            <div>
                <Button disabled={loading} loading={loading} className={css.payButton} type={"primary"} block
                        shape={"round"} onClick={goPay}>立即支付</Button>
            </div>
        </div>
    )
}
