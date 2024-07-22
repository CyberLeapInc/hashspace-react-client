import {ElectricityList} from "@/service/api";
import React, {useRef, useState} from "react";
import {Button, Popover, Statistic} from "antd";
import css from "@/app/electricityFee/index.module.css";
import Clipboard from "@/components/Clipboard";
import {getStateTextColor} from "@/lib/utils";
import {useTranslations} from 'next-intl';

interface StateHoverProps {
    record: ElectricityList,
    onRecharge: (record: ElectricityList) => void
}
const EleStateHover = ({record, onRecharge} : StateHoverProps) => {
    const t = useTranslations('electricityFee');
    const {Countdown} = Statistic;

    const handleRecharge = () => {
        onRecharge(record)
    }

    const language = localStorage?.getItem('language') || 'en';

    const notPaidContent = (paymentExpiredAt: number, onRecharge: () => void) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
                {t("stateHover.notPaid")}
            </div>
            <div>
                <Button shape={"round"} block type={"primary"} onClick={onRecharge}>{t("stateHover.payImmediately")}</Button>
            </div>
            <div className={css.countdown}>
                {
                    language === 'en' && (
                        <>
                            {t("stateHover.finishPayment")}&nbsp;
                            <Countdown valueStyle={{
                                fontWeight: '400',
                                color: '#ea2a2a',
                                fontSize: '12px'
                            }} value={paymentExpiredAt * 1000}/>
                        </>
                    )
                }
                {
                    language !== 'en' && (
                        <>
                            <Countdown valueStyle={{
                                fontWeight: '400',
                                color: '#ea2a2a',
                                fontSize: '12px'
                            }} value={paymentExpiredAt * 1000}/>
                            {t("stateHover.finishPayment")}
                        </>
                    )
                }
            </div>
        </div>
    }

    const paidFailedContent = (onRecharge: () => void) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
            {t("stateHover.rechargeOverTime")}
            </div>
            <div>
                <Button shape={"round"} block type={"primary"} onClick={onRecharge}> {t("stateHover.rechargeAgain")}</Button>
            </div>
        </div>
    }

    const chargedContent = (paymentLink: string, payment_link_source: string) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
            {t("stateHover.charged")}
            </div>
            <div style={{display: "flex", lineHeight: '40px', alignItems: 'center'}}>
                <span style={{marginTop: '2px'}}>TXID:</span>
                <span style={{flex:1, textAlign: 'center'}}>
                    {
                        paymentLink ? <Clipboard noBg={true} linkUrl={paymentLink} str={payment_link_source} /> : '--'
                    }
                </span>
            </div>
        </div>
    }

    return <div>
        {
            record.type === 1 && (
                <>
                    {
                        record.state === 1 && (
                            <Popover zIndex={999} content={() => notPaidContent(record.payment_expired_at, handleRecharge)}>
                                <Button type={"text"} style={{color: getStateTextColor(record.state, record.type)}}>{t("stateHover.rechargeAgain")}</Button>
                            </Popover>
                        )
                    }
                    {
                        record.state === 2 && (
                            <Popover zIndex={999} content={() => chargedContent(record.payment_link, record.payment_link_source)}>
                                <Button type={"text"} style={{color: getStateTextColor(record.state, record.type)}}>{t("stateHover.charged")}</Button>
                            </Popover>
                        )
                    }
                    {
                        record.state === 3 && (
                            <Popover zIndex={999} content={() => paidFailedContent(handleRecharge)}>
                                <Button type={"text"} danger style={{color: getStateTextColor(record.state, record.type)}}><span>{t("stateHover.rechargeOverTime")}</span></Button>
                            </Popover>
                        )
                    }
                </>
            )
        }
        {
            record.type === 2 && (
                <Button type={"text"} > {t("stateHover.deducted")}</Button>
            )
        }


    </div>
}

export default EleStateHover