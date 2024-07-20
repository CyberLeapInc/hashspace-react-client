import React, {useContext, useState} from "react";
import {Input, Button, message} from 'antd'
import {CodeSender} from "@/components/ui/codeSender";
import {Turnstile} from "@marsidev/react-turnstile";
import {cloudFlareSiteKey} from "@/lib/constant";
import {MyContext} from "@/service/context";
import {PhoneInput} from 'react-international-phone';
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {bindPhoneFinish, bindPhoneStart, getPhoneCode, verifyCurrentCode} from "@/service/api";
import {useTranslations} from 'next-intl';
import './index.css'

export const PhoneBind = ({
                              onSuccess
                          }: {
    onSuccess: () => void
}) => {
    const t = useTranslations('phoneBind');
    const [captchaRefreshKey, setCaptchaRefreshKey] = React.useState(0)
    const {state} = useContext(MyContext)
    const [status, setStatus] = React.useState('')
    const [code, setCode] = useState('')
    const [currentCode, setCurrentCode] = useState('')
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [currentCodeErrorStatus, setCurrentCodeErrorStatus] = useState(false);
    const [phoneErrorMessage, setPhoneErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const [cloudFlareToken, setCloudFlareToken] = React.useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneCountry, setPhoneCountry] = useState('1')
    const [sessionId, setSessionId] = useState('');
    const [step, setStep] = useState(0);
    const getCode = (phoneNumber = '', phoneCountry = '', isCurrentCode = false) => {
        return getPhoneCode({
            session_id: sessionId,
            captcha: cloudFlareToken,
            phone_country_code: phoneCountry,
            phone_number: phoneNumber,
            is_current_phone: isCurrentCode
        })
    }

    useOnMountUnsafe(() => {
        bindPhoneStart().then(res => {
            setSessionId(res.session_id)
        })
    })

    const onPhoneError = (msg: string) => {
        setCurrentCodeErrorStatus(true)
        setCodeErrorStatus(true)
        setPhoneErrorMessage(msg)
    }
    const onError = (e: any) => {
        if (e.details.type === 'SessionExpired') {
            onPhoneError(t('sessionExpired'))
        } else if (e.details.type === 'InvalidCode') {
            onPhoneError(t('invalidCode'))
        } else if (e.details.type === 'NeedSendCode') {
            onPhoneError(t('needSendCode'))
        }
    }

    const onVerifyCurrentCode = () => {
        setCurrentCodeErrorStatus(false)
        setCodeErrorStatus(false)
        verifyCurrentCode(currentCode, sessionId).then(() => {
            setStep(1)
        }).catch(e => {
            onError(e)
        })
    }

    const onConfirm = () => {
        setLoading(true);
        setCurrentCodeErrorStatus(false)
        setCodeErrorStatus(false)
        bindPhoneFinish({
            session_id: sessionId,
            code,
            current_code: currentCode
        }).then(() => {
            onSuccess()
        }).catch(e => {
            onError(e)
        }).finally(() => {
            setLoading(false)
        })
    }


    return (<div>
        {
            (state.userInfo.phone_country_code && step === 0) && (
                <div style={{
                    marginTop: '16px',
                }}>
                    <div className={'login-title-text'}>{t('phoneNumber')}</div>
                    <div className={'phoneGroup phoneGroup-disable'} style={{
                        marginBottom: '14px'
                    }}>
                        <span>+</span>
                        <Input type={'number'} disabled style={{width: '40px', color: '#999'}} bordered={false}
                               size={"large"} maxLength={2}
                               value={state.userInfo.phone_country_code}/>
                        <Input type={'number'} disabled size={"large"} bordered={false}
                               style={{width: '80%', color: '#999'}}
                               value={state.userInfo.phone_number}/>
                    </div>
                    <CodeSender
                        onError={() => {
                            setStatus('no')
                            setCaptchaRefreshKey(prevState => prevState + 1)
                        }}
                        errorStatus={currentCodeErrorStatus}
                        value={currentCode}
                        onChange={(e) => {
                            setCurrentCodeErrorStatus(false)
                            setCurrentCode(e)
                        }}
                        onSend={() => getCode(
                            state.userInfo.phone_number,
                            state.userInfo.phone_country_code,
                            true,
                        )}
                        disabled={false}
                    />
                    {
                        currentCodeErrorStatus && <div className={'errorMessage'}>{phoneErrorMessage}</div>
                    }
                    <Button
                        type="primary" block size={'large'} shape={'round'}
                        style={{
                            height: '50px',
                            marginTop: '40px'
                        }}
                        disabled={!(currentCode.length === 6 && !currentCodeErrorStatus)}
                        onClick={onVerifyCurrentCode}
                    >{t('nextStep')}</Button>
                </div>

            )
        }
        {
            ((state.userInfo.phone_country_code && step === 1) || (!state.userInfo.phone_country_code)) && (
                <>
                    <div style={{
                        marginTop: '17px',
                        marginBottom: '17px'
                    }}>
                        <div className={'login-title-text'}>{
                            state.userInfo.has_phone ?  t('newPhoneNumber') : t('phoneNumber')
                        }</div>
                        <PhoneInput
                            style={{
                                display: 'flex'
                            }}
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={(e, x) => {
                                setPhoneCountry(x.country.dialCode)
                                setPhoneNumber(e)
                            }}/>
                    </div>

                    <CodeSender
                        onError={() => {
                            setStatus('no')
                            setCaptchaRefreshKey(prevState => prevState + 1)
                        }}
                        errorStatus={codeErrorStatus}
                        label={
                            state.userInfo.has_phone ? t('newPhoneNumber') : t('verificationCode')
                        }
                        value={code}
                        onChange={(e) => {
                            setCode(e)
                            setCodeErrorStatus(false)
                        }}
                        onSend={() => getCode(
                            phoneNumber.replace(phoneCountry, "").replace('+', ''),
                            phoneCountry,
                        )}
                        disabled={status !== 'solved' || !phoneNumber.replace(phoneCountry, "").replace('+', '') || !phoneCountry}
                    />
                    {
                        codeErrorStatus && <div className={'errorMessage'}>{phoneErrorMessage}</div>
                    }
                    {
                        status !== 'solved' && <Turnstile
                            onError={() => setStatus('error')}
                            onExpire={() => {
                                setStatus('expired')
                            }}
                            style={{
                                marginTop: '20px'
                            }}
                            onSuccess={(token) => {
                                setStatus('solved')
                                setCloudFlareToken(token)
                            }}
                            siteKey={cloudFlareSiteKey}
                            key={captchaRefreshKey}
                        />
                    }
                    <Button
                        type="primary" block size={'large'} shape={'round'}
                        style={{
                            height: '50px',
                            marginTop: status === 'solved' ? '40px' : '20px'
                        }}
                        disabled={!(code.length === 6 && !codeErrorStatus && !loading) || (state.userInfo.has_phone && currentCode.length !== 6 && currentCodeErrorStatus)}
                        onClick={onConfirm}
                        loading={loading}
                    >{t('confirmBind')}</Button>
                </>
            )
        }
    </div>)
}