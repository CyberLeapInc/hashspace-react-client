'use client'
import React, {useEffect, useState} from 'react';
import calAllgain from '../../../public/cal-allgain.png'
import calAllPay from '../../../public/cal-allpay.png'
import calDailyGain from '../../../public/cal-dailygain.png'
import calPayBackDay from '../../../public/cal-paybackday.png'
import calPayBackMoney from '../../../public/cal-paybackmoney.png'
import calProfit from '../../../public/cal-profit.png'
import ReactDOM from 'react-dom';
import { Table } from 'antd';
import dynamic from 'next/dynamic';
import type { TableProps } from 'antd';

// import { Area } from '@ant-design/plots';
const Area = dynamic(() => import('@ant-design/plots').then(({ Area }) => Area), {
    ssr: false
})
import Image from "next/image";
import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TreeSelect,
} from 'antd';

import './index.css'
interface DataType {
    key: string;
    name: string;
    money: string;
    address: string;
}

const columns: TableProps<DataType>['columns'] = [
    {
        title: '日期',
        dataIndex: 'name',
    },
    {
        title: '理论算力',
        dataIndex: 'name',
    },
    {
        title: '实际算力',
        dataIndex: 'name',
    },
    {
        title: '算力达标率',
        dataIndex: 'name',
    },
    {
        title: '昨日收益',
        dataIndex: 'name',
    },
    {
        title: '状态',
        dataIndex: 'name',
    },
];

const data: DataType[] = [

];
const DemoArea = () => {
    const config = {
        data: {
            type: 'fetch',
            value: 'https://assets.antv.antgroup.com/g2/aapl.json',
        },
        xField: (d: any) => new Date(d.date),
        yField: 'close',
    };

    return <Area height={280} width={410} {...config} />;
};


const calculator = () => {
    const onFormLayoutChange = (v: string) => {
        console.log(v)
    }
    return (<div style={{minHeight: 'calc(100vh - 232px)',paddingTop: '25px'}}>
        <div className={'cal-card-big'}>
            <div className={'flex-wrap'}>
                <div className={'intro'}>
                    <div className={'login-hello'}>算力数据</div>
                    <div className={'cal-card-list'}>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calAllgain} alt={'总收入'}></Image>
                                实时交付算力
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calAllPay} alt={'总支出'}></Image>
                                昨日交付算力
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calProfit} alt={'净利润'}></Image>
                                昨日电费
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calDailyGain} alt={'每日收入'}></Image>
                                昨日收益
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calPayBackDay} alt={'回本天数'}></Image>
                                总收益
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calPayBackMoney} alt={'回本币价'}></Image>
                                今日已挖预估
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                    </div>
                </div>
                <div className={'divider'}></div>
                <div className={'form'}>
                    <div className={'login-hello'} style={{display: 'flex', justifyContent: 'space-between'}}>算力数据
                        <Button shape={'round'} type={"primary"}>矿池观察者连接</Button>
                    </div>
                    <DemoArea/>
                </div>
            </div>

        </div>
        <div className={'cal-card-big'}>
            <div className={'login-hello'}>收益明细</div>
            <Table
                columns={columns}
                dataSource={data}
                bordered
            />
        </div>
    </div>
    )
}

export default calculator;