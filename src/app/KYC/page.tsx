'use client'
import React, {useContext, useEffect, useState} from "react";
import {ActionType, MyContext} from "@/service/context";
import {Button, Modal} from "antd";
import './index.css'
import KycNewImage from '../../../public/kyc-new.png'
import KycNotAllowImage from '../../../public/kyc-notallow.png'
import KycWaitingImage from '../../../public/kyc-waiting.png'
import KycSuccess from '../../../public/kyc-success.png'
import Image from "next/image";
import SumsubWebSdk from '@sumsub/websdk-react'
import {getKycToken, getUserInfo} from "@/service/api";

const KYC = () => {
    const {state, dispatch} = useContext(MyContext)
    const [accessToken, setAccessToken] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        state?.userInfo?.identity?.status !== 4 && state?.userInfo?.identity?.status !== -1 && getKycToken().then(res => {
            setAccessToken(res.access_token)
        })
    }, [state]);
    const accessTokenExpirationHandler = () => {
        console.log('exp')
        return Promise.resolve('1')
    }
    const config = {
        lang: 'zh'
    }
    const options = {}
    const messageHandler = (v: any) => {
        console.log(v)
    }
    const errorHandler = (v: any) => {
        console.log(v)
    }
    const closeModal = () => {
        setIsModalOpen(false)
        getUserInfo().then(res => {
            dispatch({
                type: ActionType.setUserInfo,
                payload: res
            })
        })
    }
    return (
        <div style={{
            height: 'calc(100vh - 239px)',
            backgroundColor: state.isMobile ?  "white" : ''
        }}>
             <Modal title={'开始KYC认证'} open={isModalOpen} style={{maxHeight: '600px'}} onCancel={() => closeModal()} footer={''}>
                <div style={{
                    height: '620px',
                    overflow: 'scroll'
                }}>
                    {
                        accessToken && <SumsubWebSdk
                            accessToken={accessToken}
                            expirationHandler={accessTokenExpirationHandler}
                            config={config}
                            options={options}
                            onMessage={messageHandler}
                            onError={errorHandler}
                        />
                    }
                </div>
             </Modal>
            {
                !state?.userInfo?.has_identity && (
                    <>
                        {
                            state?.userInfo?.identity?.status === 0 &&
                            <div className={'container-my'} style={{paddingTop: '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycNewImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>您未进行KYC认证</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        height: '50px',
                                        width: '240px',
                                        margin: '0 auto',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>认证</Button>
                                </div>
                            </div>
                        }
                        {
                            (state?.userInfo?.identity?.status === 1 || state?.userInfo?.identity?.status === 2) &&
                            <div className={'container-my'} style={{paddingTop: '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycWaitingImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>KYC资料已提交，预计将在24h内完成，请耐心等待</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        height: '50px',
                                        width: '240px',
                                        margin: '0 auto',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>认证</Button>
                                </div>
                            </div>
                        }
                        {
                            state?.userInfo?.identity?.status === 3 &&
                            <div className={'container-my'} style={{paddingTop: '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycNotAllowImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>抱歉您的KYC审核未通过，请重新进行认证</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        height: '50px',
                                        width: '240px',
                                        margin: '0 auto',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>认证</Button>
                                </div>
                            </div>
                        }
                    </>
                )
            }
            {
                state?.userInfo?.has_identity &&
                <div className={'container-my'} style={{paddingTop: '100px'}}>
                    <div className={'id_card'}>
                        <Image className={'kyc-image'} src={KycSuccess} alt={'kyc success'}></Image>
                        <div className={'kyc-text'}>您的KYC审核已通过</div>
                    </div>
                </div>
            }


        </div>
    )
}

export default KYC