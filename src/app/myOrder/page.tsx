'use client'
import React, {useEffect, useState} from 'react';
import {Button, Table, Modal, Statistic} from 'antd';
import type {TableProps} from 'antd';
import Link from "next/link";
import ArrowUpOutlineBlack from '../../../public/arrow-up-outline-black.png';
import {getOrderList, OrderListItem, PageInfo, deleteOrder, OrderGood} from "@/service/api";
import {DeleteOutlined} from "@ant-design/icons";
import css from './index.module.css'
import Image from "next/image";
import big from "big.js";
import moment from "moment";
import Clipboard from "@/components/Clipboard";
import {OrderItem, DataType, Good} from './interfaces'
import BTC from '../../../public/btc.svg'
import DOGE from '../../../public/doge.svg'
import LTC from '../../../public/ltc.svg'
import {cn} from "@/lib/utils";

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


const columns: TableProps<OrderItem>['columns'] = [
    {
        title: '订单时间',
        dataIndex: 'created_at',
        render: (data) => {
            return <div>{moment(data * 1000).format('LLLL')}</div>
        },
        width: 200
    },
    {
        title: '订单ID',
        dataIndex: 'order_id',
    },
    {
        title: '套餐',
        dataIndex: 'good',
        render: (text, record, index) => {
            return <div className={css.flexbox}>
                {
                    record.good?.currency.map((item, index) => {
                        return <span key={index} style={{marginRight: '4px'}}>{getCurrencyIcon(item)}</span>
                    })
                }
                {record.good?.name}</div>
        }
    },
    {
        title: '算力',
        dataIndex: 'hashrate',
        render: (text, record, index) => {
            return <div>{record.hashrate}{record?.good?.unit || ''}</div>
        }
    },
    {
        title: '金额',
        dataIndex: 'hashrate_cost',
        render: (text, record, index) => {
            return <div style={{color: getFeeColor(record.state || 0)}}
                        className={css.rowBold}>-${big(record.hashrate_cost || '').toFixed(4)}</div>
        }
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => {
            // 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
            const res = ['待支付', '支付成功', '支付超时', '挖矿结束']
            return (<span className={css.rowBold}
                          style={{color: getStatusColor(record.state || 0)}}>{res[(record.state || 1) - 1]}</span>)
        },
        width: 100
    },
    Table.EXPAND_COLUMN,
];

const data: DataType[] = [];

const PaymentStatus = ({status, link, source, goodId, reBuy, record}: {
    status: number,
    link: string,
    source: string,
    goodId: string,
    record: OrderListItem,
    reBuy: (data: any) => void
}) => {
    const {Countdown} = Statistic;
    switch (status) {
        case 1:
            return (
                <div>
                    <Button type={"primary"} shape={"round"} onClick={() => reBuy(record)}>立即支付</Button>
                    <div className={cn(css.countdownWrapper)}>
                        <Countdown key={record.order_id}
                                   valueStyle={{fontSize: '12px', color: '#EA2A2A', lineHeight: '23px', height: '23px'}}
                                   value={(record?.payment_expired_at || 0) * 1000}/>
                        <div>内完成支付</div>
                    </div>
                </div>
            )
        case 2:
            return (
                <div>
                    <div style={{color: '#16C984'}}>已支付</div>
                </div>
            )
        case 3:
            return (
                <div>
                    <Button type={"primary"} shape={"round"}>
                        <Link href={`/productDetail?good_id=${goodId}`}>重新购买</Link>
                    </Button>
                    <div className={css.textAlignCenter}>
                        <span className={css.timeout}>支付超时</span>
                    </div>
                </div>
            )
        default:
            return <span>{source}</span>
    }
}


