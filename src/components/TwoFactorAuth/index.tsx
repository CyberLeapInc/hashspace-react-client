import react, {useContext, useEffect, useState} from 'react';

import './index.css'
import React from "react";
import {Alert, Button, Input, message} from "antd";
import {finishTotp, getTotpCode, startTotp, unbindTotpFinish, unbindTotpStart} from "@/service/api";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {QRCodeSVG} from "qrcode.react";
import {MyContext} from "@/service/context";
import Clipboard from "@/components/Clipboard";
import {QRCode} from "antd";
import {CodeSender} from "@/components/ui/codeSender";
import css from "@/app/login/index.module.css";
import {useTranslations} from 'next-intl';

export const TwoFactorAuth = ({ onSuccess } : { onSuccess: () => void }) => {
    const t = useTranslations('twoFactorAuth');
    const {state} = useContext(MyContext);
    const [code, setCode] = useState('')
    const [googleCode, setGoogleCode] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [secret, setSecret] = useState('');
    const [qrcodeUrl, setQrcodUrl] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [totpCodeErrorStatus, setTotpCodeErrorStatus] = useState(false);
    const [loading, setLoading] = useState(false)

    const getEmailCode = (sessionId: string) => {
        return getTotpCode({
            session_id: sessionId,
            scene: 1
        }).then(res => {
            console.log(res)
        })
    }

    useOnMountUnsafe(() => {
        startTotp().then(res => {
            setSessionId(res.session_id);
            setSecret(res.secret);
            setQrcodUrl(res.qrcode_url);
            console.log(res);
        })
    })

    const onConfirm = () => {
        setLoading(true)
        finishTotp({
            code,
            session_id: sessionId,
            totp: googleCode
        }).then(_ => {
            console.log(_)
            onSuccess();
        }).catch(e => {
            if (e.details.type === 'SendCodeTooFrequent') {
                messageApi.open({
                    type: 'error',
                    content: t('tryAgainLater'),
                });
            } else {
                let errMessage = ''
                if (e.details.type === 'InvalidCode') {
                    setCodeErrorStatus(true)
                    errMessage = t('emailCodeError')
                }
                if (e.details.type === 'InvalidTOTP') {
                    setTotpCodeErrorStatus(true)
                    errMessage = t('googleCodeError')
                }
                messageApi.open({
                    type: 'error',
                    content: errMessage,
                });
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    return <div style={{fontSize: state.isMobile? '12px' : '14px', width: state.isMobile? '100%' : '100%', display: 'flex', gap: state.isMobile? '0' : '30px', flexDirection: state.isMobile? 'column' : 'row'}}>
        {contextHolder}
        <div style={{flex: 1}}>
            <div className={'step-row'}>
                <div className={'step-index-wrapper'}>
                    <div className={'step-index'}>1</div>
                </div>
                <div className={'step-intro'}>
                    {t('step1')}</div>
            </div>
            <div className={'step-row'}>
                <div className={'step-index-wrapper'}>
                    <div className={'step-index'}>2</div>
                </div>
                <div className={'step-intro'}>
                    <div>{t('step2')}</div>
                    <div>
                        <QRCode style={{margin: '10px 0 10px'}} size={161} value={qrcodeUrl}/>
                    </div>
                    <div style={{
                        marginBottom: '-5px'
                    }}>{t('orEnterKey')}
                    </div>
                    <div style={{fontWeight: "bold"}}>
                        <Clipboard noBg={true}
                                   wrapperStyle={{
                                       justifyContent: 'start',
                                       height:'24px',
                                       alignItems: 'center',
                                       marginTop: '10px',
                                       paddingLeft: '0',
                                       cursor: 'pointer'
                                   }}
                                   style={{
                            fontSize: state.isMobile ? '12px' : '14px',
                        }} str={secret}/>
                    </div>
                </div>

            </div>
        </div>
        <div style={{flex: 1}}>
            <div className={'step-row'}>
                <div className={'step-index-wrapper'}>
                    <div className={'step-index'}>3</div>
                </div>
                <div className={'step-intro'}>
                    <div>
                    {t('step3')}
                    </div>
                </div>
            </div>
            <div style={{
                marginLeft: state.isMobile ? '0' : '40px',
                marginTop: '10px'
            }}>
            {
                    sessionId && <CodeSender
                        immidity={false}
                        onError={() => {
                            setCodeErrorStatus(true)
                        }}
                        errorStatus={codeErrorStatus}
                        value={code}
                        onChange={(e) => {
                            console.log(e)
                            setCode(e)
                            setCodeErrorStatus(false)
                        }}
                        onSend={() => getEmailCode(sessionId)}
                        disabled={false}
                        label={t('emailVerificationCode')}
                    />
                }
                {
                    codeErrorStatus && <div className={'errorMessage'}>{t('emailCodeError')}</div>
                }
                <div>
                    <div className={'login-title-text'} style={{
                        marginTop: '24px',
                        lineHeight: '24px',
                        marginBottom: '8px'
                    }}>{t('googleVerificationCode')}</div>
                </div>
                <Input
                    style={{
                        height: '50px'
                    }}
                    status={totpCodeErrorStatus ? 'error' : ''}
                    maxLength={6}
                    type={'text'}
                    value={googleCode}
                    size={'large'}
                    onChange={(e) => {
                        setGoogleCode(e.target.value)
                        setTotpCodeErrorStatus(false)
                    }}
                    placeholder={t('enterCode')}
                ></Input>
                {
                    totpCodeErrorStatus && <div className={'errorMessage'}>{t('googleCodeError')}</div>
                }
                <Button
                    type="primary" block size={'large'} shape={'round'}
                    style={{
                        marginTop: '40px'
                    }}
                    disabled={!(code.length === 6 && googleCode.length === 6 && !codeErrorStatus && !totpCodeErrorStatus && !loading)}
                    onClick={onConfirm}
                    loading={loading}
                >{t('confirmBind')}</Button>
            </div>
        </div>
    </div>

}

export const UnbindTowFactorAuth = ({onSuccess}: { onSuccess: () => void }) => {
    const t = useTranslations('twoFactorAuth');
    const {state} = useContext(MyContext);
    const [code, setCode] = useState('')
    const [totpCode, setTotpCode] = useState('')

    const [totpCodeErrorStatus, setTotpCodeErrorStatus] = useState(false);

    const [sessionId, setSessionId] = useState('')
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)
    const getEmailCode = (sessionId: string) => {
        return getTotpCode({
            session_id: sessionId,
            scene: 3
        }).then(res => {
            console.log(res)
        })
    }
    const onConfirm = () => {
        setLoading(true)
        unbindTotpFinish({
            code: code,
            session_id: sessionId,
            totp: totpCode
        }).then(_ => {
            onSuccess()
        }).catch(e => {
            messageApi.open({
                type: 'error',
                content: e.message,
            });
            if (e.details.type === 'InvalidTOTP') {
                setTotpCodeErrorStatus(true)
            } else {
                setCodeErrorStatus(true)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    useOnMountUnsafe(() => {
        unbindTotpStart().then(res => {
            setSessionId(res.session_id);
        })
    })


    return (<div>
        <div className={'step-danger'}>{t('unbindWarning')}</div>
        <div className={'step-info'}>{t('verificationCodeTip')}{state.userInfo.email}</div>
        {
            sessionId && <CodeSender
            label={t('setAddressEmailCode')}
                immidity={false}
                onError={() => {
                    setCodeErrorStatus(true)
                }}
                errorStatus={codeErrorStatus}
                value={code}
                onChange={(e) => {
                    console.log(e)
                    setCode(e)
                    setCodeErrorStatus(false)
                }}
                onSend={() => getEmailCode(sessionId)}
                disabled={false}
            />
        }
        {
            codeErrorStatus && <div className={'errorMessage'}>{t('emailCodeError')}</div>
        }
        <div>
            <div className={css.loginTitleText}>{t('googleVerificationCode')}</div>
            <Input
                status={totpCodeErrorStatus ? 'error' : ''}
                maxLength={6}
                type={'text'}
                value={totpCode}
                size={'large'}
                onChange={(e) => {
                    setTotpCode(e.target.value)
                    setTotpCodeErrorStatus(false)
                }}
                allowClear
                placeholder={t('enterGoogleVerificationCode')}
            ></Input>
            {
                totpCodeErrorStatus &&
                <div className={css.errorMessage}>{t('googleCodeError')}</div>
            }
            <div
                className={css.message}>{t('openGoogleAuthenticator')}
            </div>
        </div>
        <Button
            type="primary" block size={'large'} shape={'round'}
            style={{
                marginTop: '40px'
            }}
            disabled={!(code.length === 6 && !loading && !codeErrorStatus && !totpCodeErrorStatus && totpCode.length === 6)}
            loading={loading}
            onClick={onConfirm}
        >{t('confirm')}</Button>
    </div>)
}