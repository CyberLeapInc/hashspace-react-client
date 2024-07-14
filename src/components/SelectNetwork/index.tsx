'use client'
import react, {useContext, useEffect, useState} from 'react'
import { uuid } from 'uuidv4';
import {getPubInfo, PaymentCurrency, buyProduct, getPaymentResult, money} from "@/service/api";
import {Button, message} from "antd";
import {cn} from "@/lib/utils";
import React from "react";
import css from './index.module.css';
import {MyContext} from "@/service/context";
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
    const {state} = useContext(MyContext);
    return (
        <div>
            <div className={css.title}>订单支付</div>
            <div className={css.tip}>待付金额</div>
            <div className={css.money}>${total_cost}</div>
            <div className={css.info} style={{
                marginTop: '38px'
            }}>选择币种</div>
            <div>
                {paymentCurrency.map(item => {
                    return (
                        <Button block
                                className={cn(css.bigButton, currentCurrency.currency === item.currency ? css.selectedCurrency2 : '')}
                                key={item.currency} onClick={() => setCurrency(item)}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <span>{item.currency}</span>
                                <span className={css.currencyRate}>1{item.currency} ≈ {Number(state.pubInfo.currency_rates[item.currency as money]?.USD || '0').toFixed(4)}USD</span>
                            </div>
                        </Button>
                    )
                })}
            </div>
            <div className={css.info}>选择网络</div>
            <div className={''} style={{display: "flex", gap: '10px', flexWrap: 'wrap'}}>
                {
                    currentCurrency?.networks?.map(item => {
                        return (
                            <Button
                                className={cn(css.smallButton, currentNetWork === item.name ? css.selectedCurrency : '')}
                                onClick={() => setNetwork(item.name)}
                                key={item.name}>
                                {item.full_name}
                            </Button>
                        )
                    })
                }
            </div>
            <div>
                <Button disabled={loading} loading={loading} className={css.payButton} type={"primary"} block
                        size={"large"}
                        shape={"round"} onClick={goPay}>立即支付</Button>
            </div>
        </div>
    )
}
