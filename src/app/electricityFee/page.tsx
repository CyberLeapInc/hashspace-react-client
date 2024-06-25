'use client'
import React, {useContext, useRef, useState} from "react";
import css from './index.module.css'
import DollarBlue from '../../../public/dollarBlue.png';
import Image from "next/image";
import {Button, Table, TableProps, Modal, Statistic, Popover, Divider} from "antd";
import {getElectricityInfo, ElectricityResponse, ElectricityList, chargeElectricity} from "@/service/api";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import NumberSelector from "@/components/NumberSelector";
import moment from "moment/moment";
import BuyProduct from "@/components/BuyProduct";
import Clipboard from "@/components/Clipboard";
import {FinishPayment} from "@/components/FinishPayment";
import {getStateTextColor, getAmountColor, getToFixedLength} from "@/lib/utils";
import DividerCus from "@/components/ui/dividerCus";
import AppContext from "antd/es/app/context";
import {MyContext} from "@/service/context";


interface ChargeFeeProps {
    onConfirm: (v:number) => void
    min: number;
    step: number
}

const ChargeFee = ({onConfirm, min = 0, step =1} : ChargeFeeProps) => {
    const [cost, setCost] = useState(min)
    const handleChange = (v: number) => {
        setCost(v)
    }
    return <div>
        <div>电费金额</div>
        <div style={{marginBottom: '40px'}}>
            <NumberSelector
                value={cost}
                onChange={(v) => handleChange(v)}
                unit={"$"}
                step={step}
            />
        </div>
        <Button style={{height:'52px'}} size={"large"} shape={"round"} block type={"primary"} onClick={() => onConfirm(cost)}>立即充值</Button>
    </div>
}

