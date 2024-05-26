'use client';

import React, {ReactNode, useContext, useEffect} from "react";
import {ActionType, MyContext, MyContextProvider} from "@/service/context";
import Link from "next/link";
import {Avatar, Button, Popover, Space} from "antd";
import {UserOutlined} from '@ant-design/icons';
import Image from "next/image";
import TwitterPic from "../../public/twitter@2x.png";
import TgPic from "../../public/tg@2x.png";
import EmailPic from "../../public/email@2x.png";
import {getUserInfo, logout} from "@/service/api";
import { State } from "@/service/context";
import Logo from '../../public/logo.png'
import { useRouter } from 'next/navigation';
import IconAvatar from '../../public/icon-avatar.png'
import DividerCus from "@/components/ui/dividerCus";
import IconSecurity from '../../public/icon-security.png'
import IconMyorder from '../../public/icon-myorder.png'
import IconAddress from '../../public/icon-address.png'
import IconElectfee from '../../public/icon-electfee.png'
import IconKyc from '../../public/icon-kyc.png'


const HoverContent = ({outState, onLogOut}: {
    outState: State,
    onLogOut: Function
}) => {
    // const {state, dispatch} = useContext(MyContext)
    const routerLinkList = [
        {
            text: 'KYC认证',
            href: '/KYC',
            icon: IconKyc
        },
        {
            text: '安全中心',
            href: '/securityCenter',
            icon: IconSecurity,
        },
        {
            text: '我的订单',
            href: '/myOrder',
            icon: IconMyorder,
        },
        {
            text: '收款地址',
            href: '/walletAddress',
            icon: IconAddress
        },
        {
            text: '电费余额',
            href: '/',
            icon: IconElectfee
        },
    ]

    return (
        <div style={{width: '210px', fontSize: '14px', color: '#333', fontWeight: 400}}>
            <Space direction={"vertical"} size={0} style={{width: '100%'}}>
                <Space>
                    <Image  style={{marginLeft: 'auto'}} width={40} src={IconAvatar} alt={'avatar'} />
                    <div>
                        <div style={{fontWeight: 400}}>{outState.userInfo.email}</div>
                        <div style={{fontSize: '12px', color: '#999'}}>{outState.userInfo.has_identity ? <span style={{color: 'green'}}>已认证</span> : <span>未认证</span>}</div>
                    </div>
                </Space>

                <Space style={{
                    width: '100%'
                }} direction={"vertical"}  size={0}>
                    <DividerCus></DividerCus>
                    {
                        routerLinkList.map(item => (
                            <div key={item.text}>
                                <Button
                                    key={item.text}
                                    style={{
                                        color: '#333',
                                        fontSize: '14px',
                                        display:'flex',
                                        verticalAlign: 'middle',
                                        justifyContent: 'center'
                                    }} block type="text" size={"large"}>
                                    <Image width={18} height={18} src={item.icon} alt={'avatar'} style={{
                                        margin:'2px 8px 0 0'
                                    }}/>

                                    <Link href={item.href}>{item.text}</Link>
                                </Button>
                                <DividerCus></DividerCus>
                            </div>
                        ))
                    }
                    <div>
                        <Button block type="text" size={"large"} onClick={() => onLogOut()}>退出账号</Button>

                    </div>

                </Space>
            </Space>
        </div>
    )
}

const Header: React.FC = () => {
    'use client'
    const {state, dispatch} = useContext(MyContext)
    const router = useRouter();
    const logOut = () => {
        router.replace('/')
        logout().then(() => {
            // @ts-ignore
            dispatch({
                type: ActionType.setUserInfo,
                payload: {}
            })
        })
    }
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                dispatch({ type: ActionType.setUserInfo, payload: userInfo });
            } catch (error) {
                // 处理错误，例如日志记录或显示错误消息
                console.error("Failed to fetch user info:", error);
            }
        };
        fetchUserInfo().then(() => {
            console.log(MyContext)
        });
    }, [dispatch]);
    return (
        <MyContextProvider >
            <header
                className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container-my flex h-14 max-w-screen-2xl items-center" style={{'gap': '24px'}}>
                    <div className="logospace">
                        <Image className="label_2" src={Logo} alt={'logo'} />
                        Hash Space
                    </div>
                    <Link href="/" legacyBehavior passHref>
                        首页
                    </Link>
                    <Link href="/productList" legacyBehavior passHref>
                        云算力
                    </Link>
                    {/*<Link href="/login" legacyBehavior passHref>*/}
                    {/*    常见问题*/}
                    {/*</Link>*/}
                    <Link href="/calculator" legacyBehavior passHref>
                        计算器
                    </Link>
                    {/*<Link href="/login" legacyBehavior passHref>*/}
                    {/*    关于*/}
                    {/*</Link>*/}
                    <Link href="/buyDetail" legacyBehavior passHref>
                        测试连接/购买详情
                    </Link>
                    {
                        !(state?.userInfo?.email) && <Button style={{marginLeft: 'auto'}} shape={'round'} size={'middle'} type={'primary'}>
                            <Link href="/login" legacyBehavior passHref>
                                开始挖矿
                            </Link>
                        </Button>
                    }
                    {
                        (state?.userInfo?.email) && (
                            <Popover content={() => <HoverContent outState={state} onLogOut={logOut}/>}>
                                <Image  style={{marginLeft: 'auto'}} width={40} src={IconAvatar} alt={'avatar'} />
                                {/*<Avatar style={{marginLeft: 'auto'}} size={40} icon={<UserOutlined />} />*/}
                            </Popover>
                        )
                    }
                </div>
            </header>
        </MyContextProvider>
    )
}

const Footer = () => {
    return <>
        <div className="footer-cus">
            <div className="footer-container">
                <div className="logospace">
                    <Image className="label_2" src={Logo} alt={'logo'} />
                    Hash Space
                </div>
                <div>服务协议</div>
                <div>隐私政策</div>
                <div>免责声明</div>
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


export const Providers = ({ children }: { children: ReactNode }) => {
    return (
        <MyContextProvider>
            <Header/>
            {children}
            <Footer />
        </MyContextProvider>
    )
}