const RenderExpandData = (data: any, modal: any, contextHolder: any, onDelete: () => void, reBuy: (data: any) => void) => {
    const deleteRow = (row: OrderListItem) => {
        deleteOrder(row.order_id).then(() => {
            onDelete()
        })
    }
    const confirm = () => {
        modal.confirm({
            title: '删除订单',
            content: '您是否真的要删除订单，删除订单后将无法找回该订单？',
            okText: '我再想想',
            cancelText: '是',
            onCancel: () => deleteRow(data),
            onOk: () => console.log('ok')
        });
    };

    return (<div>
        <div className={css.rowDetail}>
            <div className={css.item}>
                <span className={css.label}>币种:</span>
                <span className={css.value}>
                   {data.good?.currency.map((item: string, index: number) => {
                       return <div key={index} style={{
                           marginRight: '4px',
                           display: 'flex',
                           width: '100%'
                       }}>{getCurrencyIcon(item)}{item}</div>
                   })}
                </span>
            </div>
            <div className={css.item}>
                <span className={css.label}>合约费用：</span>
                <span className={cn(css.smallCost, css.value)}>${big(data.hashrate_cost).toFixed(4)}</span>
            </div>
            <div className={css.item}>
                <span className={css.label}>
                    支付状态:
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
            <div className={css.item}>
                <span className={css.label}>算力：</span>
                <span className={css.value}>{data.hashrate}{data.good.unit}</span>
            </div>
            <div className={css.item}>
                <span className={css.label}>电费：</span>
                <span className={cn(css.value, css.smallCost)}>
                    ${big(data.electricity_cost).toFixed(4)}
                </span>
            </div>
            <div className={css.item}>
                {
                    data.state === 2 && (
                        <>
                            <span className={css.label}>TXID:</span>
                            <span className={css.value}><Clipboard maxTextWidth={'67px'} linkUrl={data.payment_link}
                                                                   str={data.payment_link_source}/></span>
                        </>
                    )
                }
            </div>
            <div className={css.item}>
                <span className={css.label}>算法：</span>
                <span className={css.value}>{data.good.algorithm}</span>
            </div>
            <div className={css.item}>
                <span className={css.label}>合计费用：</span>
                <span className={cn(css.totalFeeText, css.value)}>${big(data.cost).toFixed(4)}</span>
            </div>
            <div></div>
            <div className={css.item} style={{width: '600px'}}>
                <span className={css.label}>挖矿日期：</span>
                <span
                    className={css.value}>{new Date(data.start_at * 1000 || 0).toLocaleString()} - {new Date(data.end_at * 1000 || 0).toLocaleString()}</span>
            </div>
            <div className={css.delOrderBtn}>
                <Button type={"text"} icon={<DeleteOutlined/>} onClick={confirm}>删除订单</Button>
            </div>
            {
                data.state === 2 && <div style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '0'
                }}>
                    <Button type={"link"}>
                        <Link href={`/orderInfo?orderId=${data.order_id}`}>
                            订单详情 {'>'}
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
    const [currentObj, setCurrentObj] = useState<OrderListItem>({
        cost: "",
        created_at: 0,
        electricity_cost: "",
        end_at: 0,
        good: {
            algorithm: "",
            currency: [],
            daily_electricity: "",
            daily_income: "",
            description: "",
            end_at: 0,
            good_id: "",
            income: "",
            max_qty: "",
            min_qty: "",
            name: "",
            power_consumption: "",
            price: "",
            remain_qty: "",
            start_at: 0,
            step_qty: "",
            unit: ""
        },
        hashrate: "",
        hashrate_cost: "",
        order_id: "",
        payment_expired_at: 0,
        payment_link: "",
        payment_link_source: "",
        start_at: 0,
        state: 0
    })


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

    }, [setOrderList, getOrderList])
    const onDelete = () => {
        getOrderList(1, 20).then(res => {
            setOrderList(res.list);
            setPageInfo(res.pagination)
        })
    }
    const reBuy = (data: OrderListItem) => {
        setCurrentObj(data);
        console.log(data)
    }

    return <div style={{minHeight: 'calc(100vh - 232px)', paddingTop: '25px'}}>
        <Modal open={false}>
            <div>123</div>
        </Modal>
        <div className={'cal-card-big'}>
            <div className={'login-hello'}>我的订单</div>
            <Table
                // @ts-ignore
                columns={columns}
                dataSource={orderList}
                rowKey={'order_id'}
                expandable={{
                    expandedRowKeys: expandedRowKeys,
                    expandedRowRender: (record) => RenderExpandData(record, modal, contextHolder, onDelete, reBuy),
                    rowExpandable: (record) => true,
                    expandIcon: ({expanded, onExpand, record}) =>
                        <div style={{width: '30px', height: '30px', padding: '11px', cursor: 'pointer'}}
                             onClick={e => handleExpand(record)}>
                            <Image style={{
                                rotate: expanded ? '180deg' : '0deg',
                                transition: 'all 0.3s'
                            }} src={ArrowUpOutlineBlack} alt={'arrow'} width={8}/>
                        </div>
                }}
            />
        </div>
    </div>
}

export default MyOrder;