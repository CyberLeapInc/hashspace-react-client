'use client'
import React, {useContext, useEffect, useState} from 'react';
import {Button, Table, Modal, Statistic} from 'antd';
import type {TableProps} from 'antd';
import Link from "next/link";
import ArrowUpOutlineBlack from '../../../public/arrow-up-outline-black.png';
import {getOrderList, OrderListItem, PageInfo, deleteOrder, OrderGood} from "@/service/api";
import {DeleteOutlined,DeleteFilled} from "@ant-design/icons";
import css from './index.module.css'
import Image from "next/image";
import big from "big.js";
import moment from "moment";
import Clipboard from "@/components/Clipboard";
import {OrderItem, DataType, Good} from './interfaces'
import BTC from '../../../public/btc.svg'
import DOGE from '../../../public/doge.svg'
import LTC from '../../../public/ltc.svg'
import {cn, formatThousands, getToFixedLength, parseHashrateByNumber} from "@/lib/utils";
import {FinishPayment} from "@/components/FinishPayment";
import {EasyConfirmContent} from "@/components/EasyConfirmContent";
import {MyContext} from "@/service/context";
import IconList from "@/components/IconList";
import {useTranslations} from "next-intl";
import {NextIntlClientProvider} from 'next-intl';
import {useMessages} from "use-intl";


const getCurrencyIcon = (currency: string) => {
    switch (currency) {
        case 'BTC':
            return <Image style={{marginRight: '5px'}} src={BTC} alt={'btc'} width={20}/>
        case 'DOGE':
            return <Image style={{marginRight: '5px'}} src={DOGE} alt={'doge'} width={20}/>
        case 'LTC':
            return <Image style={{marginRight: '5px'}} src={LTC} alt={'ltc'} width={20}/>
        default:
            return <Image style={{marginRight: '5px'}} src={BTC} alt={'btc'} width={20}/>
    }
}

const getStatusColor = (status: number) => {
    switch (status) {
        case 1:
            return '#EA2A2A'
        case 2:
            return '#16C984'
        case 3:
            return '#EA2A2A'
        case 4:
            return '#333333'
        default:
            return '#999999'
    }
}

const getFeeColor = (status: number) => {
    switch (status) {
        case 2:
            return '#333333'
        default:
            return '#999999'
    }

}




const data: DataType[] = [];

const PaymentStatus = ({status, link, source, goodId, reBuy, record}: {
    status: number,
    link: string,
    source: string,
    goodId: string,
    record: OrderListItem,
    reBuy: (data: any) => void
}) => {
    const t = useTranslations('myOrder');
    const {Countdown} = Statistic;
    switch (status) {
        case 1:
            return (
                <div>
                    <Button type={"primary"} shape={"round"} onClick={() => reBuy(record)}>{t('immediatePayment')}</Button>
                    <div className={cn(css.countdownWrapper)}>
                        {
                            typeof window !== 'undefined' && window.localStorage.getItem('language') !== 'zh-CN' &&
                            <div>{t('completePaymentWithin')}</div>
                        }
                        <Countdown key={record.order_id}
                                   valueStyle={{fontSize: '12px', color: '#EA2A2A', lineHeight: '23px', height: '23px'}}
                                   value={(record?.payment_expired_at || 0) * 1000}/>
                        {
                            typeof window !== 'undefined' && window.localStorage.getItem('language') === 'zh-CN' &&
                            <div>{t('completePaymentWithin')}</div>
                        }
                    </div>
                </div>
            )
        case 2:
            return (
                <div>
                    <div style={{color: '#16C984', fontWeight: 500}}>{t('paid')}</div>
                </div>
            )
        case 3:
            return (
                <div style={{
                    display: "flex",
                    flexDirection:'column'
                }}>
                    <Link href={record.good?.is_soldout ? '/productList' : `/productDetail?good_id=${goodId}`}>
                        <Button type={"primary"} shape={"round"}>{t('rebuy')}</Button>
                    </Link>
                    <span className={css.textAlignCenter}>
                        <span className={css.timeout}>{t('paymentExpired')}</span>
                    </span>
                </div>
            )
        case 4:
            return (
                <div>
                    <div style={{color: ''}}>{t('paid')}</div>
                </div>
            )
        default:
            return <span>{source}</span>
    }
}

const WrapperRenderExpandData = (data: any, modal: any, contextHolder: any, onDelete: (data: any) => void, reBuy: (data: any) => void, isMobile?: boolean) => {
    const messages = useMessages();
    let locale = 'en'
    if (typeof window !== 'undefined') {
        locale = window.localStorage.getItem('language') || 'en';
    }
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <RenderExpandData   contextHolder={contextHolder} data={data} reBuy={reBuy} modal={modal} isMobile={isMobile} onDelete={onDelete}  />
        </NextIntlClientProvider>
    )

}

interface RenderExpandDataProps {
    data: any;
    modal: any;
    contextHolder: any;
    onDelete: (data: any) => void;
    reBuy: (data: any) => void;
    isMobile?: boolean;
}

