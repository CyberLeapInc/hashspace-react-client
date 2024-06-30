'use client'
import React, {useContext, useEffect, useState} from "react";
import {Table, Button, Card, Flex, Space, Modal} from "antd";
import {ActionType, MyContext} from "@/service/context";
import IconGoogle from '../../../public/icon-google.png'
import IconPhone from '../../../public/icon-phone.png'
import DividerCus from "@/components/ui/dividerCus";

import './index.css'
import Image from "next/image";
import {cn} from "@/lib/utils";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {getLoginHistory, getUserInfo, LoginHistoryItem, startTotp} from "@/service/api";
import {TwoFactorAuth, UnbindTowFactorAuth} from "@/components/TwoFactorAuth";
import {PhoneBind} from "@/components/PhoneBind";
import moment from "moment";



const Tips = ({text = '', type=''}) => {
    return (
        <span className={cn('tips-cus', `tips-cus-${type}`)}>{text}</span>
    )
}

const columns = [
    {
        title: '时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 200,
        render: (v: number) => {
            return <div>{moment(v * 1000).format('MM/DD/YYYY hh:mm:ss')}</div>
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



const SecurityCenter: React.FC = () => {
    const {state, dispatch} = useContext(MyContext);
    const [isModalOpen, setIsOpenModal] =  useState(false);
    const [isShowUnbindTotpModal, setIsShowUnbindTotpModal] =  useState(false);
    const [isShowBindPhone, setIsShowBindPhone] =  useState(false);
    const [isShowUnbindPhone, setIsShowUnbindPhone] =  useState(false);
    let [list, setList] = useState<LoginHistoryItem[]>([])
    let [counter, setCounter] = useState(0)
    const closeModal = () => {
        setCounter(counter + 1)
        setIsOpenModal(false)
    }
    const handleOnSuccess = () => {
        closeModal()
        getUserInfo().then(res => {
            dispatch({
                type: ActionType.setUserInfo,
                payload: res
            })
        })
    }
    const handleOnBindPhoneSuccess = () => {
        setCounter(counter+1)
        setIsShowBindPhone(false)
        getUserInfo().then(res => {
            dispatch({
                type: ActionType.setUserInfo,
                payload: res
            })
        })
    }
    const handleOnUnbindTotpSuccess =() => {
        setCounter(counter+1)
        setIsShowUnbindTotpModal(false)
        getUserInfo().then(res => {
            dispatch({
                type: ActionType.setUserInfo,
                payload: res
            })
        })
    }
    const handleBindGoogle = () => {
        if (state.userInfo.has_totp === false) {
            setIsOpenModal(true);
        } else {
            setIsShowUnbindTotpModal(true);
        }
    }
    const handleBindPhone = () => {
        if (!state.userInfo.has_phone) {
            setIsShowBindPhone(true)
        } else {
            setIsShowUnbindPhone(true);
        }
    }
    useOnMountUnsafe(() => {

        getLoginHistory().then(res => {
            setList(res.list)
        })
        return () => {}
    })
    return <div style={{minHeight: 'calc(100vh - 232px)', margin: state.isMobile? '0 16px' : '',paddingTop: '25px',paddingBottom: '25px'}}>
        {state.userInfo.email && <div className={'container-my'}>
            <Space size={"middle"} direction={"vertical"} style={{display: 'flex'}}>
                <Card bordered={false}>
                    <div className={'card-column-box-title'}>
                        账户安全
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
                                className={'card-column-box-row-content'}>{moment(state.userInfo.created_at * 1000).format('MM/DD/YYYY')}</div>
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
                            <div className={'card-column-box-row-label'} style={{
                                marginRight: state.isMobile? '8px' : '16px'
                            }}>
                                <Image width={state.isMobile ? 40 : 58} src={IconGoogle} alt={'google'}/>
                            </div>
                            <Flex vertical={true} className={'card-column-box-row-content'}>
                                <Flex style={{verticalAlign: 'middle'}}>Google验证
                                    <Tips text={state.userInfo.has_totp ? '已绑定' : '未绑定'}
                                          type={state.userInfo.has_totp ? 'success' : 'danger'}/>
                                </Flex>
                                {
                                    !state.isMobile && <DividerCus margin={6} visible={false} />
                                }
                                <div style={{fontSize: state.isMobile? '12px' : '14px', color: '#666', fontWeight: 400,}}>保护你的账户安全</div>
                            </Flex>
                            <div style={{marginLeft: 'auto', paddingTop: '8px', paddingRight: '80px'}} onClick={handleBindGoogle}>
                                {
                                    state.userInfo.has_totp ? <Button className={'cus-middle-button'} size={"large"} shape={"round"} type={"text"}>解绑</Button> : <Button className={'cus-middle-button'} size={"large"} shape={"round"} type={"primary"} >绑定</Button>
                                }

                            </div>
                        </div>
                        <DividerCus></DividerCus>
                        <div className={'card-column-box-row'}>
                            <div className={'card-column-box-row-label'} style={{
                                marginRight: state.isMobile? '8px' : '16px'
                            }}>
                                <Image width={state.isMobile ? 40 : 58} src={IconPhone} alt={'google'}/>
                            </div>
                            <Flex vertical={true} className={'card-column-box-row-content'}>
                                <Flex style={{verticalAlign: 'middle'}}>手机
                                    <Tips text={state.userInfo.phone_number ? '已绑定' : '未绑定'}
                                          type={state.userInfo.phone_number ? 'success' : 'danger'}/>
                                </Flex>
                                {
                                    !state.isMobile && <DividerCus margin={6} visible={false} />
                                }
                                <div style={{fontSize: state.isMobile? '12px' : '14px', color: '#666', fontWeight: 400}}>保护你的账户安全</div>
                            </Flex>
                            <div style={{marginLeft: 'auto', paddingTop: '8px', paddingRight: '80px'}} onClick={() => {
                                setCounter(++counter)
                                setIsShowBindPhone(true)
                            }}>
                                {
                                    state.userInfo.phone_number ? <Button className={'cus-middle-button'} size={"large"} shape={"round"} type={"text"} >换绑</Button> : <Button className={'cus-middle-button'} size={"large"} shape={"round"} type={"primary"} >绑定</Button>
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
                        scroll={{x: 850}}
                        columns={columns}
                        dataSource={list}
                        pagination={false}
                    ></Table>
                </Card>

            </Space>
        </div>}
        <Modal title={'Google验证'} open={isModalOpen} style={{maxHeight: '600px'}} width={820} onCancel={() => closeModal()} footer={''}>
            {isModalOpen && <TwoFactorAuth key={counter} onSuccess={() => handleOnSuccess()}></TwoFactorAuth>}
        </Modal>
        <Modal title={'解绑Google验证'} open={isShowUnbindTotpModal} width={420} footer={''} onCancel={() => {
            setIsShowUnbindTotpModal(false)
            setCounter(counter+1)
        }}>
            <UnbindTowFactorAuth  key={counter} onSuccess={() =>handleOnUnbindTotpSuccess()}></UnbindTowFactorAuth>
        </Modal>
        <Modal title={'绑定手机号'} open={isShowBindPhone} width={420} footer={''} onCancel={() => setIsShowBindPhone(false)}>
            <PhoneBind onSuccess={() => handleOnBindPhoneSuccess()} key={counter}></PhoneBind>
        </Modal>
    </div>
}

export default SecurityCenter;