import React from 'react';
import {Button} from "antd";
import Link from "next/link";
import {useTranslations} from 'next-intl';

export const NoEleFee = ({onCharge}: {onCharge: () => void}) => {
    const t = useTranslations('noEleFee');
    return (
        <div>
            <div style={{
                fontSize:'20px',
                color: '#333333',
                textAlign: 'center',
                lineHeight: '30px',
                fontWeight: '600'
            }}>{t('title')}</div>
            <div style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#333333',
                lineHeight: '24px',
                textAlign: 'center',
                margin: '50px auto'
            }}>{t('description')}</div>
            <Link href={'/electricityFee'}>
                <Button onClick={onCharge} size={'large'} shape={'round'} block type={"primary"}>{t('buttonText')}</Button>
            </Link>
        </div>
    )
}
export default NoEleFee;