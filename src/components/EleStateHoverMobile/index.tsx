import {ElectricityList} from "@/service/api";
import React, {useRef, useState} from "react";
import {Button, Drawer, Popover, Statistic} from "antd";
import css from "@/app/electricityFee/index.module.css";
import Clipboard from "@/components/Clipboard";
import {getStateTextColor} from "@/lib/utils";
import {useTranslations} from 'next-intl';

interface StateHoverProps {
    record: ElectricityList,
    onRecharge: (record: ElectricityList) => void
}
const EleStateHoverMobile = ({record, onRecharge} : StateHoverProps) => {
    const t = useTranslations('electricityFee');
    const {Countdown} = Statistic;
    const [visible, setVisible] = useState(false)

    const handleRecharge = () => {
        onRecharge(record)
    }

    const notPaidContent = (paymentExpiredAt: number, onRecharge: () => void) => {
        return <div>
            <div className={css.smallTitleMobile}>
                {t("stateHover.notPaid")}
            </div>
            <div>
                <Button size={"large"} shape={"round"} block type={"primary"} onClick={onRecharge}>{t("stateHover.payImmediately")}</Button>
            </div>
            <div className={css.countdownMobile}><Countdown valueStyle={{
                fontWeight: '400',
                color: '#ea2a2a',
                fontSize: '14px'
            }} value={paymentExpiredAt * 1000}/>{t("stateHover.finishPayment")}</div>
        </div>
    }

    const paidFailedContent = (onRecharge: () => void) => {
        return <div>
            <div className={css.smallTitleMobile}>
            {t("stateHover.rechargeOverTime")}
            </div>
            <div>
                <Button size={"large"} shape={"round"} block type={"primary"} onClick={onRecharge}>{t("stateHover.rechargeAgain")}</Button>
            </div>
        </div>
    }

    const chargedContent = (paymentLink: string, payment_link_source: string) => {
        return <div>
            <div className={css.smallTitleMobile}>
            {t("stateHover.charged")}
            </div>
            <div style={{display: "flex", lineHeight: '40px', alignItems: 'center', paddingRight: '10px',backgroundColor: '#F7F7F7', borderRadius: '8px'}}>
                <span style={{marginTop: '2px',
                    fontSize: '12px',}}>&nbsp;&nbsp;&nbsp;&nbsp;TXID:</span>
                <span style={{flex:1, textAlign: 'center'}}>
                    {
                        paymentLink ? <Clipboard style={{
                            fontSize: '12px',
                        }} noBg={false} linkUrl={paymentLink} str={payment_link_source} /> : '--'
                    }
                </span>
            </div>
        </div>
    }

    const handleOnClose = () => {
        setVisible(false)
    }

    return <div>
        {
            record.type === 1 && (
                <>
                    {
                        record.state === 1 && (
                            <Button type={"text"} onClick={() => setVisible(true)} style={{color: getStateTextColor(record.state, record.type)}}>{t("stateHover.unpaid")}</Button>
                        )
                    }
                    {
                        record.state === 2 && (
                            <Button type={"text"}  onClick={() => setVisible(true)} style={{color: getStateTextColor(record.state, record.type)}}>{t("stateHover.charged")}</Button>
                        )
                    }
                    {
                        record.state === 3 && (
                            <Button type={"text"}  onClick={() => setVisible(true)} danger style={{color: getStateTextColor(record.state, record.type)}}><span>{t("stateHover.rechargeOverTime")}</span></Button>
                        )
                    }
                </>
            )
        }
        {
            record.type === 2 && (
                <Button type={"text"} >{t("stateHover.deducted")}</Button>
            )
        }
        <Drawer
            title={null}
            placement={'bottom'}
            closable={false}
            onClose={handleOnClose}
            open={visible}
            height={record.state === 1 ? 210 :155}
            mask={true}
            maskClosable={true}
            styles={{
                body: {
                    backgroundColor: "white",
                    borderTopLeftRadius: '12px',
                    borderTopRightRadius: '12px'
                },
            }}
        >
            {
                record.type === 1 && (
                    <>
                        {
                            record.state === 1 && notPaidContent(record.payment_expired_at, handleRecharge)
                        }
                        {
                            record.state === 2 && chargedContent(record.payment_link, record.payment_link_source)
                        }
                        {
                            record.state === 3 && paidFailedContent(handleRecharge)
                        }
                    </>
                )
            }
        </Drawer>

    </div>
}

export default EleStateHoverMobile