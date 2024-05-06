'use client'
import React, {useEffect, useState} from 'react';
import { Button, Form, type FormProps, Input } from 'antd';
import { Checkbox } from 'antd';
import type { CheckboxProps } from 'antd';


import { Turnstile } from '@marsidev/react-turnstile'
import {getLoginCode, startLogin} from "@/service/api";

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

import './index.css';

const CryptoPage = () => {
    const [status, setStatus] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [code, setCode] = React.useState('')
    const [agree, setAgree] = React.useState(false)
    const [cloudFlareToken, setCloudFlareToken] = React.useState('');
    const [step, setStep] = useState(1);
    const [sessionId, setSessionId] = useState('')
    const [totpEnabled, setTotpEnabled] = useState(false)

    const submitEmail = () => {
        startLogin(email, '000000').then(res => {
            console.log(res)
            setSessionId(res.data.session_id || '')
            setTotpEnabled(res.data.totp_enabled || false)
            getLoginCode(sessionId).then(res => {
                setStep(1)
            })
        })
    }
    const onChange: CheckboxProps['onChange'] = (e) => {
        setAgree(e.target.checked)
    };


    const onVerify = () => {

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
                                <div className={'login-hello'}>邮箱验证</div>
                                <div className={'login-small-text'}>请输入您在邮箱 {email} 收到的6位验证码，验证码30分钟有效</div>
                                <div className={'login-small-text'}>验证码</div>
                                <Input
                                    type={'text'}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder={'请输入验证码'}
                                ></Input>
                                <Checkbox onChange={onChange}>创建账户即表示我同意币安的</Checkbox>
                                <Button type="primary" block size={'large'} shape={'round'}
                                        disabled={!agree}
                                        onClick={() => {onVerify()}}>下一步</Button>
                            </div>
                        )
                    }
                </div>
            </div>


        </div>
    );
};

export default CryptoPage;
