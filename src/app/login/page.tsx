'use client'
import React, {useEffect} from 'react';
import { Button, Checkbox, Form, type FormProps, Input } from 'antd';
import { Turnstile } from '@marsidev/react-turnstile'
import {startLogin} from "@/service/api";

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
    const [cloudFlareToken, setCloudFlareToken] = React.useState('');

    const submitEmail = () => {
        startLogin(email, cloudFlareToken).then(res => {
            console.log(res)
        })
    }

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
                    <Button  type="primary" block size={'large'} shape={'round'} onClick={() => {
                        submitEmail()
                    }}>下一步</Button>
                </div>
            </div>


        </div>
    );
};

export default CryptoPage;
