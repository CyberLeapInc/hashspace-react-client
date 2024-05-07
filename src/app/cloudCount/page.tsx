'use client'
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import './index.css'
import {Button} from "@/components/ui/button";

const MockData = [ {
    title: 'test title',
    summary: 'summary',
    desc: 'desc',
    type: 'SHA256(BTC)',
    date: '2000/00/00-2000/00/00',
    power: '29.5',
    powerFeePerDay: '0.0088',
    gainPerDay: '123',
    minBuy: 'n',
    profit: '2333'
},{
    title: 'test title',
    summary: 'summary',
    desc: 'desc',
    type: 'SHA256(BTC)',
    date: '2000/00/00-2000/00/00',
    power: '29.5',
    powerFeePerDay: '0.0088',
    gainPerDay: '123',
    minBuy: 'n',
    profit: '2333'
},{
    title: 'test title',
    summary: 'summary',
    desc: 'desc',
    type: 'SHA256(BTC)',
    date: '2000/00/00-2000/00/00',
    power: '29.5',
    powerFeePerDay: '0.0088',
    gainPerDay: '123',
    minBuy: 'n',
    profit: '2333'
},{
    title: 'test title',
    summary: 'summary',
    desc: 'desc',
    type: 'SHA256(BTC)',
    date: '2000/00/00-2000/00/00',
    power: '29.5',
    powerFeePerDay: '0.0088',
    gainPerDay: '123',
    minBuy: 'n',
    profit: '2333'
},]
// @ts-ignore
const Card = function ({data}) {
    return (
        <div className="card-single">
            <div className="card-single-top">
                <div className={'card-single-top-a'}>{data.title}</div>
                <div className={'card-single-top-b'}>$ {data.summary}/T</div>
                <div className={'card-single-top-c'}>{data.desc}</div>
            </div>
            <div className="card-single-bottom">
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">{data.summary}</div>
                    <div className="card-single-bottom-value">{data.type}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">挖矿日期</div>
                    <div className="card-single-bottom-value">{data.date}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">功耗</div>
                    <div className="card-single-bottom-value">{data.powerFeePerDay}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日电费</div>
                    <div className="card-single-bottom-value">{data.powerFeePerDay}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日收益</div>
                    <div className="card-single-bottom-value">{data.gainPerDay}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">最小购买数量</div>
                    <div className="card-single-bottom-value">{data.minBuy}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">预期收益</div>
                    <div className="card-single-bottom-value">{data.profit}</div>
                </div>

            </div>
            <Button className={
                'round-primary-button button-286'
            }>立即下单</Button>
        </div>
    )
}

export default function CloudCount() {
    return (
        <div style={{backgroundColor: '#F6F7F8'}}>
            <div className="container-my">
            <Tabs defaultValue="btc" className="container-tabs">
                    <div style={{
                        margin: '0 auto',
                        width: '384px',
                    }}>
                        <TabsList className="tabs-list">
                            <TabsTrigger value="btc">BTC 云算力</TabsTrigger>
                            <TabsTrigger value="ltc">LTC/DOGE 云算力</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="btc" className={'card-tabs-content'}>
                        {
                            MockData.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card data={item} key={item.type}></Card>
                            })
                        }
                    </TabsContent>
                    <TabsContent value="ltc" className={'card-tabs-content'}>
                        {
                            MockData.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card data={item} key={item.title}></Card>
                            })
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}