'use client'
import React, {useContext, useEffect, useState} from "react";
import {Button, Card, Flex, Input, message, Modal, Space} from "antd";
import DividerCus from "@/components/ui/dividerCus";
import {ActionType, MyContext} from "@/service/context";
import Image, {StaticImageData} from "next/image";
import IconBtc from "../../../public/icon-btc.png";
import IconDoge from "../../../public/icon-doge.png";
import IconLtc from "../../../public/icon-ltc.png";
import {bindAddressFinish, bindAddressStart, getTotpCode, getUserInfo} from "@/service/api";
import css from './index.module.css'
import {CodeSender} from "@/components/ui/codeSender";
import Clipboard from "@/components/Clipboard";
import KycSuccess from "../../../public/kyc-success.png";
import {useTranslations} from 'next-intl';

const styles = {
    container: {minHeight: 'calc(100vh - 232px)', paddingTop: '25px', paddingBottom: '25px'},
    label: {fontSize: '16px', fontWeight: 600, color: '#333', display: 'flex', justifyContent: 'left'},
    address: {fontSize: '16px', fontWeight: 600, color: '#333'},
    button: {height: '44px', width: '136px', fontSize: '14px'},
    mobileButton: { lineHeight: '14px', fontSize: '14px'},
    buttonContainer: {marginLeft: 'auto'}
};

const currencies = [
    {name: 'BTC', icon: IconBtc},
    {name: 'DOGE', icon: IconDoge},
    {name: 'LTC', icon: IconLtc},
];


