'use client'
import React, {useContext, useState} from 'react';
import type {CheckboxProps} from 'antd';
import {Button, Checkbox, type FormProps, Input, Space} from 'antd';
import {ActionType, MyContext} from "@/service/context";
import { useRouter } from 'next/navigation';


import {Turnstile} from '@marsidev/react-turnstile'
import {getLoginCode, getUserInfo, login, startLogin} from "@/service/api";
import './index.css';

const SITE_KEY = '0x4AAAAAAAVuhgDN4FXyZAFb';

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
    const [status, setStatus] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [code, setCode] = React.useState('')
    const [agree, setAgree] = React.useState(false)
    const [cloudFlareToken, setCloudFlareToken] = React.useState('');
    const [step, setStep] = useState(0);
    const [sessionId, setSessionId] = useState('')
    const [totpEnabled, setTotpEnabled] = useState(false)
    const [totpCode, setTotpCode] = useState('')
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {state, dispatch} = useContext(MyContext);
    const searchParams = new URLSearchParams(location.search);
    const router = useRouter();

    const submitEmail = () => {
        startLogin(email, '000000').then(res => {
            console.log(res)
            setSessionId(res.session_id || '')
            setTotpEnabled(res.totp_enabled || false)
            getLoginCode(res.session_id).then(res => {
                setStep(1)
            })
        })
    }
    const onChange: CheckboxProps['onChange'] = (e) => {
        setAgree(e.target.checked)
    };


    const onVerify = () => {
        login(sessionId, code, totpCode).then(res => {
            getUserInfo().then(res => {
                dispatch({ type: ActionType.setUserInfo, payload: res });
                router.push(searchParams.get('to') || '/')
            })
        })
    }
    const onErr = () => {}

    return (
        <div style={{
            width: '100%',
            height: 'calc(100vh - 329px)',
            position: "relative"
        }}>
            <div className="container-my">
                <div className={'login-card'}>
                    {status}
                    <div className="logospace">
                        <img
                            className="label_2"
                            src={"https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng80d9894646f196c38188762374123b34a4ce34d32af69d03bf10c2f01ef37de0"}
                        />
                        Hash Space
                    </div>
                    {
                        step === 0 && (
                            <div>
                                <div className={'login-hello'}>欢迎加入 Hash Space</div>
                                <div className={'login-small-text'}>邮箱</div>
                                <Input
                                    type={'email'}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={'请输入您的邮箱'}
                                ></Input>
                                <Turnstile
                                    onError={() => setStatus('error')}
                                    onExpire={() => {
                                        setStatus('expired')
                                    }}
                                    onSuccess={(token) => {
                                        setStatus('solved')
                                        setCloudFlareToken(token)
                                    }}
                                    siteKey={SITE_KEY}
                                />
                                <Button type="primary" block size={'large'} shape={'round'} onClick={() => {
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
                                            type={'text'}
                                            value={code}
                                            size={'large'}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder={'请输入验证码'}
                                        ></Input>
                                        <div
                                            className={'login-small-text'}>请输入您在邮箱 {email} 收到的6位验证码，验证码30分钟有效
                                        </div>
                                    </div>
                                    {totpEnabled && (
                                        <div>
                                            <div className={'login-title-text'}>Google Authenticator验证码</div>
                                            <Input
                                                type={'text'}
                                                value={totpCode}
                                                size={'large'}
                                                onChange={(e) => setTotpCode(e.target.value)}
                                                placeholder={'请输入验证码'}
                                            ></Input>
                                            <div
                                                className={'login-small-text'}>请打开您的Google Authenticator，输入6位验证码
                                            </div>
                                        </div>
                                    )}
                                    <Space direction={"vertical"} size={'small'} style={{width: '100%'}}>
                                        <Checkbox onChange={onChange}
                                                  className={'login-validate'}>创建账户即表示我同意币安的《服务条款》和《隐私政策》</Checkbox>
                                        <Button type="primary" block size={'large'} shape={'round'}
                                                disabled={!agree}
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