const RenderExpandData: React.FC<RenderExpandDataProps> = ({data, modal, contextHolder, onDelete, reBuy, isMobile}) => {
    const t = useTranslations('myOrder');
    return (<div>
        <div className={isMobile? css.mobileRowDetail: css.rowDetail}>
            <div className={css.item}>
                <span className={css.label}>{t('currency')}:</span>
                <span className={css.value} style={{display: 'flex', alignItems: 'center'}}>
                    <IconList list={data.good?.currency || []} size={20}/>
                    {data.good?.currency.join("&")}
                </span>
            </div>
            <div className={css.item}>
                <span className={css.label}>{t('contractFee')}:</span>
                <span className={cn(css.smallCost, css.value)}>${formatThousands(big(data.hashrate_cost).toFixed(getToFixedLength()))}</span>
            </div>
            {
                !isMobile && <div className={css.item}>
                <span className={css.label}>
                    {t('paymentStatus')}:
                </span>
                    <span className={css.value}>
                    {<PaymentStatus
                        record={data}
                        reBuy={reBuy}
                        goodId={data.good.good_id}
                        status={data.state}
                        link={data.payment_link}
                        source={data.payment_link_source}
                    />}
                </span>
                </div>
            }
            <div className={css.item}>
                <span className={css.label}>{t('hashrate')}:</span>
                <span className={css.value}>{formatThousands(parseHashrateByNumber(Number(data.hashrate), 2, data.good.unit).hashrate, false)} {parseHashrateByNumber(Number(data.hashrate), 2, data.good.unit).unit}</span>
            </div>
            <div className={css.item}>
                <span className={css.label}>{t('electricityFee')}:</span>
                <span className={cn(css.value, css.smallCost)}>
                    ${formatThousands(big(data.electricity_cost).toFixed(getToFixedLength()))}
                </span>
            </div>
            <div className={css.item}>
                {
                    ( (data.state === 2 || data.state === 4) && data.payment_link) && (
                        <>
                            <span className={css.label}>TXID:</span>
                            <span className={css.value} style={{
                                marginLeft: '-8px',
                            }}>
                                <Clipboard

                                    maxTextWidth={'67px'}
                                    linkUrl={data.payment_link}
                                    str={data.payment_link_source}
                                />
                            </span>
                        </>
                    )
                }
            </div>
            <div className={css.item}>
                <span className={css.label}>{t('algorithm')}:</span>
                <span className={css.value}>{data.good.algorithm}</span>
            </div>
            <div className={css.item}>
                <span className={css.label}>{t('totalFee')}:</span>
                <span className={cn(css.totalFeeText, css.value)}>${formatThousands(big(data.cost).toFixed(getToFixedLength()))}</span>
            </div>
            <div></div>
            <div className={css.item} style={{width: '600px'}}>
                <span className={css.label}>{t('miningDate')}:</span>
                <span
                    className={css.value}>{moment(data.start_at * 1000 || 0).format('MM/DD/YYYY')} - {moment(data.end_at * 1000 || 0).format('MM/DD/YYYY')}</span>
            </div>
            <div className={css.delOrderBtn}>
                {
                    data.state === 3 && <Button style={{color: '#666666'}} type={"text"} icon={<DeleteFilled/>} onClick={() => onDelete(data)}>{t('deleteOrder')}</Button>
                }
            </div>
            {
                isMobile && <div className={css.item}>
                <span className={css.label}>
                    {t('paymentStatus')}:
                </span>
                    <span className={css.value}>
                    {<PaymentStatus
                        record={data}
                        reBuy={reBuy}
                        goodId={data.good.good_id}
                        status={data.state}
                        link={data.payment_link}
                        source={data.payment_link_source}
                    />}
                </span>
                </div>
            }
            {
                ( data.state === 2 || data.state === 4) && <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '0px',
                }}>
                    <Button style={{color: '#3C53FF'}} type={"link"}>
                        <Link href={`/orderInfo?orderId=${data.order_id}`}>
                            {t('moreDetails')} {'>'}
                        </Link>
                    </Button>
                </div>
            }
        </div>
        {contextHolder}
    </div>)
}


