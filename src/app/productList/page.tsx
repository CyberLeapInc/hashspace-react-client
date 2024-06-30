'use client'
import React, {useContext, useEffect, useState} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import './index.css'
import {Button} from "antd";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {getProductList, GoodListItem} from "@/service/api";
import big from 'big.js';
import Link from "next/link";
import SoldOut from '../../../public/soldOut.png'
import Image from "next/image";
import {cn, getToFixedLength} from "@/lib/utils";
import {MyContext} from "@/service/context";
import moment from "moment";
import IconList from "@/components/IconList";

// @ts-ignore
const Card = function ({data, isMobile}: {data: GoodListItem, isMobile: boolean}) {
    useEffect(() => {
        console.log(data)
    }, [data]);
    return (
        <div className={cn('card-single', isMobile? 'mobile-card-single' : '')}>
            <div className={cn('card-single-top', data.mining_currency === 'BTC' ? 'btc-bg' : 'ltc-bg')}>
                <div className={'card-single-top-a'}>
                    <div className={'bbbbb'}>{data.name}</div>
                    <div className={'card-single-top-icon-list'}>
                        <IconList list={data.currency} size={16}/>
                        {data.currency.join('&')}
                    </div>
                </div>
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
                    <div className="card-single-bottom-value">{moment((data?.start_at || 0) * 1000 || 0).format('MM/DD/YYYY')} - {moment((data?.end_at || 0) * 1000 || 0).format('MM/DD/YYYY')}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">功耗</div>
                    <div className="card-single-bottom-value">{new big(data.power_consumption || 0).toFixed(2)}J/{data.unit}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日电费</div>
                    <div className="card-single-bottom-value">${new big(data.daily_electricity || 0).toFixed(4)}/{data.unit}/D</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">每日收益</div>
                    <div className="card-single-bottom-value">${new big(data.daily_income || 0).toFixed(4)}/{data.unit}/D</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">最小购买数量</div>
                    <div className="card-single-bottom-value">{new big(data['min_qty'] || 0).toFixed(2)}{data.unit}</div>
                </div>
                <div className="card-single-bottom-row">
                    <div className="card-single-bottom-label">预期收益</div>
                    <div className="card-single-bottom-value">${new big((data.income|| 0)).toFixed(4)}</div>
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

            <Link href={`productDetail?good_id=${data.good_id}`}>
                <Button
                    disabled={Number(data.max_qty || 0) <= Number(data.min_qty || 0)}
                    className={
                        'round-primary-button button-286'
                    }>立即下单</Button>
            </Link>


        </div>
    )
}

export default function ProductList() {
    const [list, setList] = useState<Array<any>>([])
    const [listTwo, setListTow] = useState<Array<any>>([])
    const {state, dispatch} = useContext(MyContext);

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
                        maxWidth: '384px',
                        width: '77%',
                    }}>
                        <TabsList isMobile={state.isMobile} className={cn('tabs-list', state.isMobile ? 'mobile-tabs-list' : '')}>
                            <TabsTrigger isMobile={state.isMobile} value="btc">BTC 云算力</TabsTrigger>
                            <TabsTrigger isMobile={state.isMobile} value="ltc">DOGE&LTC 云算力</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="btc" className={cn('card-tabs-content',state.isMobile ? 'mobile-card-tabs-content' : '')}>
                        {
                            list.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card isMobile={state.isMobile} data={item} key={item.good_id}></Card>
                            })
                        }
                    </TabsContent>
                    <TabsContent value="ltc" className={'card-tabs-content'}>
                        {
                            listTwo.map((item) => {
                                // eslint-disable-next-line react/jsx-key
                                return <Card isMobile={state.isMobile} data={item} key={item.good_id}></Card>
                            })
                        }
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}