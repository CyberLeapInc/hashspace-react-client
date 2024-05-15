'use client'
import React, {useContext, useEffect, useState} from 'react';
import {CheckboxProps, message} from 'antd';
import {Button, Checkbox, type FormProps, Input, Space} from 'antd';
import {ActionType, MyContext} from "@/service/context";
import { useRouter } from 'next/navigation';
import Logo from '../../../public/logo.png'
import {cloudFlareSiteKey} from "@/lib/constant";


import {Turnstile} from '@marsidev/react-turnstile'
import {getLoginCode, getUserInfo, login, startLogin} from "@/service/api";
import './index.css';
import Image from "next/image";

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
    'use client'
    const [messageApi, contextHolder] = message.useMessage();
    const [status, setStatus] = React.useState('')
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

    const submitEmail = () => {
        startLogin(email, cloudFlareToken).then((res) => {
            console.log(res)
            setSessionId(res.session_id || '')
            setTotpEnabled(res.totp_enabled || false)
            getLoginCode(res.session_id).then(res => {
                setStep(1)
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
        }).catch(e => {
            if (e.details.type === 'UserLocked') {
                messageApi.open({
                    type: 'error',
                    content: '用户被锁定',
                });
            }
            if (e.details.type === 'InvalidEmail') {
                messageApi.open({
                    type: 'error',
                    content: '邮箱异常，请重新输入',
                });
            }
            if (e.details.type === 'InvalidCaptcha') {
                messageApi.open({
                    type: 'error',
                    content: '人机检测失败，请刷新页面重试',
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
            }
            if (e.details.type === 'InvalidCode') {
                setCodeErrorStatus(true)
                messageApi.open({
                    type: 'error',
                    content: '邮箱验证码有误',
                });
            }
            if (e.details.type === 'InvalidTOTP') {
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
        <div style={{
            width: '100%',
            minHeight: 'calc(100vh - 329px)',
            paddingBottom: '77px',
            position: "relative"
        }}>
            {contextHolder}
            <div className="container-my">
                <div className={'login-card'}>
                    <div className="logospace">
                        <Image className="label_2" src={Logo} alt={'logo'} />
                        Hash Space
                    </div>
                    {
                        step === 0 && (
                            <div>
                                <div className={'login-hello'}>欢迎加入 Hash Space</div>
                                <div className={'login-small-text'}>邮箱</div>
                                <Input
                                    style={{
                                        height:'50px',
                                    }}
                                    size={'large'}
                                    type={'email'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={'请输入您的邮箱'}
                                ></Input>
                                {
                                    status !== 'solved' && <Turnstile
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
                                        height:'50px'
                                    }}
                                    disabled={(status !== 'solved') || (email === '')} type="primary" block size={'large'} shape={'round'} onClick={() => {
                                    submitEmail()
                                }}>下一步</Button>
                            </div>
                        )
                    }
                    {
                        step === 1 && (
                            <div>
                                <div className={'login-hello'}>验证</div>
                                <Space direction={"vertical"} size={"large"} style={{width: '100%'}}>
                                    <div >
                                        <div className={'login-title-text'}>邮箱</div>
                                        <Input
                                            status={codeErrorStatus ? 'error' : ''}
                                            style={{
                                                height:'50px'
                                            }}
                                            maxLength={6}
                                            type={'text'}
                                            value={code}
                                            size={'large'}
                                            onChange={(e) => {
                                                setCode(e.target.value)
                                                setCodeErrorStatus(false)
                                            }}
                                            placeholder={'请输入验证码'}
                                        ></Input>
                                        {
                                            codeErrorStatus && <div className={'errorMessage'}>邮箱验证码错误</div>
                                        }
                                        <div
                                            className={'login-small-text'}>请输入您在邮箱 {email} 收到的6位验证码，验证码30分钟有效
                                        </div>
                                    </div>
                                    {totpEnabled && (
                                        <div>
                                            <div className={'login-title-text'}>Google Authenticator验证码</div>
                                            <Input
                                                status={totpCodeErrorStatus ? 'error' : ''}
                                                style={{
                                                    height:'50px'
                                                }}
                                                maxLength={6}
                                                type={'text'}
                                                value={totpCode}
                                                size={'large'}
                                                onChange={(e) => {
                                                    setTotpCode(e.target.value)
                                                    setTotpCodeErrorStatus(false)
                                                }}
                                                placeholder={'请输入验证码'}
                                            ></Input>
                                            {
                                                totpCodeErrorStatus && <div className={'errorMessage'}>Google Authenticator验证码错误</div>
                                            }
                                            <div
                                                className={'login-small-text'}>请打开您的Google Authenticator，输入6位验证码
                                            </div>
                                        </div>
                                    )}
                                    <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
                                        <Checkbox onChange={onChange}
                                                  className={'login-validate'}>创建账户即表示我同意币安的《服务条款》和《隐私政策》</Checkbox>
                                        <Button type="primary" block size={'large'} shape={'round'}
                                                disabled={!agree || !(code.length === 6) || (totpEnabled && totpCode.length !== 6) || codeErrorStatus || totpCodeErrorStatus}
                                                style={{
                                                    height:'50px'
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
