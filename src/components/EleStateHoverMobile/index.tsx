import {ElectricityList} from "@/service/api";
import React, {useRef, useState} from "react";
import {Button, Drawer, Popover, Statistic} from "antd";
import css from "@/app/electricityFee/index.module.css";
import Clipboard from "@/components/Clipboard";
import {getStateTextColor} from "@/lib/utils";

interface StateHoverProps {
    record: ElectricityList,
    onRecharge: (record: ElectricityList) => void
}
const EleStateHoverMobile = ({record, onRecharge} : StateHoverProps) => {
    const {Countdown} = Statistic;
    const [visible, setVisible] = useState(false)

    const handleRecharge = () => {
        onRecharge(record)
    }

    const notPaidContent = (paymentExpiredAt: number, onRecharge: () => void) => {
        return <div>
            <div className={css.smallTitleMobile}>
                未充值
            </div>
            <div>
                <Button size={"large"} shape={"round"} block type={"primary"} onClick={onRecharge}>立即支付</Button>
            </div>
            <div className={css.countdownMobile}><Countdown valueStyle={{
                fontWeight: '400',
                color: '#ea2a2a',
                fontSize: '14px'
            }} value={paymentExpiredAt * 1000}/>内完成支付 </div>
        </div>
    }

    const paidFailedContent = (onRecharge: () => void) => {
        return <div>
            <div className={css.smallTitleMobile}>
                充值超时
            </div>
            <div>
                <Button size={"large"} shape={"round"} block type={"primary"} onClick={onRecharge}>重新充值</Button>
            </div>
        </div>
    }

    const chargedContent = (paymentLink: string, payment_link_source: string) => {
        return <div>
            <div className={css.smallTitleMobile}>
                已充值
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
                            <Button type={"text"} onClick={() => setVisible(true)} style={{color: getStateTextColor(record.state, record.type)}}>待支付</Button>
                        )
                    }
                    {
                        record.state === 2 && (
                            <Button type={"text"}  onClick={() => setVisible(true)} style={{color: getStateTextColor(record.state, record.type)}}>已充值</Button>
                        )
                    }
                    {
                        record.state === 3 && (
                            <Button type={"text"}  onClick={() => setVisible(true)} danger style={{color: getStateTextColor(record.state, record.type)}}><span>充值超时</span></Button>
                        )
                    }
                </>
            )
        }
        {
            record.type === 2 && (
                <Button type={"text"} >已扣除</Button>
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