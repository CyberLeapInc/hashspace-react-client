'use client'
import React, {useEffect, useState} from 'react';
import calAllgain from '../../../public/cal-allgain.png'
import calAllPay from '../../../public/cal-allpay.png'
import calDailyGain from '../../../public/cal-dailygain.png'
import calPayBackDay from '../../../public/cal-paybackday.png'
import calPayBackMoney from '../../../public/cal-paybackmoney.png'
import calProfit from '../../../public/cal-profit.png'
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

const calculator = () => {
    const onFormLayoutChange = (v: string) => {
        console.log(v)
    }
    return <div style={{height: 'calc(100vh - 232px)',paddingTop: '25px'}}>
        <div className={'cal-card-big'}>
            <div className={'flex-wrap'}>
                <div className={'intro'}>
                    <div className={'login-hello'}>收益挖矿计算器</div>
                    <div className={'intro-title'}>
                        <div className={'intro-single'}>
                            <span className={'intro-label'}>btc价格：</span>
                            <span className={'intro-value'}>123123</span>
                        </div>
                        <div className={'intro-single'}>
                            <span className={'intro-label'}>btc价格：</span>
                            <span className={'intro-value'}>123123</span>
                        </div>
                        <div className={'intro-single'}>
                            <span className={'intro-label'}>btc价格：</span>
                            <span className={'intro-value'}>123123</span>
                        </div>

                    </div>
                    <div className={'cal-card-list'}>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calAllgain} alt={'总收入'}></Image>
                                总收入
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calAllPay} alt={'总支出'}></Image>
                                总支出
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calProfit} alt={'净利润'}></Image>
                                净利润
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calDailyGain} alt={'每日收入'}></Image>
                                每日收入
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calPayBackDay} alt={'回本天数'}></Image>
                                回本天数
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                        <div className={'cal-card'}>
                            <div className={'cal-card-title'}>
                                <Image src={calPayBackMoney} alt={'回本币价'}></Image>
                                回本币价
                            </div>
                            <div className={'cal-card-count'}>0.00001btc</div>
                            <div className={'cal-card-info'}>123</div>
                        </div>
                    </div>
                </div>
                <div className={'divider'}></div>
                <div className={'form'}>
                    <Form
                        labelCol={{span: 6}}
                        wrapperCol={{span: 18}}
                        layout="horizontal"
                        initialValues={{size: 'large'}}
                        onValuesChange={onFormLayoutChange}
                        size={'large'}
                        style={{maxWidth: 1200, marginTop: '84px'}}
                    >
                        <Form.Item label="选择云算力">
                            <Select>
                                <Select.Option value="demo">100T</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="购买算力">
                            <Input/>
                        </Form.Item>
                        <Form.Item label="预期币价">
                            <Input/>
                        </Form.Item>
                        <div style={{
                            display: 'flex',
                            gap: '9px',
                            marginLeft: '100px',
                            marginTop: '-15px',
                            marginBottom: '20px'
                        }}>
                            <Button style={{flex: 1}} size={'small'}>40,000</Button>
                            <Button style={{flex: 1}} size={'small'}>60,000</Button>
                            <Button style={{flex: 1}} size={'small'}>100,000</Button>
                        </div>
                        <Form.Item label="预期难度">
                            <Input/>
                        </Form.Item>
                        <div style={{
                            display: 'flex',
                            gap: '9px',
                            marginLeft: '100px',
                            marginTop: '-15px',
                            marginBottom: '30px'
                        }}>
                            <Button style={{flex: 1}} size={'small'}>40,000</Button>
                            <Button style={{flex: 1}} size={'small'}>60,000</Button>
                            <Button style={{flex: 1}} size={'small'}>100,000</Button>
                        </div>
                        <Button type="primary" shape="round" size={'large'} block>
                            开始计算
                        </Button>
                    </Form>
                </div>
            </div>

        </div>
    </div>
}

export default calculator;