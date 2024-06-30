import React, {useContext, useState} from "react";
import {CodeSender} from "@/components/ui/codeSender";
import {bindPhoneFinish, bindPhoneStart, getPhoneCode} from "@/service/api";
import {Turnstile} from "@marsidev/react-turnstile";
import {cloudFlareSiteKey} from "@/lib/constant";
import {Space, Input, Button, message} from 'antd'
import {useOnMountUnsafe} from "@/lib/clientUtils";
import {MyContext} from "@/service/context";

import './index.css'

export const PhoneBind = ({
    onSuccess
}: {
    onSuccess: () => void
}) => {
    const [captchaRefreshKey, setCaptchaRefreshKey] = React.useState(0)
    const {state} = useContext(MyContext)
    const [status, setStatus] = React.useState('')
    const [code, setCode] = useState('')
    const [currentCode, setCurrentCode] = useState('')
    const [codeErrorStatus, setCodeErrorStatus] = useState(false);
    const [currentCodeErrorStatus, setCurrentCodeErrorStatus] = useState(false);
    const [loading, setLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const [cloudFlareToken, setCloudFlareToken] = React.useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneCountry, setPhoneCountry] = useState('1')
    const [sessionId, setSessionId] = useState('');
    const [isCurrentPhone, setIsCurrentPhone] = useState(false);
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

    const onConfirm = () => {
        setLoading(true);
        bindPhoneFinish({
            session_id: sessionId,
            code,
            current_code: currentCode
        }).then(() => {
            onSuccess()
        }).catch(e => {
            if (e.details.type === 'SessionExpired') {
                messageApi.open({
                    type: 'error',
                    content: 'Session过期，请关闭后重试。',
                });
            } else if (e.details.type === 'InvalidCode') {
                console.log(e)
                let errMessage = ''
                if (e.details.is_current_phone) {
                    setCurrentCodeErrorStatus(true)
                    errMessage = '换绑手机号验证码错误'
                } else {
                    setCodeErrorStatus(true)
                    errMessage = '手机号验证码错误'
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


    return (<div>
        {
            state.userInfo.phone_country_code && (
                <div style={{
                    marginTop: '16px',
                }}>
                    <div className={'login-title-text'}>手机号</div>
                    <div className={'phoneGroup phoneGroup-disable'} style={{
                        marginBottom: '14px'
                    }}>
                        <span>+</span>
                        <Input disabled style={{width: '34px', color: '#999'}} bordered={false} size={"large"} maxLength={2} value={state.userInfo.phone_country_code}/>
                        <Input disabled size={"large"}  bordered={false} style={{width: '80%',color: '#999'}} value={state.userInfo.phone_number} />
                    </div>
                    <CodeSender
                        onError={() => {
                            setStatus('no')
                            setCaptchaRefreshKey(prevState => prevState+1)
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
                        disabled={status !== 'solved'}
                    />
                    {
                        currentCodeErrorStatus && <div className={'errorMessage'}>验证码错误</div>
                    }
                </div>

            )
        }
        <div style={{
            marginTop: '17px',
            marginBottom: '17px'
        }}>
            <div className={'login-title-text'}>{
                state.userInfo.has_phone ? '新手机号' : '手机号'
            }</div>

            <div className={'phoneGroup'}>
                <span>+</span>
                <Input size={"large"} maxLength={2} style={{width: '34px'}} bordered={false} value={phoneCountry}
                       placeholder={'区号'}
                       onChange={(e) => {
                           setPhoneCountry(e.target.value)
                       }}/>
                <Input size={"large"} style={{width: '80%'}} bordered={false} value={phoneNumber}
                       placeholder={'请输入手机号'}
                       onChange={(e) => {
                           setPhoneNumber(e.target.value)
                       }}/>
            </div>
        </div>
        <CodeSender
            onError={() => {
                setStatus('no')
                setCaptchaRefreshKey(prevState => prevState + 1)
            }}
            errorStatus={codeErrorStatus}
            label={
                state.userInfo.has_phone ? '新手机号验证码' : '验证码'
            }
            value={code}
            onChange={(e) => {
                setCode(e)
                setCodeErrorStatus(false)
            }}
            onSend={() => getCode(
                phoneNumber,
                phoneCountry,
            )}
            disabled={status !== 'solved'}
        />
        {
            codeErrorStatus && <div className={'errorMessage'}>验证码错误</div>
        }
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
                key={captchaRefreshKey}
            />
        }
        <Button
            type="primary" block size={'large'} shape={'round'}
            style={{
                height: '50px',
                marginTop: '40px'
            }}
            disabled={!(code.length === 6 && !codeErrorStatus && !loading) || (state.userInfo.has_phone && currentCode.length !== 6 && currentCodeErrorStatus)}
            onClick={onConfirm}
            loading={loading}
        >确认绑定</Button>
    </div>)
}