import Image from "next/image";
import Logo from "../../../public/logo-group.png";
import TwitterPic from "../../../public/twitter@2x.png";
import TgPic from "../../../public/tg@2x.png";
import EmailPic from "../../../public/email@2x.png";
import React, {useContext} from "react";
import {MyContext} from "@/service/context";

import css from './index.module.css'
import {cn} from "@/lib/utils";
import Link from "next/link";

export const Footer = () => {
    const {state} = useContext(MyContext);
    return <>
        <div className={css.footerCus} id={'footer'}>
            <div className={cn(css.footerContainer, state.isMobile && css.footerContainerMobile)}>
                <div>
                    <Image width={136} src={Logo} alt={'logo'}/>
                </div>
                <div className={css.agreementsList} style={{
                    paddingTop: state.isMobile ? '20px' : '0',
                    paddingBottom: state.isMobile ? '20px' : '0'
                }}>
                    <a href={'/user_agreement_cn.html'} target="_blank" className={css.agreement}>服务协议</a>
                    <a href={'/privacy_policy_cn.html'} target="_blank" className={css.agreement}>隐私政策</a>
                    <a href={'/disclaimer_cn.html'} target="_blank" className={css.agreement}>免责声明</a>
                </div>
                <div className='pic-row'>
                     <a href={'mailto:support@cyberleap.us'} style={{
                         display: 'flex',
                         justifyContent: 'center',
                         alignItems: 'center',
                         verticalAlign: 'middle',
                     }}>
                         <Image src={EmailPic}
                                width={20}
                                height={20}
                                alt="twitter"
                                style={{
                                    marginRight: '10px'
                                }}
                         />
                         <span style={{
                             lineHeight: '16px',
                             height: '20px',
                             display: 'inline-block'
                         }}>support@cyberleap.us</span>
                     </a>

                </div>
            </div>
            <div className="footer-info">© 2024 Hashspce. All rights reserved</div>
        </div>
    </>
}

export default Footer;