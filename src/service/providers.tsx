'use client';
import React, {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {MyContext, MyContextProvider} from "@/service/context";
import {ConfigProvider, Modal} from "antd";
import {themeConfig} from "@/service/themeConfig";
import {Layout} from 'antd';
import HeaderCus from "@/components/Header";
import FooterCus from "@/components/Footer";
import {cn} from "@/lib/utils";
import {GlobalModals} from "@/components/GlobalModals";

const { Content, Footer } = Layout;

const blackList = [
    '/login'
]

const isNotShowFooter = () => {
    return blackList.includes(location.pathname)
}

export const Providers = ({children}: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);
    const value = useMemo(() => ({isMobile}), [isMobile]);
    const [isLoad, setIsLoad] = useState(false)
    useEffect(() => {
        setIsLoad(true)
    }, []);
    const isShowFooter = useMemo(() => {
        if (!isMobile) {
            return true
        } else {
            return !blackList.includes(location.pathname)
        }
    }, [isMobile])
    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobile = Boolean(userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        ));
        setIsMobile(mobile);
    }, []);

    return (
        <MyContextProvider value={value}>
            <ConfigProvider
                theme={themeConfig}
            >
                {
                    isLoad && (
                        <>
                            <HeaderCus/>
                            <Layout
                                style={{
                                    maxWidth: '100vw',
                                    overflow: 'scroll',
                                    minWidth:  isMobile ? '250px' : '1200px',
                                }}
                            >
                                <Content>
                                    {children}
                                </Content>
                                {
                                    isShowFooter ? <FooterCus/> : (
                                        <div className={cn('copyright')}>
                                            © 2024 Hashspce. All rights reserved
                                        </div>
                                    )
                                }
                            </Layout>
                            <GlobalModals />
                        </>
                    )
                }

            </ConfigProvider>
        </MyContextProvider>
    )
}