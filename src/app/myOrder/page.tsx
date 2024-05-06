'use client'
import React, {useEffect, useState} from 'react';
import { Table } from 'antd';
import type { TableProps } from 'antd';

import './index.css'


export interface OrderItem {
    /**
     * 总费用，例如：$120.9
     */
    cost?: string;
    /**
     * 日期
     */
    created_at?: number;
    /**
     * 电费，例如：$30
     */
    electricity_cost?: string;
    /**
     * 挖矿结束
     */
    end_at?: number;
    /**
     * 云算力合约产品详情
     */
    good?: Good;
    /**
     * 算力，如：100 T，单位为{good.unit}
     */
    hashrate?: string;
    /**
     * 合约费用，例如:  $90
     */
    hashrate_cost?: string;
    /**
     * 订单ID，如：E202323121312
     */
    order_id: string;
    /**
     * 支付到期时间
     */
    payment_expired_at?: number;
    /**
     *
     * 支付完成的跳转链接，例如：https://www.oklink.com/btc/tx/4c64c6b961308665da715258a27f70169abbc2e15783692470f893cfdece88a2
     */
    payment_transcation_id: string;
    /**
     * 挖矿开始
     */
    start_at?: number;
    /**
     * 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
     */
    state?: number;
    address?: string;
    [property: string]: any;
}

/**
 * 云算力合约产品详情
 */
export interface Good {
    algorithm: string;
    currency: string[];
    daily_electricity: string;
    daily_income: string;
    description: string;
    end_at: number;
    good_id: string;
    income: string;
    max_qty: string;
    min_qty: string;
    name: string;
    power_consumption: string;
    price: string;
    remain_qty: string;
    start_at: number;
    step_qty: string;
    unit: string;
    [property: string]: any;
}
interface DataType {
    key: string;
    name: string;
    money: string;
    address: string;
}

const list = [
        {
            "created_at": 12312313,
            "hashrate": "11000000000",
            "cost": "3000.12",
            "state": 1,
            "address": "OxFDSFSFSDFSDFSDF",
            "currency": "BTC",
            "start_at": 1232131231323,
            "end_at": 1231231321123,
            "payment_expired_at": 12321312313213,
            "electricity_cost": "100.12",
            "hashrate_cost": "2000",
            "good": {
                "name": "30天新手",
                "description": "快速开始",
                "algorithm": "SHA256",
                "currency": [
                    "BTC",
                    "DOGE"
                ],
                "start_at": 12313123213,
                "end_at": 12313123213,
                "unit": "T",
                "power_consumption": "21.3",
                "daily_electricity": "0.012",
                "daily_income": "0.00123",
                "price": "0.12",
                "min_qty": "10",
                "step_qty": "10",
                "max_qty": "1000",
                "income": "0.0123123",
                "remain_qty": "5000",
                "good_id": "NEWBEE"
            }
        }
    ];

const columns: TableProps<OrderItem>['columns'] = [
    {
        title: '订单时间',
        dataIndex: 'created_at',
    },
    {
        title: '订单ID',
        dataIndex: 'name',
    },
    {
        title: '套餐',
        dataIndex: 'good',
        render: (text, record, index) => {
            return <div>{record.good?.name}</div>
        }
    },
    {
        title: '算力',
        dataIndex: 'hashrate',
    },
    {
        title: '金额',
        dataIndex: 'hashrate_cost',
    },
    {
        title: '状态',
        dataIndex: 'state',
        render: (text, record) => {
            // 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
            const res = ['待支付', '支付成功挖矿中', '支付超时', '挖矿结束']
            return (<span>{res[(record.state || 1 )- 1]}</span>)
        }
    },
    Table.EXPAND_COLUMN,
];

const data: DataType[] = [

];

const renderExpandData= (data: any) => {
    return (<div className={'row-detail'}>
        <div>币种: {data.good?.currency}</div>
        <div>合约费用：{data.hashrate_cost}</div>
        <div>支付状态: {data.state}</div>
        <div>算力：{data.hashrate}</div>
        <div>电费: {data.electricity_cost}</div>
        <div>TXID: {data.address}</div>
        <div>计算公式：{data.currency}</div>
        <div>合计费用：{data.cost}</div>
        <div></div>
        <div>日期： {new Date(data.start_at || 0).toLocaleString()} - {new Date(data.end_at || 0).toLocaleString()}</div>
    </div>)
}


const calculator = () => {
    const onFormLayoutChange = (v: string) => {
        console.log(v)
    }
    return <div style={{minHeight: 'calc(100vh - 232px)',paddingTop: '25px'}}>
        <div className={'cal-card-big'}>
            <div className={'login-hello'}>我的订单</div>
            <Table
                columns={columns}
                dataSource={list}
                expandable={{
                    expandedRowRender: (record) => renderExpandData(record),
                    rowExpandable: (record) => true,
                    expandIcon: ({ expanded, onExpand, record }) =>
                        expanded ? (
                            <div onClick={e => onExpand(record, e)} >up</div>
                        ) : (
                            <div onClick={e => onExpand(record, e)}>down</div>
                        )
                }}
            />
        </div>
    </div>
}

export default calculator;