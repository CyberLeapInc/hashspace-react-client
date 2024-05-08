'use client'
import React, {useContext, useEffect, useState} from "react";
import {Table, Button, Card, Flex, Space} from "antd";
import {MyContext} from "@/service/context";
import IconGoogle from '../../../public/icon-google.png'
import IconPhone from '../../../public/icon-phone.png'
import DividerCus from "@/components/ui/dividerCus";

import './index.css'
import Image from "next/image";
import {cn} from "@/lib/utils";
import {getLoginHistory, LoginHistoryItem} from "@/service/api";



const Tips = ({text = '', type=''}) => {
    return (
        <span className={cn('tips-cus', `tips-cus-${type}`)}>{text}</span>
    )
}

const columns = [
    {
        title: '时间(UTC)',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        render: (v: number) => {
            return <div>{new Date(v * 1000).toLocaleDateString()} {new Date(v * 1000).toLocaleTimeString() }</div>
        }
    },
    {
        title: '登录方式',
        dataIndex: 'user_agent',
        key: 'user_agent',
    },
    {
        title: 'IP',
        dataIndex: 'ip',
        key: 'ip',
    },
    {
        title: '位置',
        dataIndex: 'location',
        key: 'location',
    },
];

const SecurityCenter = () => {
    const {state} = useContext(MyContext);
    let [list, setList] = useState<LoginHistoryItem[]>([])
    useEffect(() => {
        getLoginHistory().then(res => {
            setList(res.list)
        })
    },[])
    return <div style={{minHeight: 'calc(100vh - 232px)',paddingTop: '25px',paddingBottom: '25px'}}>
        {state.userInfo.email && <div className={'container-my'}>
            <Space size={"middle"} direction={"vertical"} style={{display: 'flex'}}>
                <Card bordered={false}>
                    <div className={'card-column-box-title'}>
                        账号安全
                    </div>
                    <Flex vertical={true} className={'card-column-box'}>
                        <div className={'card-column-box-row'}>
                            <div className={'card-column-box-row-label'}>UID</div>
                            <div className={'card-column-box-row-content'}>{state.userInfo.uid}</div>
                        </div>
                        <DividerCus/>
                        <div className={'card-column-box-row'}>
                            <div className={'card-column-box-row-label'}>注册日期</div>
                            <div
                                className={'card-column-box-row-content'}>{new Date(state.userInfo.created_at * 1000).toLocaleDateString()}</div>
                        </div>
                        <DividerCus/>
                        <div className={'card-column-box-row'}>
                            <div className={'card-column-box-row-label'}>邮箱账号</div>
                            <div className={'card-column-box-row-content'}>{state.userInfo.email}</div>
                        </div>
                    </Flex>
                </Card>
                <Card>
                    <div className={'card-column-box-title'}>
                        安全验证
                    </div>
                    <Flex vertical={true} className={'card-column-box'}>
                        <div className={'card-column-box-row'}>
                            <div className={'card-column-box-row-label'}>
                                <Image width={58} src={IconGoogle} alt={'google'}/>
                            </div>
                            <Flex vertical={true} className={'card-column-box-row-content'}>
                                <Flex style={{verticalAlign: 'middle'}}>Google验证
                                    <Tips text={state.userInfo.has_totp ? '已绑定' : '未绑定'}
                                          type={state.userInfo.has_totp ? 'success' : 'danger'}/>
                                </Flex>
                                <DividerCus margin={6} visible={false}></DividerCus>
                                <div>保护你的账户安全</div>
                            </Flex>
                            <div style={{marginLeft: 'auto', paddingTop: '7px'}}>
                                {
                                    state.userInfo.has_totp ? <Button shape={"round"} type={"text"} style={{
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
                                <Image width={58} src={IconPhone} alt={'google'}/>
                            </div>
                            <Flex vertical={true} className={'card-column-box-row-content'}>
                                <Flex style={{verticalAlign: 'middle'}}>手机
                                    <Tips text={state.userInfo.phone_number ? '已绑定' : '未绑定'}
                                          type={state.userInfo.phone_number ? 'success' : 'danger'}/>
                                </Flex>
                                <DividerCus margin={6} visible={false}></DividerCus>
                                <div>保护你的账户安全</div>
                            </Flex>
                            <div style={{marginLeft: 'auto', paddingTop: '7px'}}>
                                {
                                    state.userInfo.phone_number ? <Button shape={"round"} type={"text"} style={{
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
                <Card>
                    <div className={'card-column-box-title'}>
                        登录历史
                    </div>
                    <Table
                        rowKey={'created_at'}
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                    ></Table>
                </Card>

            </Space>
        </div>}
    </div>
}

export default SecurityCenter;