'use client'
import React, {useContext, useState} from "react";
import {Button, Card, Flex, Input, message, Modal, Space} from "antd";
import DividerCus from "@/components/ui/dividerCus";
import {ActionType, MyContext} from "@/service/context";
import Image, {StaticImageData} from "next/image";
import IconBtc from "../../../public/icon-btc.png";
import IconDoge from "../../../public/icon-doge.png";
import IconLtc from "../../../public/icon-ltc.png";
import {bindAddressFinish, bindAddressStart, bindPhoneFinish, getTotpCode, getUserInfo} from "@/service/api";
import css from './index.module.css'
import {CodeSender} from "@/components/ui/codeSender";
import Clipboard from "@/components/Clipboard";

const styles = {
    container: {minHeight: 'calc(100vh - 232px)', paddingTop: '25px', paddingBottom: '25px'},
    label: {fontSize: '16px', fontWeight: 600, color: '#333', width: '100px'},
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
    const [step, setStep] = useState(0);
    const [address, setAddress] = useState('')
    const [remark, setRemark] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [code, setCode] = useState('')
    const [totp, setTotp] = useState('')
    const {state} = useContext(MyContext);
    const [isSendCode, setIsSendCode] = useState(false)
    const startChange = () => {
        if (!address || !remark) {
            return;
        }
        bindAddressStart(currency, remark, address).then(res => {
            if (!res.session_id) return;
            setSessionId(res.session_id);
            setStep(1)
        }).catch(e => {
            message.error(e.message)
        })
    }

    const getCode = () => {
        return getTotpCode({
            session_id: sessionId,
            scene: 2
        }).then(res => {
            setIsSendCode(true)
        }).catch(e => {
            message.error(e.message || '发送失败')
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
        bindAddressFinish(query).then(res => {
            console.log(res)
        }).catch(e => {
            message.error(e.message || '绑定失败')
        }).finally(() => {
            onFinish('finish')
        })
    }

    return (<div>
        {
            step === 0 && (
                <div>
                    <div className={css.modalTitle}>{ogAddress ? '设置' : '更改'}{currency}收款地址</div>
                    {
                        ogAddress && (
                            <div>
                                <div className={css.modalSubTitle}>原地址</div>
                                <div><Input className={css.myInput} disabled={true} value={ogAddress}/></div>
                            </div>
                        )
                    }
                    <div className={css.modalSubTitle}>{ogAddress ? '新' : ''}{currency}主网地址</div>
                    <div><Input className={css.myInput} onChange={(v) => setAddress(v.target.value)}/></div>
                    <div className={css.modalSubTitle}>备注</div>
                    <div><Input className={css.myInput} onChange={(v) => setRemark(v.target.value)}/></div>
                    <div className={css.tip}>
                        <div style={{margin: '20px 0 8px'}}>温馨提示</div>
                        <div>1.云算力运行时，最小支付金额：0.005BTC。</div>
                        <div>2.云算力运行结束后，尾款最小支付金额：0.05BTC。</div>
                        <div>3.修改地址后，支付冻结48h。</div>
                    </div>
                    <Button shape={"round"} block size={"large"} type={"primary"}
                            onClick={() => startChange()}>下一步</Button>

                </div>
            )
        }
        {
            step === 1 && (
                <div>
                    <div className={css.modalTitle}>输入验证码</div>
                    <div className={css.bigTip}>请输入您在邮箱 {state.userInfo.email} 收到的6位验证码，验证码30分钟有效</div>
                    <div className={css.modalSubTitle}>
                        <CodeSender label={'邮箱验证码'} immidity={true} disabled={false} value={code} onSend={getCode} onChange={(v) => setCode(v)} onError={(e) => console.log(e)}/>
                    </div>
                    {
                        state.userInfo.has_totp && (
                            <div>
                                <div className={css.modalSubTitle}>Google Authenticator验证码</div>
                                <div><Input onChange={(v) => setTotp(v.target.value)} className={css.myInput}/></div>
                            </div>
                        )
                    }
                    <Button style={{marginTop: '40px'}} shape={"round"} block size={"large"} type={"primary"}
                            onClick={() => finish()}>确认</Button>
                </div>
            )
        }
    </div>)
}

const AddressCard = ({currency, icon, getAddress}: {
    currency: string,
    icon: StaticImageData,
    getAddress: (v: string) => any
}) => {
    const addressDict = getAddress(currency);
    const [isShowBindModal, setIsShowBindModal] = useState(false)
    const [modalKey, setModalKey] = useState(0)
    const {state,dispatch} = useContext(MyContext);


    const toggleBindModal = (v: boolean) => {
        setModalKey((prevState) => prevState + 1)
        setIsShowBindModal(v)
    }
    const handleBind = (v: any) => {
        getUserInfo().then(res => {
            dispatch({
                type: ActionType.setUserInfo,
                payload: res
            })
            toggleBindModal(false);
        }).catch((e: any) => {
            message.error(e.message || '获取用户信息失败')
        })
    }


    return (
        <div>
            <Modal open={isShowBindModal} width={420} footer={''} onCancel={() => toggleBindModal(false)}>
                <SetAddress ogAddress={addressDict['address']} key={modalKey} currency={currency} onFinish={handleBind}/>
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
                <div className={state.isMobile ? css.mobileContent : css.content}>
                    <div style={styles.label}>{currency}</div>
                    <div style={styles.address}>
                        { addressDict['address'] && <Clipboard str={addressDict['address']} maxTextWidth={state.isMobile? '150px' : ''} />}
                    </div>
                </div>
                <div style={styles.buttonContainer}>
                    {
                        addressDict['address'] ?
                            <Button shape={"round"} type={"text"} style={state.isMobile ? styles.mobileButton : styles.button} onClick={() => setIsShowBindModal(true)}>更改</Button> :
                            <Button shape={"round"} type={"primary"} style={state.isMobile ? styles.mobileButton : styles.button} onClick={() => setIsShowBindModal(true)}>绑定</Button>
                    }
                </div>
            </div>
            <DividerCus/>
        </div>
    )
}

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
        <div style={styles.container}>
            <div className={'container-my'}>
                <Space size={"middle"} direction={"vertical"} style={{display: 'flex'}}>
                    <Card>
                        <div className={'card-column-box-title'}>
                            收款地址
                        </div>
                        <Flex vertical={true} className={'card-column-box'}>
                            {currencies.map((currency) =>
                                <AddressCard
                                    key={currency.name}
                                    currency={currency.name}
                                    icon={currency.icon}
                                    getAddress={getAddressDict}
                                />
                            )}
                        </Flex>
                    </Card>
                </Space>
            </div>
        </div>
    ): null
}

export default WalletAddress;
