import {ActionType, MyContext, State} from "@/service/context";
import IconKyc from "../../../public/icon-kyc.png";
import IconSecurity from "../../../public/icon-security.png";
import IconMyorder from "../../../public/icon-myorder.png";
import IconAddress from "../../../public/icon-address.png";
import IconElectfee from "../../../public/icon-electfee.png";
import {Button,Drawer, Popover, Space} from "antd";
import Image from "next/image";
import IconAvatar from "../../../public/icon-avatar.png";
import DividerCus from "@/components/ui/dividerCus";
import Link from "next/link";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {getUserInfo, logout} from "@/service/api";
import Logo from "../../../public/logo.png";


import css from './index.module.css'
import {CloseOutlined, LoginOutlined, MenuOutlined} from "@ant-design/icons";
import {cn} from "@/lib/utils";

const HoverContent = ({outState, onLogOut, isMobile = false}: {
    outState: State,
    onLogOut: Function,
    isMobile: Boolean
}) => {
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
            href: '/electricityFee',
            icon: IconElectfee
        },
    ]

    return (
        <div style={{fontSize: '14px', color: '#333', fontWeight: 400}}>
            <Space direction={"vertical"} size={0} style={{width: '100%'}}>
                <Space style={{
                    padding: '0 26px',
                    paddingTop: '26px'
                }}>
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
                                <Link href={item.href}>
                                    <Button
                                        key={item.text}
                                        style={{
                                            color: '#333',
                                            fontSize: '14px',
                                            display:'flex',
                                            verticalAlign: 'middle',
                                            justifyContent: isMobile? 'left' : 'center',
                                            paddingLeft: isMobile ? '26px' : '',
                                            height: '55px',
                                            lineHeight: '55px',
                                            alignItems: 'center',
                                        }} block type="text" size={"large"}>
                                        <Image width={18} height={18} src={item.icon} alt={'avatar'} style={{
                                            margin:'2px 8px 0 0'
                                        }}/>
                                        <span>
                                            {item.text}
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                        ))
                    }
                    {!isMobile && <DividerCus />}

                    <div style={{
                        width: '100%',
                        display: 'flex'
                    }}>
                        <Button className={cn(css.logOutButton, !isMobile && css.logOutButtonPC)} icon={<LoginOutlined />} shape={'round'} type="default" onClick={() => onLogOut()}>
                            退出账号
                        </Button>

                    </div>

                </Space>
            </Space>
        </div>
    )
}

export const Header: React.FC = () => {
    const {state, dispatch} = useContext(MyContext)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [type, setType] = useState('')
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
    const openDrawerWithType = (type: string) => {
        setType(type)
        setOpenDrawer(true)
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
    if (state.isMobile) {
        return <header
            className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur"
        >
            <div className={cn('container-my flex h-14 max-w-screen-2xl items-center', css.mobileHeader)} style={{'gap': '24px'}}>
                <div className="logospace">
                    <Image className="label_2" src={Logo} alt={'logo'}/>
                    Hash Space
                </div>
                <div>
                    <div className={css.top}>
                        {
                            !(state?.userInfo?.email) &&
                            <Button style={{marginLeft: 'auto'}} shape={'round'} ghost className={css.logInButton} type={'primary'}>
                                <Link href="/login" legacyBehavior passHref>
                                    开始挖矿
                                </Link>
                            </Button>
                        }
                        {
                            (state?.userInfo?.email) && (
                                <Image onClick={() => openDrawerWithType('user')} style={{marginLeft: 'auto'}} width={40} src={IconAvatar} alt={'avatar'}/>                        )
                        }
                        <Button size={"large"} type={"text"} icon={<MenuOutlined />} onClick={() => openDrawerWithType('navi')}/>
                    </div>
                </div>
                <Drawer
                    placement="top"
                    closable={false}
                    open={openDrawer}
                    getContainer={false}
                    height={'100vh'}
                    bodyStyle={{
                        padding: '0',
                    }}
                >
                    {
                        type === 'navi' && <div onClick={() => setOpenDrawer(false)}>
                            <div className={css.mobileHeader}>
                                <div></div>
                                <div>
                                    {
                                        !(state?.userInfo?.email) &&
                                        <Button style={{marginLeft: 'auto'}} shape={'round'} ghost className={css.logInButton} type={'primary'}>
                                            <Link href="/login" legacyBehavior passHref>
                                                开始挖矿
                                            </Link>
                                        </Button>

                                    }
                                    <Button size={"large"} type={"text"} icon={<CloseOutlined/>}
                                            onClick={() => setOpenDrawer(false)}/>
                                </div>
                            </div>
                            <div className={css.mobileList}>
                                <Link href="/" legacyBehavior passHref>
                                    首页
                                </Link>
                                <Link href="/productList" legacyBehavior passHref>
                                    云算力
                                </Link>
                                <Link href="/calculator" legacyBehavior passHref>
                                    计算器
                                </Link>
                                <Link href="/login" legacyBehavior passHref>
                                    关于
                                </Link>
                            </div>
                        </div>
                    }
                    {
                        type === 'user' && <div  onClick={() => setOpenDrawer(false)}>
                            <div className={css.mobileHeader}>
                                <div></div>
                                <div  className={css.top}>
                                    <Image style={{marginLeft: 'auto'}} width={40} src={IconAvatar} alt={'avatar'}/>
                                    <Button size={"large"} type={"text"} icon={<CloseOutlined/>}
                                            onClick={() => setOpenDrawer(false)}/>
                                </div>
                            </div>
                            <HoverContent isMobile={state.isMobile} outState={state} onLogOut={logOut}/>
                        </div>
                    }
                </Drawer>
            </div>
        </header>
    } else {
        return (
            <header
                className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
            >
                <div className="container-my flex h-14 max-w-screen-2xl items-center" style={{'gap': '24px'}}>
                    <div className="logospace">
                        <Image className="label_2" src={Logo} alt={'logo'}/>
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
                    {
                        !(state?.userInfo?.email) &&
                        <Button style={{marginLeft: 'auto'}} shape={'round'} size={'middle'} type={'primary'}>
                            <Link href="/login" legacyBehavior passHref>
                                开始挖矿
                            </Link>
                        </Button>
                    }
                    {
                        (state?.userInfo?.email) && (
                            <Popover overlayInnerStyle={{
                                padding: 0,
                                borderRadius: '20px',
                                minWidth: '210px'
                            }} content={() => <HoverContent isMobile={state.isMobile} outState={state} onLogOut={logOut}/>}>
                                <Image style={{marginLeft: 'auto'}} width={40} src={IconAvatar} alt={'avatar'}/>
                                {/*<Avatar style={{marginLeft: 'auto'}} size={40} icon={<UserOutlined />} />*/}
                            </Popover>
                        )
                    }
                </div>
            </header>
        )
    }
}

export default Header;