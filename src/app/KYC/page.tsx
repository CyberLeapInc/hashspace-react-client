'use client'
import React, {useContext} from "react";
import {MyContext, MyContextProvider} from "@/service/context";
import {Button, Card} from "antd";
import './index.css'
import KycNewImage from '../../../public/kyc-new.png'
import KycNotAllowImage from '../../../public/kyc-notallow.png'
import KycWaitingImage from '../../../public/kyc-waiting.png'
import Image from "next/image";

const KYC = () => {
    const {state} = useContext(MyContext)
    return (
        <div style={{
            height: 'calc(100vh - 239px)'
        }}>
            <div className={'container-my'} style={{paddingTop: '100px'}}>
                <div className={'id_card'}>
                    <Image className={'kyc-image'} src={KycNewImage} alt={'kyc new'}></Image>
                    <div className={'kyc-text'}>您未进行KYC认证</div>
                    <Button style={{fontSize: '14px', height: '50px', width:'240px', margin: '0 auto', display: 'block'}} shape={"round"} size={"large"} type={"primary"}>认证</Button>
                </div>
            </div>


        </div>
    )
}

export default KYC