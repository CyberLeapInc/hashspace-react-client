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
            }} src={WarningIcon} className={css.warningIcon} alt={'warningIcon'}/>
            <span>您的电费余额不足以使用3天，请尽快完成充值。</span>
            <Image
                onClick={handleClick}
                 src={CloseIcon} className={css.closeIcon} alt={'closeIcon'}/>
        </div>
    )

}

export default NotificationBar;