const MyOrder = () => {
    'use client'
    const [orderList, setOrderList] = useState<OrderListItem[]>([]);
    const [pageInfo, setPageInfo] = useState<PageInfo>({page: 1, page_size: 20, total_page: 1, total_count: 0})
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [modal, contextHolder] = Modal.useModal();
    const [currentObj, setCurrentObj] = useState<OrderListItem | null>(null)
    const [deleteObj, setDeleteObj] = useState<OrderListItem | null>(null)
    const {state} = useContext(MyContext);
    const t = useTranslations('myOrder');

    const handleExpand = (record: any) => {
        const keys = [...expandedRowKeys];
        // @ts-ignore
        const index = keys.indexOf(record.order_id);

        if (index >= 0) {
            // 如果行已经展开，折叠它
            keys.splice(index, 1);
        } else {
            // 如果行已经折叠，展开它
            // @ts-ignore
            keys.push(record.order_id);
        }

        setExpandedRowKeys(keys);
    };

    useEffect(() => {
        getOrderList(1, 20).then(res => {
            setOrderList(res.list);
            setPageInfo(res.pagination)
        })
    }, [setOrderList])
    const onDelete = (data: any) => {
        if (!data) return
        setDeleteObj(data)
    }
    const reBuy = (data: OrderListItem) => {
        setCurrentObj(data);
        console.log(data)
    }

    const deleteRow = () => {
        if (!deleteObj) return;
        deleteOrder(deleteObj.order_id).then(() => {
            setDeleteObj(null)
            getOrderList(1, 20).then(res => {
                setOrderList(res.list);
                setPageInfo(res.pagination)
            })
        })
    }

    const columns: TableProps<OrderItem>['columns'] = [
        {
            title: t('orderTime'),
            dataIndex: 'created_at',
            render: (data) => {
                return <div>{moment(data * 1000).format('MM/DD/YYYY HH:mm:ss')}</div>
            },
            width: 200
        },
        {
            title: t('orderId'),
            dataIndex: 'order_id',
            width: 200
        },
        {
            title: t('package'),
            dataIndex: 'good',
            render: (text, record, index) => {
                return <div className={css.flexbox}>
                    <IconList
                        list={record.good?.currency || []}
                        size={20}
                    />
                    {record.good?.name}</div>
            },
            width: 200
        },
        {
            title: t('hashrate'),
            dataIndex: 'hashrate',
            render: (text, record, index) => {
                return <div>{
                    formatThousands(parseHashrateByNumber(Number(record.hashrate), 2, record.good?.unit || '').hashrate, false)
                } {parseHashrateByNumber(Number(record.hashrate), 2, record.good?.unit || '').unit || ''}</div>
            },
            width: 100
        },
        {
            title: t('amount'),
            dataIndex: 'hashrate_cost',
            render: (text, record, index) => {
                return <div style={{color: getFeeColor(record.state || 0)}}
                            className={css.rowBold}>${formatThousands(big(record.hashrate_cost || '').toFixed(getToFixedLength()))}</div>
            },
            width: 100
        },
        {
            title: t('status'),
            dataIndex: 'state',
            render: (text, record) => {
                // 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
                let innerText = t('unknown')
                if (record.state === 1 || record.state === 3) {
                    innerText =  t('unpaid')
                }
                if (record.state === 2) {
                    innerText = t('paid')
                }
                if (record.state === 4) {
                    innerText = t('miningEnd')
                }
                return (<span className={css.rowBold}
                              style={{color: getStatusColor(record.state || 0)}}>{innerText}</span>)
            },
            width: 100
        },
        Table.EXPAND_COLUMN,
    ];

    return <div style={{minHeight: 'calc(100vh - 232px)', padding: '25px 16px 20px'}}>
        <Modal open={currentObj!==null} width={420} footer={''} onCancel={() => setCurrentObj(null)}>
            <FinishPayment
                fixPos={8}
                amount={currentObj?.payment_request.transfer_amount || '0'}
                duration={(currentObj?.payment_expired_at  || 0) - (new Date().getTime() / 1000)}
                currentCurrency={{
                    currency: currentObj?.payment_request.currency || '',
                    network:[ currentObj?.payment_request.network || ''],
                    networks: [{
                        name: currentObj?.payment_request.network || '',
                        full_name: currentObj?.payment_request.network_full_name || ''
                    }]
                }}
                orderId={currentObj?.order_id || ''}
                qrcodeUrl={currentObj?.payment_link_source || ''}
                isCountDownFinish={false}
                setTimeStatus={() => {
                }}
                finishPay={() => {
                    setCurrentObj(null)
                }}
            />
        </Modal>
        <Modal open={deleteObj!==null} onCancel={() => setDeleteObj(null)} footer={null} width={420}>
            <EasyConfirmContent
                key={deleteObj?.order_id}
                title={t('deleteOrder')}
                content={t('deleteOrderConfirm')}
                confirmText={t('thinkAgain')}
                cancelText={t('yes')}
                onCancel={deleteRow}
                onConfirm={() => setDeleteObj(null)}
            />
        </Modal>
        <div className={'cal-card-big'}>
            <div className={'login-hello'}>{t('myOrders')}</div>
            <Table
                scroll={{ x: 850 }}
                // @ts-ignore
                columns={columns}
                dataSource={orderList}
                rowKey={'order_id'}
                expandable={{
                    fixed: true,
                    expandedRowKeys: expandedRowKeys,
                    expandedRowRender: (record) => WrapperRenderExpandData(record, modal, contextHolder, onDelete, reBuy, state.isMobile),
                    rowExpandable: (record) => true,
                    expandIcon: ({expanded, onExpand, record}) =>
                        <div style={{width: '30px', height: '30px', padding: '11px', cursor: 'pointer'}}
                             onClick={e => handleExpand(record)}>
                            <Image style={{
                                rotate: expanded ? '180deg' : '0deg',
                                transition: 'all 0.3s'
                            }} src={ArrowUpOutlineBlack} alt={'arrow'} width={8}/>
                        </div>,
                }}
            />
        </div>
    </div>
}

export default MyOrder;