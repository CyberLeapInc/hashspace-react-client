import React from 'react';
import {Button} from "antd";
import Link from "next/link";

export const NoEleFee = ({onCharge}: {onCharge: () => void}) => {
    return (
        <div>
            <div style={{
                fontSize:'20px',
                color: '#333333',
                textAlign: 'center',
                lineHeight: '30px',
                fontWeight: '600'
            }}>️❗️电费不足停机通知❗️</div>
            <div style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#333333',
                lineHeight: '24px',
                textAlign: 'center',
                margin: '50px auto'
            }}>您的电费余额不足已停机，请尽快完成充值。</div>
            <Link href={'/electricityFee'}>
                <Button onClick={onCharge} size={'large'} shape={'round'} block type={"primary"}>立即充值</Button>
            </Link>
        </div>
    )
}
export default NoEleFee;