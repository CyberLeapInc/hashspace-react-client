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
import {useTranslations} from "next-intl";


const KYC = () => {
    const t = useTranslations('kyc')
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
        lang: typeof window !== 'undefined' && window.localStorage?.getItem('language') === 'en' ? 'en' : 'zh',
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
            height: `calc(100vh - ${state.isMobile? '52px' : '240px'})`,
            backgroundColor: state.isMobile ?  "white" : ''
        }}>
             <Modal title={t('startKycVerification')} open={isModalOpen} style={{maxHeight: '600px'}} onCancel={() => closeModal()} footer={''}>
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
                            (state?.userInfo?.identity?.status === 0 || state?.userInfo?.identity?.status === 1) &&
                            <div className={'container-my'} style={{paddingTop: state.isMobile ? '38px' : '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycNewImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>{t('youHaveNotKycVerified')}</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        width: '240px',
                                        margin: '16px auto 0',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>{t('verify')}</Button>
                                </div>
                            </div>
                        }
                        {
                            state?.userInfo?.identity?.status === 2 &&
                            <div className={'container-my'} style={{paddingTop: state.isMobile ? '38px' : '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycWaitingImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>{t('kycSubmitted')}</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        width: '240px',
                                        margin: '0 auto',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>{t('verify')}</Button>
                                </div>
                            </div>
                        }
                        {
                            state?.userInfo?.identity?.status === 3 &&
                            <div className={'container-my'} style={{paddingTop: state.isMobile ? '38px' : '100px'}}>
                                <div className={'id_card'}>
                                    <Image className={'kyc-image'} src={KycNotAllowImage} alt={'kyc new'}></Image>
                                    <div className={'kyc-text'}>{t('kycFailed')}</div>
                                    <Button onClick={() => setIsModalOpen(true)} style={{
                                        fontSize: '14px',
                                        width: '240px',
                                        margin: '0 auto',
                                        display: 'block'
                                    }} shape={"round"} size={"large"} type={"primary"}>{t('verify')}</Button>
                                </div>
                            </div>
                        }
                    </>
                )
            }
            {
                state?.userInfo?.has_identity &&
                <div className={'container-my'} style={{paddingTop: state.isMobile ? '38px' : '100px'}}>
                    <div className={'id_card'}>
                        <Image className={'kyc-image'} src={KycSuccess} alt={'kyc success'}></Image>
                        <div className={'kyc-text'}>{t('kycPassed')}</div>
                    </div>
                </div>
            }


        </div>
    )
}

export default KYC