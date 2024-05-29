'use client'
import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import {useOnMountUnsafe} from "@/lib/clientUtils";


import './index.css';
import { cn } from "@/lib/utils";

interface Props {
    onSend: () => Promise<any>;
    onChange: (e: any) => void;
    onError: (e: any) => void;
    value: string;
    disabled: boolean;
    errorStatus?: boolean
    label?: string;
    immidity?: boolean;
}

export const CodeSender = ({ onSend, value, onChange, onError, disabled, errorStatus = false, label = '验证码', immidity }: Props) => {
    const TIMER_CONST = 60;
    const [focus, setFocus] = useState(false);
    const [timer, setTimer] = useState(0);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        // Effect to handle the countdown timer
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            // Cleanup interval on component unmount or when timer changes
            return () => clearInterval(interval);
        }
    }, [timer]); // Depend on `timer` state

    useOnMountUnsafe(() => {
        if (immidity) {
            handleSendCode()
        }
    })


    const onFocus = () => {
        setFocus(true);
    };

    const onBlur = () => {
        setFocus(false);
    };

    const handleSendCode = async () => {
        // setSending(true);

        setTimer(TIMER_CONST - 1);

        try {
            setSending(true);
            await onSend();
            setTimer(TIMER_CONST);
            message.success('验证码已发送');
        } catch (e) {
            message.error('发送验证码失败');
            onError(e)
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div className={'login-title-text'}>{label}</div>
            <div
                className={cn("code-sender-wrapper", focus ? 'code-sender-wrapper-focus' : '', errorStatus ? 'code-sender-wrapper-error' : '')}
            >
                <Input
                    maxLength={6}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        console.log(e.target.value)
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    style={{ height: '50px' }}
                    bordered={false}
                />
                <Button
                    style={{ height: '50px' }}
                    type={'text'}
                    onClick={handleSendCode}
                    loading={sending}
                    disabled={((sending || (timer < TIMER_CONST)) && timer !== 0) || disabled}
                >
                    {timer === 0 ? '发送验证码' : `${timer}秒后重试`}
                </Button>
            </div>
        </div>
    );
};
