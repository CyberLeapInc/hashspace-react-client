'use client'
import React, {useContext, useEffect, useState} from 'react';
import {CheckboxProps, message} from 'antd';
import {Button, Checkbox, type FormProps, Input, Space} from 'antd';
import {ActionType, MyContext} from "@/service/context";
import { useRouter } from 'next/navigation';
import Logo from '../../../public/logo.png'
import {cloudFlareSiteKey} from "@/lib/constant";
import css from './index.module.css'


import {Turnstile} from '@marsidev/react-turnstile'
import {getLoginCode, getUserInfo, login, startLogin} from "@/service/api";
import './index.css';
import Image from "next/image";
import {cn} from "@/lib/utils";
import {CodeSender} from "@/components/ui/codeSender";

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
                    content: '回话session过期，请刷新页面重试',
                });
            }
            if (e.details.type === 'SendCodeTooFrequent') {
                messageApi.open({
                    type: 'error',
                    content: `验证码请求过于频繁，请${e.details.left_second || 0}后重试`,
                });
            }
        })
    }

    const submitEmail = () => {
        startLogin(email, cloudFlareToken).then((res) => {
            console.log(res)
            setSessionId(res.session_id || '')
            setTotpEnabled(res.totp_enabled || false)
            setStep(1)
        }).catch(e => {
            setStatus('no')
            setCaptchaRefreshKey(prevState => prevState+1)
            if (e.details.type === 'UserLocked') {
                messageApi.open({
                    type: 'error',
                    content: '用户被锁定',
                });
            } else if (e.details.type === 'InvalidEmail') {
                messageApi.open({
                    type: 'error',
                    content: '邮箱异常，请重新输入',
                });
            } else if (e.details.type === 'InvalidCaptcha') {
                messageApi.open({
                    type: 'error',
                    content: '人机检测失败，请刷新页面重试',
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: e.message || '未知错误',
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
                    content: '回话session过期，请刷新页面重试',
                });
            } else if (e.details.type === 'InvalidCode') {
                setCodeErrorStatus(true)
                messageApi.open({
                    type: 'error',
                    content: '邮箱验证码有误',
                });
            } else if (e.details.type === 'InvalidTOTP') {
                setTotpCodeErrorStatus(true)
                messageApi.open({
                    type: 'error',
                    content: 'Google Authenticator验证码有误',
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
                                <Image className={css.logoImg} src={Logo} alt={'logo'}/>
                                Hash Space
                            </div>
                        )
                    }
                    {
                        step === 0 && (
                            <div>
                                <div className={cn(css.loginHello, state.isMobile? css.moblieLoginHello : '')}>欢迎加入 Hash Space</div>
                                <div className={css.loginSmallText}>邮箱</div>
                                <Input
                                    size={'large'}
                                    type={'email'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={'请输入您的邮箱'}
                                ></Input>
                                {
                                    status !== 'solved' && <Turnstile
                                        key={captchaRefreshKey}
                                        onError={() => setStatus('error')}
                                        onExpire={() => {
                                            setStatus('expired')
                                        }}
                                        onSuccess={(token) => {
                                            setStatus('solved')
                                            setCloudFlareToken(token)
                                        }}
                                        siteKey={cloudFlareSiteKey}
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
                                }}>下一步</Button>
                            </div>
                        )
                    }
                    {
                        step === 1 && (
                            <div>
                                <div className={css.loginHello} style={{
                                    marginBottom: '16px'
                                }}>验证</div>
                                <Space direction={"vertical"} size={"large"} style={{width: '100%'}}>
                                    <div>
                                        <CodeSender
                                            label={'邮箱'}
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
                                            codeErrorStatus && <div className={css.errorMessage}>邮箱验证码错误</div>
                                        }
                                        <div
                                            className={css.message} >请输入您在邮箱 {email} 收到的6位验证码，验证码30分钟有效
                                        </div>
                                    </div>
                                    {totpEnabled && (
                                        <div>
                                            <div className={css.loginTitleText}>Google验证码</div>
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
                                                placeholder={'请输入Google Authenticator验证码'}
                                            ></Input>
                                            {
                                                totpCodeErrorStatus &&
                                                <div className={css.errorMessage}>Google Authenticator验证码错误</div>
                                            }
                                            <div
                                                className={css.message}>请打开您的Google Authenticator，输入6位验证码
                                            </div>
                                        </div>
                                    )}
                                    <Space className={
                                        state.isMobile? css.fixedZone : ''
                                    } direction={"vertical"} size={'small'} style={{width: '100%'}}>
                                        <Checkbox onChange={onChange}
                                                  className={css.loginValidate}>
                                            <span style={{marginLeft: '-3px'}}>创建账户即表示我同意Hash Space的<a href="">《服务条款》</a>和 <a href="">《隐私政策》</a></span>
                                        </Checkbox>
                                        <Button type="primary" block size={'large'} shape={'round'}
                                                disabled={!agree || !(code.length === 6) || (totpEnabled && totpCode.length !== 6) || codeErrorStatus || totpCodeErrorStatus}
                                                style={{
                                                    height: '50px'
                                                }}
                                                onClick={() => {
                                                    onVerify()
                                                }}>下一步</Button>
                                    </Space>
                                </Space>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>

    );
};

export default CryptoPage;