interface StateHoverProps {
    record: ElectricityList,
    onRecharge: (record: ElectricityList) => void
}
const StateHover = ({record, onRecharge} : StateHoverProps) => {
    const [timoutPop, setTimeoutPop] = useState(false)
    const [visible, setVisible] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const {Countdown} = Statistic;

    const handleRecharge = () => {
        onRecharge(record)
    }

    const notPaidContent = (paymentExpiredAt: number, onRecharge: () => void) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
                未充值
            </div>
            <div>
                <Button shape={"round"} block type={"primary"} onClick={onRecharge}>重新充值</Button>
            </div>
            <div className={css.countdown}><Countdown valueStyle={{
                fontWeight: '400',
                color: '#ea2a2a',
                fontSize: '12px'
            }} value={paymentExpiredAt * 1000}/>内完成支付 </div>
        </div>
    }

    const paidFailedContent = (onRecharge: () => void) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
                充值超时
            </div>
            <div>
                <Button shape={"round"} block type={"primary"} onClick={onRecharge}>重新充值</Button>
            </div>
        </div>
    }

    const chargedContent = (paymentLink: string, payment_link_source: string) => {
        return <div className={css.contentWrapper}>
            <div className={css.smallTitle}>
                已充值
            </div>
            <div style={{display: "flex", lineHeight: '40px'}}>
                <span>TXID:</span>
                <span><Clipboard linkUrl={paymentLink} str={payment_link_source}></Clipboard></span>
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
                                <Button type={"text"} style={{color: getStateTextColor(record.state, record.type)}}>待支付</Button>
                            </Popover>
                        )
                    }
                    {
                        record.state === 2 && (
                            <Popover zIndex={999} content={() => chargedContent(record.payment_link, record.payment_link_source)}>
                                <Button type={"text"} style={{color: getStateTextColor(record.state, record.type)}}>已充值</Button>
                            </Popover>
                        )
                    }
                    {
                        record.state === 3 && (
                            <Popover zIndex={999} content={() => paidFailedContent(handleRecharge)}>
                                <Button type={"text"} danger style={{color: getStateTextColor(record.state, record.type)}}><span>充值超时</span></Button>
                            </Popover>
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


    </div>
}

const ElectricityFee = () => {
    const [electricityInfo, setElectricityInfo] = useState<ElectricityResponse>({
        balance: "",
        estimate_remain_day: 0,
        list: [],
        min_electricity_charge_amount: "",
        pagination: {
            page: 1,
            page_size: 20,
            total_count: 0,
            total_page: 0
        },
        step_electricity_charge_amount: "",
        yesterday_cost: ""
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isBuyProductModalOpen, setIsBuyProductModalOpen] = useState(false)
    const [cost, setCost] = useState(0)
    const [buyProductKey, setBuyProductKey] = useState(0)
    const [min, setMin] = useState(0)
    const [step, setStep] = useState(0)
    const [record, setRecord] = useState<ElectricityList | null>(null)
    const closeModal = () => {
        setIsModalOpen(false)
    }
    const {state} = useContext(MyContext)
    const closeBuyProductModal = () => {
        setBuyProductKey(prevState => prevState+1)
        getElectricityInfo({
            page: 1,
            pageSize: 20
        }).then(res => {
            setElectricityInfo(res);
            setMin(Number(res.min_electricity_charge_amount))
            setStep(Number(res.step_electricity_charge_amount))
        })
        setTimeout(() => {
            setIsBuyProductModalOpen(false)
        })
    }
    const onConfirmCost = (v: number) => {
        setCost(v)
        setBuyProductKey(prevState => prevState+1)
        closeModal()
        setIsBuyProductModalOpen(true)
    }
    const onBuy = (v:{currency: string, network: string, trace_id: string}) => {
        return chargeElectricity({
            ...v,
            amount: cost.toString()
        })
    }
    useOnMountUnsafe(() => {
        getElectricityInfo({
            page: 1,
            pageSize: 20
        }).then(res => {
            setElectricityInfo(res);
            setMin(Number(res.min_electricity_charge_amount))
            setStep(Number(res.step_electricity_charge_amount))
        })
    })
    const handleRecharge = (record: ElectricityList) => {
        if (record.state === 3) {
            setCost(Number(record.payment_request.amount));
            setIsBuyProductModalOpen(true);
        }
        if (record.state === 1) {
            setRecord(record)
        }
    }

    const columns: TableProps<ElectricityList>['columns'] = [
        {
            title: '时间(UTC)',
            dataIndex: 'created_at',
            render: (data) => {
                return <div>{moment(data*1000).format('YYYY/MM/DD HH:mm:ss')}</div>
            },
            width: 200
        },
        {
            title: '订单号',
            dataIndex: 'order_id',
        },
        {
            title: '订单状态',
            dataIndex: 'state',
            render: (state, record) => {
                return <StateHover record={record} onRecharge={handleRecharge}/>
            }
        },
        {
            title: '金额',
            dataIndex: 'payment_request',
            render: (data,record) => {
                return (
                    <div>
                        <div style={{color: getAmountColor(record.state, record.type)}}>
                            {record.type === 1 ? '+' : '-'}${Number(record.amount).toFixed(getToFixedLength())}
                        </div>
                    </div>
                )
            }
        },
    ]


    return (
        <div className={css.container}>
            <Modal width={420} title={'电费充值'} open={isModalOpen} style={{maxHeight: '600px'}}
                   onCancel={() => closeModal()} footer={''}>
            <ChargeFee onConfirm={onConfirmCost} min={min} step={step}/>
            </Modal>
            <Modal width={420} title={'电费充值'} open={isBuyProductModalOpen} onCancel={() => closeBuyProductModal()} footer={''}>
                <BuyProduct key={buyProductKey} onBuy={onBuy} total_cost={cost} finishPay={closeBuyProductModal} />
            </Modal>
            <Modal width={420} title={'电费充值'} open={!!record} onCancel={() => setRecord(null)} footer={''}>
                <FinishPayment
                    fixPos={4}
                    duration={(record?.payment_expired_at  || 0) - (new Date().getTime() / 1000)}
                    currentCurrency={{currency: record?.payment_request.currency || '', network: [record?.payment_request.network || '']}}
                    amount={record?.payment_request.transfer_amount || '0'}
                    orderId={record?.order_id || ''}
                    qrcodeUrl={record?.payment_link_source || ''}
                    isCountDownFinish={false}
                    finishPay={() => setRecord(null)}
                    setTimeStatus={() => {}}
                />
            </Modal>
            {
                !state.isMobile && (
                    <div className={css.top}>
                        <div className={css.box} style={{flex: 2}}>
                            <div className={css.boxMain}>
                                <div className={css.boxMainTitle}>
                                    <Image width={28} src={DollarBlue} alt={'dollar'}/>
                                    <span className={css.boxMainTitleText}>电费余额</span>
                                </div>
                                <div className={css.bigText}>$ {Number(electricityInfo.balance || 0).toFixed(getToFixedLength()) || 0}</div>
                            </div>
                            <div className={css.boxAction}>
                                <Button type={"primary"} shape={"round"} block
                                        onClick={() => setIsModalOpen(true)}
                                        style={{height: '52px', marginTop: '50px'}}>充值</Button>
                            </div>
                        </div>
                        <div className={css.box} style={{flex: 1}}>
                            <div className={css.boxMain} style={{padding: '15px 10px'}}>
                                <div className={css.boxMainTitle}>
                                    <Image width={28} src={DollarBlue} alt={'dollar'}/>
                                    <span className={css.boxMainTitleText}>预计可挖</span>
                                </div>
                                <div className={css.smallText}>{electricityInfo.estimate_remain_day || 0}天</div>
                            </div>
                        </div>
                        <div className={css.box} style={{flex: 1}}>
                            <div className={css.boxMain} style={{padding: '15px 10px'}}>
                                <div className={css.boxMainTitle}>
                                    <Image width={28} src={DollarBlue} alt={'dollar'}/>
                                    <span className={css.boxMainTitleText}>昨日电费</span>
                                </div>
                                <div className={css.smallText}>$ {Number(electricityInfo.yesterday_cost).toFixed(getToFixedLength()) || 0}</div>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                state.isMobile && (
                    <div className={css.mobileBox} style={{flexDirection: 'column'}}>
                        <div style={{display: "flex"}}>
                            <div>
                                <div className={css.boxMainTitle} style={{lineHeight: '24px', fontSize: '12px'}}>
                                    <Image width={24} src={DollarBlue} alt={'dollar'}/>
                                    <span className={css.boxMainTitleText}>电费余额</span>
                                </div>
                                <div className={css.bigText}
                                     style={{fontSize: '24px', marginTop: '12px'}}>$ {Number(electricityInfo.balance || 0).toFixed(getToFixedLength()) || 0}</div>
                            </div>
                            <Divider style={{height: '60px', margin: '0 16px'}} type={"vertical"}></Divider>
                            <div>
                                <div className={css.mobileLine}>
                                    <span>预计可挖</span>
                                    <span
                                        className={css.mobileLineStrong}>{electricityInfo.estimate_remain_day || 0}天</span>
                                </div>
                                <div className={css.mobileLine} style={{marginTop: '26px'}}>
                                    <span>昨日电费</span>
                                    <span className={css.mobileLineStrong}>$ {Number(electricityInfo.yesterday_cost).toFixed(getToFixedLength()) || 0}</span>
                                </div>

                            </div>
                        </div>
                        <Button type={"primary"} shape={"round"} block
                                onClick={() => setIsModalOpen(true)}
                                style={{height: '52px', marginTop: '20px'}}>充值</Button>
                    </div>
                )
            }
            <div className={'cal-card-big'} style={{marginTop: '20px'}}>
                <div className={'login-hello'}>我的订单</div>
                <Table
                    scroll={{x: 850}}
                    columns={columns}
                    dataSource={electricityInfo.list}
                />
            </div>
        </div>)
}

export default ElectricityFee;