import React from 'react';
import css from './index.module.css'
import WarningIcon from '../../../public/warning-icon.png';
import CloseIcon from '../../../public/close-icon.png'
import Image from "next/image";
import {useTranslations} from 'next-intl';

export interface NotificationBarProps {
    show: boolean;
    onClose: () => void;
}
export const NotificationBar = ({show, onClose}:NotificationBarProps) => {
    const t = useTranslations('notificationBar');
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
            <span>{t('warningMessage')}</span>
            <Image
                onClick={handleClick}
                 src={CloseIcon} className={css.closeIcon} alt={'closeIcon'}/>
        </div>
    )

}

export default NotificationBar;