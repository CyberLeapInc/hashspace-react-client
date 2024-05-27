'use client'
import React, {useState} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import './index.css'
import {Button} from "@/components/ui/button";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {getProductList, GoodListItem} from "@/service/api";
import big from 'big.js';
import Link from "next/link";
import SoldOut from '../../../public/soldOut.png'
import Image from "next/image";

// @ts-ignore
const Card = function ({data}: {data: GoodListItem}) {
    return (
        <div className="card-single">
            <div className="card-single-top">
                <div className={'card-single-top-a'}>{data.name}</div>
                <div className={'card-single-top-b'}>$ {(data.price||'').slice(0, 4)}/{data.unit}</div>
                <div className={'card-single-top-c'}>{data.description}</div>
            </div>
            <div className="card-single-bottom">
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">算法</div>
                    <div className="card-single-bottom-value">{data.algorithm}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">挖矿日期</div>
                    <div className="card-single-bottom-value">{new Date(data.start_at * 1000 || 0).toLocaleDateString()} - {new Date(data.end_at * 1000 || 0).toLocaleDateString()}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">功耗</div>
                    <div className="card-single-bottom-value">{new big(data.power_consumption || 0).toFixed(2)}J/{data.unit}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日电费</div>
                    <div className="card-single-bottom-value">${new big(data.daily_electricity || 0).toFixed(8)}/{data.unit}/D</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日收益</div>
                    <div className="card-single-bottom-value">${new big(data.daily_income || 0).toFixed(8)}/{data.unit}/D</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">最小购买数量</div>
                    <div className="card-single-bottom-value">{new big(data['max_qty'] || 0).toFixed(2)}{data.unit}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">预期收益</div>
                    <div className="card-single-bottom-value">${new big((data.income|| 0)).toFixed(3)}</div>
                </div>

            </div>
            {
                Number(data.max_qty || 0) <= Number(data.min_qty || 0) && <Image src={SoldOut} alt={'soldOut'} style={{
                    height: '80px',
                    width: '80px',
                    position: 'absolute',
                    right: '40px',
                    bottom: '80px'
                }}/>
            }

            <Button
                disabled={Number(data.max_qty || 0) <= Number(data.min_qty || 0)}
                className={
                'round-primary-button button-286'
            }><Link href={`productDetail?good_id=${data.good_id}`}>立即下单</Link></Button>
        </div>
    )
}

export default function ProductList() {
    const [list, setList] = useState<Array<any>>([])
    const [listTwo, setListTow] = useState<Array<any>>([])

    useOnMountUnsafe(() => {
        getProductList().then(res=> {
            res.goods.map(item => {
                if (item.currency?.includes('BTC')) {
                    setList(item.list || []);
                } else {
                    setListTow(item.list || [])
                }
            })
        })
    })
    return (
        <div style={{backgroundColor: '#F6F7F8'}}>
            <div className="container-my" style={{paddingBottom: '25px'}}>
            <Tabs defaultValue="btc" className="container-tabs" onChange={(e) => {
                console.log(e.target)
            }}>
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
                            list.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card data={item} key={item.good_id}></Card>
                            })
                        }
                    </TabsContent>
                    <TabsContent value="ltc" className={'card-tabs-content'}>
                        {
                            listTwo.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card data={item} key={item.good_id}></Card>
                            })
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}