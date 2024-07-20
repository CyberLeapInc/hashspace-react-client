'use client'
import React, {useContext, useEffect, useState} from 'react';
import {CheckboxProps, message} from 'antd';
import {Button, Checkbox, type FormProps, Input, Space} from 'antd';
import {ActionType, MyContext} from "@/service/context";
import { useRouter } from 'next/navigation';
import Logo from '../../../public/logo-group.png'
import {cloudFlareSiteKey} from "@/lib/constant";
import css from './index.module.css'


import {Turnstile} from '@marsidev/react-turnstile'
import {getLoginCode, getUserInfo, login, startLogin} from "@/service/api";
import './index.css';
import Image from "next/image";
import {cn} from "@/lib/utils";
import {CodeSender} from "@/components/ui/codeSender";
import {useTranslations} from "next-intl";

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log('Success:', values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log('Failed:', errorInfo);
};

const CryptoPage: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = React.useState('')
    const [captchaRefreshKey, setCaptchaRefreshKey] = React.useState(0)
    const [email, setEmail] = React.useState('')
    const [code, setCode] = React.useState('')
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [agree, setAgree] = React.useState(false)
    const [cloudFlareToken, setCloudFlareToken] = React.useState('');
    const [step, setStep] = useState(0);
    const [sessionId, setSessionId] = useState('')
    const [totpEnabled, setTotpEnabled] = useState(false)
    const [totpCode, setTotpCode] = useState('')
    const [totpCodeErrorStatus, setTotpCodeErrorStatus] = useState(false);
    const [isFirstRegister, setIsFirstRegister] = useState(true)
    const t = useTranslations('login')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {state, dispatch} = useContext(MyContext);
    let goTo = '/'
    if (typeof window !== "undefined") {
        const searchParams = new URLSearchParams(window.location.search);
        goTo = searchParams.get('to') || '/'
    }
    const router = useRouter();

    const getEmailCode = (sessionId: string) => {
        return getLoginCode(sessionId).then(res => {
        }).catch(e => {
            if (e.details.type === 'SessionExpired') {
                messageApi.open({
                    type: 'error',
                    content: t('sessionExpired'),
                });
            }
            if (e.details.type === 'SendCodeTooFrequent') {
                messageApi.open({
                    type: 'error',
                    content:  t('sendCodeTooFrequent', {
                        left_second: e.details.left_second || 0
                    })
                });
            }
        })
    }

    const submitEmail = () => {
        startLogin(email, cloudFlareToken).then((res) => {
            console.log(res)
            setSessionId(res.session_id || '')
            setTotpEnabled(res.totp_enabled || false)
            setIsFirstRegister(Boolean(res.register))
            if (!res.register) {
                setAgree(true)
            }
            setStep(1)
        }).catch(e => {
            setStatus('no')
            setCaptchaRefreshKey(prevState => prevState+1)
            if (e.details.type === 'UserLocked') {
                messageApi.open({
                    type: 'error',
                    content: t('userLockedError'),
                });
            } else if (e.details.type === 'InvalidEmail') {
                messageApi.open({
                    type: 'error',
                    content:  t('invalidEmailError'),
                });
            } else if (e.details.type === 'InvalidCaptcha') {
                messageApi.open({
                    type: 'error',
                    content:  t('invalidCaptchaError'),
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: e.message ||  t('unknownError'),
                });
            }
        })
    }
    const onChange: CheckboxProps['onChange'] = (e) => {
        setAgree(e.target.checked)
    };


    const onVerify = () => {
        login(sessionId, code, totpCode).then(res => {
            getUserInfo().then(res => {
                dispatch({ type: ActionType.setUserInfo, payload: res });
                router.push(goTo)
            })
        }).catch(e => {
            if (e.details.type === 'SessionExpired') {
                messageApi.open({
                    type: 'error',
                    content:  t('sessionExpired'),
                });
            } else if (e.details.type === 'InvalidCode') {
                setCodeErrorStatus(true)
                messageApi.open({
                    type: 'error',
                    content:  t('emailVerificationError'),
                });
            } else if (e.details.type === 'InvalidTOTP') {
                setTotpCodeErrorStatus(true)
                messageApi.open({
                    type: 'error',
                    content:  t('googleVerificationError'),
                });
            }
        })
    }
    const onErr = () => {}

    return (
        <div className={state.isMobile ? css.mobileWrapper : css.pcWrapper}>
            {contextHolder}
            <div>
                <div className={state.isMobile? css.mobileLoginCard : css.loginCard}>
                    {
                        !state.isMobile && (
                            <div className={css.logospace}>
                                <Image width={134} className={css.logoImg} src={Logo} alt={'logo'}/>
                            </div>
                        )
                    }
                    {
                        step === 0 && (
                            <div>
                                <div className={cn(css.loginHello, state.isMobile? css.moblieLoginHello : '')}>{ t('welcomeToHashSpace')}</div>
                                <div className={css.loginSmallText}>{t('email')}</div>
                                <Input
                                    size={'large'}
                                    type={'email'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={ t('enterYourEmail')}
                                ></Input>
                                {
                                    status !== 'solved' && <Turnstile
                                        key={captchaRefreshKey}
                                        style={{
                                            marginTop: '10px',
                                            width: '160px !important'
                                        }}
                                        onError={() => setStatus('error')}
                                        onExpire={() => {
                                            setStatus('expired')
                                        }}
                                        onSuccess={(token) => {
                                            setStatus('solved')
                                            setCloudFlareToken(token)
                                        }}
                                        siteKey={cloudFlareSiteKey}
                                        options={{
                                            language: typeof window !== 'undefined' && window.localStorage?.getItem('language') === 'zh-CN' ? 'zh-CN' : 'en-US',
                                        }}
                                    />
                                }
                                <Button
                                    style={{
                                        marginTop: '40px',
                                    }}
                                    className={
                                        state.isMobile? css.fixedButton : ''
                                    }
                                    disabled={(status !== 'solved') || (email === '')} type="primary" block size={'large'}
                                    shape={'round'} onClick={() => {
                                    submitEmail()
                                }}>{ t('nextStep')}</Button>
                            </div>
                        )
                    }
                    {
                        step === 1 && (
                            <div>
                                {
                                    state.isMobile && (
                                        <div className={css.mobileHello}>{ t('welcomeToHashSpace')}</div>
                                    )
                                }
                                {
                                    !state.isMobile && (
                                        <div className={css.loginHello} style={{
                                            marginBottom: '16px'
                                        }}>{t('verification')}</div>
                                    )
                                }
                                <div style={{width: '100%'}}>
                                <div style={{
                                    marginBottom: '24px'
                                }}>
                                        <CodeSender
                                            label={t('email')}
                                            immidity={true}
                                            onError={() => {
                                                setStatus('no')
                                                setCaptchaRefreshKey(prevState => prevState+1)
                                            }}
                                            errorStatus={codeErrorStatus}
                                            value={code}
                                            onChange={(e) => {
                                                console.log(e)
                                                setCode(e)
                                                setCodeErrorStatus(false)
                                            }}
                                            onSend={() => getEmailCode(sessionId)}
                                            disabled={status !== 'solved'}
                                        />
                                        {
                                            codeErrorStatus && <div className={css.errorMessage}>{t('emailCodeError')}</div>
                                        }
                                    {
                                        !state.isMobile && (
                                            <div
                                                className={css.message}>{t('enterEmailCode', {email})}
                                            </div>
                                        )
                                    }
                                </div>
                                    {totpEnabled && (
                                        <div style={{
                                            marginBottom: '24px'
                                        }}>
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
                                                <div className={css.errorMessage}>{t('googleVerificationCodeError')}</div>
                                            }
                                            <div
                                                className={css.message}>{t('openGoogleAuthenticator')}
                                            </div>
                                        </div>
                                    )}
                                    <div className={
                                        state.isMobile? css.fixedZone : ''
                                    } style={{width: '100%'}}>
                                        {
                                            isFirstRegister && <Checkbox
                                                onChange={onChange}
                                                className={css.loginValidate}>
                                                    <span style={{marginLeft: '-3px'}}>{t('agreeToTerms')}<a href={'/user_agreement_cn.html'} target="_blank" style={{color: '#3C53FF'}} >《{t('termsOfService')}》</a>{t('and')} <a  style={{color: '#3C53FF'}} href={'/privacy_policy_cn.html'} target="_blank">《{t('privacyPolicy')}》</a></span>
                                            </Checkbox>
                                        }

                                        <Button type="primary" block size={'large'} shape={'round'}
                                                disabled={!agree || !(code.length === 6) || (totpEnabled && totpCode.length !== 6) || codeErrorStatus || totpCodeErrorStatus}
                                                style={{
                                                    height: '50px'
                                                }}
                                                onClick={() => {
                                                    onVerify()
                                                }}>{t('nextStep')}</Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>

    );
};

export default CryptoPage;
