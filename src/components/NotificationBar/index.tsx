import React from 'react';
import css from './index.module.css'
import WarningIcon from '../../../public/warning-icon.png';
import CloseIcon from '../../../public/close-icon.png'
import Image from "next/image";

export interface NotificationBarProps {
    show: boolean;
    onClose: () => void;
}
export const NotificationBar = ({show, onClose}:NotificationBarProps) => {
    const handleClick = () => {
        onClose();
    }

    if (!show) {
        return null;
    }
    return (
        <div className={css.wrapper}>
            <Image style={{
                marginTop: '-1px',
                marginRight: '7px'
            }} src={WarningIcon} width={16} alt={'warningIcon'}/>
            <span>您的电费余额不足以使用3天，请尽快完成充值。</span>
            <Image
                onClick={handleClick}
                style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '24px'
            }} src={CloseIcon} width={20} alt={'closeIcon'}/>
        </div>
    )

}

export default NotificationBar;