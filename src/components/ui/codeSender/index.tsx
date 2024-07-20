'use client'
import React, { useState, useEffect } from "react";
import { Button, Input, message } from "antd";
import {useOnMountUnsafe} from "@/lib/clientUtils";


import './index.css';
import { cn } from "@/lib/utils";
import {useTranslations} from 'next-intl';

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

export const CodeSender = ({ onSend, value, onChange, onError, disabled, errorStatus = false, label = '', immidity }: Props) => {
    const t = useTranslations('codeSender');
    const TIMER_CONST = 60;
    const [focus, setFocus] = useState(false);
    const [timer, setTimer] = useState(0);
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const tLabel = t('code');

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
            setSent(true)
            setTimer(TIMER_CONST);
            message.success(t("verificationCodeSent"));
        } catch (e) {
            message.error(t("verificationCodeSendFailed"));
            onError(e)
        } finally {
            setSending(false);
        }
    };

    return (
        <div>
            <div className={'login-title-text'}>{tLabel}</div>
            <div
                className={cn("code-sender-wrapper", focus ? 'code-sender-wrapper-focus' : '', errorStatus ? 'code-sender-wrapper-error' : '')}
            >
                <Input
                    disabled={!sent}
                    style={{
                        cursor: !sent ? 'not-allowed' : 'auto',
                        height: '50px'
                    }}
                    maxLength={6}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value)
                        console.log(e.target.value)
                    }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    bordered={false}
                />
                <Button
                    style={{ height: '50px' }}
                    type={'text'}
                    onClick={handleSendCode}
                    loading={sending}
                    disabled={((sending || (timer < TIMER_CONST)) && timer !== 0) || disabled}
                >
                    {timer === 0 ? <span style={{color: disabled ? '#A1A3AB' :'#3C53FF'}}>{t("sendVerificationCode")}</span> : <span style={{color: '#A1A3AB'}}>{t("retryAfter")}</span>}
                </Button>
            </div>
        </div>
    );
};