const SetAddress = ({currency, onFinish, ogAddress = ''} : {
    currency: string,
    onFinish: (v: any) => any,
    ogAddress?: string
}) => {
    const tWalletAddress = useTranslations('walletAddress');
    const tTwoFactorAuth = useTranslations('twoFactorAuth');
    const [step, setStep] = useState(0);
    const [address, setAddress] = useState('')
    const [remark, setRemark] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [code, setCode] = useState('')
    const [totp, setTotp] = useState('')
    const {state} = useContext(MyContext);
    const [isSendCode, setIsSendCode] = useState(false)
    const [errorStatus, setErrorStatus] = useState(false)
    const [googleErrorStatus, setGoogleErrorStatus] = useState(false)
    const [loading, setLoading]= useState(false)
    const startChange = () => {
        if (!address) {
            return;
        }
        if (remark.length === 1) {
            setRemarkErrorMessage(tWalletAddress("remarkTooShort"));
            return;
        }
        setLoading(true)
        bindAddressStart(currency, remark, address).then(res => {
            if (!res.session_id) return;
            setSessionId(res.session_id);
            setStep(1)
        }).catch(e => {
            if (e?.details['@type'] && /CantChangeAddressAfterTOTPUnbind/.test(e?.details['@type'])) {
                message.error(tTwoFactorAuth("unbindWarning"))
            } else {
                message.error(e.message)
                if (e.details.type === 'InvalidAddress') {
                    setAddressErrorMessage(tWalletAddress("invalidAddress"))
                }
            }
        }).finally(() => {
            setLoading(false)
            }
        )
    }
    useEffect(() => {
        setAddressErrorMessage('')
    }, [address]);
    useEffect(() => {
        setRemarkErrorMessage('')
    }, [remark]);

    const getCode = () => {
        return getTotpCode({
            session_id: sessionId,
            scene: 2
        }).then(res => {
            setIsSendCode(true)
        }).catch(e => {
            message.error(e.message || tWalletAddress("sendFailed"))
            setIsSendCode(false)
        })
    }

    const finish = () => {
        let query: {
            code: string;
            session_id: string,
            totp?: string,
        }=  {
            code,
            session_id:sessionId,
        }
        if (state.userInfo.has_totp) {
            query.totp = totp
        }
        setLoading(true)
        bindAddressFinish(query).then(res => {
            onFinish(true)
            console.log(res)
        }).catch(e => {
            if (e?.details['@type'] && /InvalidCode/.test(e?.details['@type'])) {
                setErrorStatus(true)
            }
            if (e?.details['@type'] && /InvalidTOTP/.test(e?.details['@type'])) {
                setGoogleErrorStatus(true)
            }
            onFinish(false)
        }).finally(() => {
            setLoading(false)
            }
        )
    }

    const getMinPayment = (currency: string) => {
        const res = state.userInfo.address.find((item) => item.currency === currency);
        if (!res) return '';
        return res.f2pool_payment_threshold
    }

    const [addressErrorMessage, setAddressErrorMessage] = useState('')
    const [remarkErrorMessage, setRemarkErrorMessage] = useState('')


    // @ts-ignore
    return (<div>
        {
            step === 0 && (
                <div>
                    <div className={css.modalTitle}>{ogAddress ? tWalletAddress('changeAddressTitle') : tWalletAddress('setAddressTitle')}</div>
                    {
                        ogAddress && (
                            <div>
                                <div className={css.modalSubTitle}>{tWalletAddress('setAddressOldAddress')}</div>
                                <div><Input style={{color: '#999', backgroundColor: '#F7F7F7', borderColor: '#F7F7F7'}}
                                            className={css.myInput} disabled={true} value={ogAddress}/></div>
                            </div>
                        )
                    }
                    <div className={css.modalSubTitle}>{ogAddress ? tWalletAddress('setAddressNewAddress') : tWalletAddress('setAddressCurrentAddress')}</div>
                    <div><Input placeholder={`${tWalletAddress('pleaseSetNew')}${currency}${tWalletAddress('address')}`} className={css.myInput}
                                onChange={(v) => setAddress(v.target.value)}/></div>
                    <div className={css.errorMessage}>{addressErrorMessage}</div>
                    <div className={css.modalSubTitle}>{tWalletAddress('setAddressRemark')}</div>
                    <div><Input placeholder={tWalletAddress('setAddressEnterRemark')} minLength={2} maxLength={20} className={css.myInput}
                                onChange={(v) => setRemark(v.target.value)}/></div>
                    <div className={css.errorMessage}>{remarkErrorMessage}</div>
                    <div className={css.tip}>
                        <div style={{margin: '20px 0 8px'}}>{tWalletAddress('setAddressTips')}</div>
                        <div>1. {tWalletAddress('setAddressMinimumPayment')}{getMinPayment(currency)}{currency}。</div>
                        <div>2. {tWalletAddress('setAddressAddressChange')}</div>
                        <div>3. {tWalletAddress('setAddressPayment')}</div>
                    </div>
                    <Button loading={loading} disabled={loading || !address || Boolean(remarkErrorMessage) || Boolean(addressErrorMessage)} shape={"round"} block size={"large"} type={"primary"}
                            onClick={() => startChange()}>{tWalletAddress('setAddressNext')}</Button>

                </div>
            )
        }
        {
            step === 1 && (
                <div>
                    <div className={css.modalTitle}>{tWalletAddress('setAddressInputEmailCode')}</div>
                    <div className={css.bigTip}>{tWalletAddress('setAddressEmailCodeTipFront')} {state.userInfo.email} {tWalletAddress('setAddressEmailCodeTipAfter')}</div>
                    <div className={css.modalSubTitle}>
                        <CodeSender label={tWalletAddress('setAddressEmailCode')} immidity={true} disabled={false} value={code} onSend={getCode}
                                    onChange={(v) => {
                                        setCode(v)
                                        setErrorStatus(false)
                                    }} onError={() => setErrorStatus(true)}/>
                        {
                            errorStatus && <div className={css.errorMessage}>{tWalletAddress('setAddressEmailCodeWrong')}</div>
                        }

                    </div>
                    {
                        state.userInfo.has_totp && (
                            <div>
                                <div className={css.modalSubTitle}>{tWalletAddress('setAddressGoogleCode')}</div>
                                <div><Input maxLength={6} onChange={(v) => {
                                    setTotp(v.target.value)
                                    setGoogleErrorStatus(false)
                                }} className={css.myInput}/></div>
                                {
                                    googleErrorStatus && <div className={css.errorMessage}>{tWalletAddress('setGoogleAddressEmailCodeWrong')}</div>
                                }
                            </div>
                        )
                    }
                    <Button  loading={loading} disabled={loading} style={{marginTop: '32px'}} shape={"round"} block size={"large"} type={"primary"}
                            onClick={() => finish()}>{tWalletAddress('setAddressConfirm')}</Button>
                </div>
            )
        }
    </div>)
}

const SuccessContent = ({location,currency, onCountDownFinish} : {
    location: string,
    currency: string,
    onCountDownFinish: () => void
}) => {
    const t = useTranslations('walletAddress');
    const [countdown, setCountdown] = useState(5); // 倒计时5秒

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer); // 清除定时器
        } else {
            onCountDownFinish && onCountDownFinish(); // 倒计时结束时调用
        }
    }, [countdown, onCountDownFinish]);
    return (
        <div>
            <div className={css.modalTitle} style={{textAlign:'center'}}>{t("setAddressSuccessTitle")}</div>
            <Image className={css.successImage} src={KycSuccess} alt={'kyc success'}></Image>

            <div className={css.modalSubTitle} style={{textAlign:"center", fontWeight: 600}}>
            {t("setAddressSuccessLocation")}
            </div>
            <div className={css.successLocationBar}>
                {location}
            </div>
            <Button onClick={() => onCountDownFinish()} size={"large"} shape={'round'} type={"primary"} block>{t("setAddressReturn")}{
                countdown > 0 ? ` (${countdown}S)` : ''
            }</Button>
        </div>
    )
}

