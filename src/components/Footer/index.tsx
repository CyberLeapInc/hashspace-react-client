import Image from "next/image";
import Logo from "../../../public/logo.png";
import TwitterPic from "../../../public/twitter@2x.png";
import TgPic from "../../../public/tg@2x.png";
import EmailPic from "../../../public/email@2x.png";
import React, {useContext} from "react";
import {MyContext} from "@/service/context";

import css from './index.module.css'
import {cn} from "@/lib/utils";

export const Footer = () => {
    const {state} = useContext(MyContext);
    return <>
        <div className={css.footerCus}>
            <div className={cn(css.footerContainer, state.isMobile && css.footerContainerMobile)}>
                <div className="logospace">
                    <Image className="label_2" src={Logo} alt={'logo'}/>
                    Hash Space
                </div>
                <div className={css.agreementsList} style={{
                    paddingTop: state.isMobile ? '20px' : '0',
                    paddingBottom: state.isMobile ? '20px' : '0'
                }}>
                    <div className={css.agreement}>服务协议</div>
                    <div className={css.agreement}>隐私政策</div>
                    <div className={css.agreement}>免责声明</div>
                </div>
                <div className='pic-row'>
                    <Image src={TwitterPic}
                           width={20}
                           height={20}
                           alt="twitter"
                    />
                    <Image src={TgPic}
                           width={20}
                           height={20}
                           alt="twitter"
                    />
                    <Image src={EmailPic}
                           width={20}
                           height={20}
                           alt="twitter"
                    />
                </div>
            </div>
            <div className="footer-info">© 2024 Hashspce. All</div>
        </div>
    </>
}

export default Footer;