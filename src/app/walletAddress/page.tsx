'use client'
import React, {useContext, useEffect, useState} from "react";
import {Table, Button, Card, Flex, Space} from "antd";
import DividerCus from "@/components/ui/dividerCus";
import {MyContext} from "@/service/context";
import Image from "next/image";
import IconBtc from "../../../public/icon-btc.png";
import IconDoge from "../../../public/icon-doge.png";
import IconLtc from "../../../public/icon-ltc.png";


const WalletAddress = () => {
    const {state} = useContext(MyContext);
    const getAddressDict = (type: string) => {
        const defaultRes = {
            address: '',
            currency: '',
            remark: ''
        }
        if (!state || !state.userInfo || !state.userInfo.address || !state.userInfo.address.length) {
            return defaultRes
        }
        return state.userInfo.address.find((item) => {
            return item.currency === type
        }) || defaultRes
    }
    return state?.userInfo?.email ? (
        <div style={{minHeight: 'calc(100vh - 232px)',paddingTop: '25px',paddingBottom: '25px'}}>
            <div className={'container-my'}>

                <Space size={"middle"} direction={"vertical"} style={{display: 'flex'}}>
                    <Card>
                        <div className={'card-column-box-title'}>
                            收款地址
                        </div>
                        <Flex vertical={true} className={'card-column-box'}>
                            <div className={'card-column-box-row'}>
                                <div className={'card-column-box-row-label'}>
                                    <Image width={58} src={IconBtc} alt={'google'}/>
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333',
                                    width: '100px'
                                }}>BTC
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333'
                                }}>
                                    {getAddressDict('BTC')['address']}
                                </div>
                                <div style={{marginLeft: 'auto', paddingTop: '7px'}}>
                                    {
                                        getAddressDict('BTC')['address'] ? <Button shape={"round"} type={"text"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>解绑</Button> : <Button shape={"round"} type={"primary"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>绑定</Button>
                                    }

                                </div>
                            </div>
                            <DividerCus></DividerCus>
                            <div className={'card-column-box-row'}>
                                <div className={'card-column-box-row-label'}>
                                    <Image width={58} src={IconDoge} alt={'doge'}/>
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333',
                                    width: '100px'
                                }}>DOGE
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333'
                                }}>
                                    {getAddressDict('DOGE')['address']}
                                </div>
                                <div style={{marginLeft: 'auto', paddingTop: '7px'}}>
                                    {
                                        getAddressDict('DOGE')['address'] ? <Button shape={"round"} type={"text"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>解绑</Button> : <Button shape={"round"} type={"primary"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>绑定</Button>
                                    }

                                </div>
                            </div>
                            <DividerCus></DividerCus>
                            <div className={'card-column-box-row'}>
                                <div className={'card-column-box-row-label'}>
                                    <Image width={58} src={IconLtc} alt={'ltc'}/>
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333',
                                    width: '100px'
                                }}>LTC
                                </div>
                                <div style={{
                                    lineHeight: '58px',
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    color: '#333'
                                }}>
                                    {getAddressDict('LTC')['address']}
                                </div>
                                <div style={{marginLeft: 'auto', paddingTop: '7px'}}>
                                    {
                                        getAddressDict('LTC')['address'] ? <Button shape={"round"} type={"text"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>解绑</Button> : <Button shape={"round"} type={"primary"} style={{
                                            height: '44px',
                                            width: '136px',
                                            fontSize: '14px'
                                        }}>绑定</Button>
                                    }

                                </div>
                            </div>
                        </Flex>
                    </Card>
                </Space>
            </div>
        </div>
    ): null
}

export default WalletAddress;