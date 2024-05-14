import react, {useContext, useEffect, useState} from 'react';

import './index.css'
import React from "react";
import {Alert, Button, Input, message} from "antd";
import {finishTotp, getTotpCode, startTotp, unbindTotpFinish, unbindTotpStart} from "@/service/api";
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {QRCodeSVG} from "qrcode.react";
import {MyContext} from "@/service/context";

export const TwoFactorAuth = ({ onSuccess } : {
    onSuccess: () => void
}) => {
    const [code, setCode] = useState('')
    const [googleCode, setGoogleCode] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [secret, setSecret] = useState('');
    const [qrcodeUrl, setQrcodUrl] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [totpCodeErrorStatus, setTotpCodeErrorStatus] = useState(false);
    const [loading, setLoading] = useState(false)


    useOnMountUnsafe(() => {
        startTotp().then(res => {
            setSessionId(res.session_id);
            setSecret(res.secret);
            setQrcodUrl(res.qrcode_url);
            console.log(res);
            getTotpCode({
                session_id: res.session_id,
                scene: 1
            })
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
                    content: '发送验证码次数过多，请稍后再试',
                });
            } else {
                let errMessage = ''
                if (e.details.type === 'InvalidCode') {
                    setCodeErrorStatus(true)
                    errMessage = '邮箱验证码错误'
                }
                if (e.details.type === 'InvalidTOTP') {
                    setTotpCodeErrorStatus(true)
                    errMessage = 'Google验证码错误'
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

    return <div style={{width: '776px', display: 'flex', gap: '30px'}}>
        {contextHolder}
        <div style={{flex: 1}}>
            <div className={'step-row'}>
                <div className={'step-index'}>1</div>
                <div className={'step-intro'}>
                    下载并安装Google Authenticator（谷歌身份验证码）或Authy APP。</div>
            </div>
            <div className={'step-row'}>
                <div className={'step-index'}>2</div>
                <div className={'step-intro'}>
                    <div>扫描下方二维码。</div>
                    <div>
                        <QRCodeSVG value={qrcodeUrl} />
                    </div>
                    <div>或者输入密钥</div>
                    <div style={{fontWeight: "bold"}}>{secret}</div>
                </div>

            </div>
        </div>
        <div style={{flex: 1}}>
            <div className={'step-row'}>
                <div  className={'step-index'}>1</div>
                <div className={'step-intro'}>
                    <div>
                        Google身份验证器配置完成后，会显示一个6位数字，每隔30秒变化一次，这个数字即为您的Google验证码。
                    </div>
                    <div>
                        <div className={'login-title-text'}>邮箱验证码</div>
                    </div>
                    <Input
                        status={codeErrorStatus ? 'error' : ''}
                        style={{
                            height: '50px'
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
                    <div>
                        <div className={'login-title-text'}>Google验证码</div>
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
                        placeholder={'请输入验证码'}
                    ></Input>
                    {
                        totpCodeErrorStatus && <div className={'errorMessage'}>Google验证码错误</div>
                    }
                    <Button
                        type="primary" block size={'large'} shape={'round'}
                        style={{
                            marginTop: '40px'
                        }}
                        disabled={!(code.length === 6 && googleCode.length === 6 && !codeErrorStatus && !totpCodeErrorStatus && !loading)}
                        onClick={onConfirm}
                        loading={loading}
                    >确认绑定</Button>
                </div>
            </div>
        </div>
    </div>

}

export const UnbindTowFactorAuth = ({ onSuccess } : {
    onSuccess: () => void
}) => {
    const {state} = useContext(MyContext);
    const [googleCode, setGoogleCode] = useState('')
    const [sessionId, setSessionId] = useState('')
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const onConfirm = () => {
        setLoading(true)
        unbindTotpFinish({
            code: googleCode,
            session_id: sessionId
        }).then(_ => {
            console.log('success');
            console.log(_)
            onSuccess()
        }).catch(e => {
            console.log('eeeeeeee')
            messageApi.open({
                type: 'error',
                content: e.message,
            });
            setCodeErrorStatus(true)
        }).finally(() => {
            setLoading(false)
        })
    }

    useOnMountUnsafe(() => {
        unbindTotpStart().then(res => {
            setSessionId(res.session_id);
            console.log(res);
            getTotpCode({
                session_id: res.session_id,
                scene: 3
            })
        })
    })


    return (<div>
        <div className={'step-danger'}>解绑Google验证后，24h内禁止设置/修改地址</div>
        <div className={'step-info'}>验证码将发送至{state.userInfo.email}</div>
        <div>
            <div className={'login-title-text'}>邮箱验证码</div>
        </div>
        <Input
            style={{
                height: '50px'
            }}
            status={codeErrorStatus ? 'error' : ''}
            maxLength={6}
            type={'text'}
            value={googleCode}
            size={'large'}
            onChange={(e) => {
                setGoogleCode(e.target.value)
                setCodeErrorStatus(false)
            }}
            placeholder={'请输入验证码'}
        ></Input>
        {
            codeErrorStatus && <div className={'errorMessage'}>邮箱验证码错误</div>
        }
        <Button
            type="primary" block size={'large'} shape={'round'}
            style={{
                marginTop: '40px'
            }}
            disabled={!(googleCode.length === 6 && !loading && !codeErrorStatus)}
            loading={loading}
            onClick={onConfirm}
        >确认</Button>
    </div>)
}