const AddressCard = ({currency, icon, getAddress}: {
    currency: string,
    icon: StaticImageData,
    getAddress: (v: string) => any
}) => {
    const t = useTranslations('walletAddress');
    const addressDict = getAddress(currency);
    const [isShowBindModal, setIsShowBindModal] = useState(false)
    const [isShowBindSuccessModal, setIsShowBindSuccessModal] = useState(false)
    const [modalKey, setModalKey] = useState(0)
    const {state,dispatch} = useContext(MyContext);


    const toggleBindModal = (v: boolean) => {
        setModalKey((prevState) => prevState + 1)
        setIsShowBindModal(v)
    }
    const handleBind = (v: boolean) => {
        if (v) {
            toggleBindModal(false);
            setIsShowBindSuccessModal(true)
            getUserInfo().then(res => {
                dispatch({
                    type: ActionType.setUserInfo,
                    payload: res
                })
            }).catch((e: any) => {
                message.error(e.message || t("getUserInfoFailed"))
            })
        } else {
            message.error( t("modificationError"))
        }

    }
    const handleCountDownFinish = () => {
        setIsShowBindSuccessModal(false)
    }


    return (
        <div>
            <Modal open={isShowBindModal} width={420} footer={null} onCancel={() => toggleBindModal(false)}>
                <SetAddress ogAddress={addressDict['address']} key={modalKey} currency={currency} onFinish={handleBind}/>
            </Modal>
            <Modal open={isShowBindSuccessModal} width={420} footer={null} onCancel={() => setIsShowBindSuccessModal(false)}>
                <SuccessContent key={new Date().getTime()} currency={currency} location={addressDict['address']} onCountDownFinish={handleCountDownFinish}/>
            </Modal>
            <div className={'card-column-box-row'} style={{
                display: 'flex',
                padding: state.isMobile ? '24px 16px ' : '24px',
                alignItems: 'center'
            }}>
                <div className={'card-column-box-row-label'} style={{
                    marginRight: state.isMobile? '16px' : '24px'
                }}>
                    <Image width={58} src={icon} alt={currency}/>
                </div>
                {
                    state.isMobile && <div className={css.mobileContent}>
                        <div style={styles.label}><span style={{
                            width: state.isMobile ? '' : '180px',
                            fontSize: state.isMobile ? '14px' : '16px'
                        }}>{currency}</span>
                            <span
                                className={state.isMobile ? css.remarkMobile : css.remark}
                                style={{ color: addressDict['remark'] ? '#333' : '#999999'}}>
                                {addressDict['remark'] || t("noRemarks")}
                            </span>
                        </div>
                        <div style={styles.address}>
                            {addressDict['address'] && <Clipboard noBg={true} str={addressDict['address']}
                                                                  maxTextWidth={state.isMobile ? '150px' : ''}/>}
                        </div>
                    </div>
                }
                {
                    !state.isMobile && <div className={css.content}>
                        <div style={styles.label}>
                            <span style={{
                            width: '132px',
                            fontSize: '16px'
                        }}>{currency}</span>

                        </div>
                        <div style={styles.address}>
                            <span className={css.remark} style={{
                                color: addressDict['remark'] ? '#333' : '#999999',
                            }}>
                                {addressDict['remark'] || t("noRemarks")}
                            </span>
                            {addressDict['address'] && <Clipboard
                                style={{
                                    fontSize:'16px',
                                }}
                                wrapperStyle={{
                                    margin: '0',
                                    height: '22px',
                                    lineHeight: '22px'
                                }}
                                noBg={true}
                                str={addressDict['address']}
                                maxTextWidth={state.isMobile ? '150px' : ''}/>
                            }
                        </div>
                    </div>
                }

                <div style={styles.buttonContainer}>
                    {
                        addressDict['address'] ?
                            <Button shape={"round"} type={"text"}
                                    style={state.isMobile ? styles.mobileButton : styles.button}
                                    onClick={() => setIsShowBindModal(true)}>{t("addressCardChange")}</Button> :
                            <Button shape={"round"} type={"primary"}
                                    style={state.isMobile ? styles.mobileButton : styles.button}
                                    onClick={() => setIsShowBindModal(true)}>{t("addressCardBind")}</Button>
                    }
                </div>
            </div>
        </div>
    )
}

const WalletAddress = () => {
    const t = useTranslations('walletAddress');
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
        <div style={{
            ...styles.container,
            padding: state.isMobile ? '20px 16px' : '25px 0'
        }}>
            <div className={'container-my'}>
                <Space size={"middle"} direction={"vertical"} style={{display: 'flex'}}>
                    <Card>
                        <div className={'card-column-box-title'}>
                        {t("walletAddressTitle")}
                        </div>
                        <Flex vertical={true} className={'card-column-box'}>
                            {currencies.map((currency, index) =>
                                <>
                                    <AddressCard
                                        key={currency.name}
                                        currency={currency.name}
                                        icon={currency.icon}
                                        getAddress={getAddressDict}
                                    />
                                    {
                                        (index+1) !== currencies.length && <DividerCus />
                                    }
                                </>
                            )}
                        </Flex>
                    </Card>
                </Space>
            </div>
        </div>
    ): null
}

export default WalletAddress;
