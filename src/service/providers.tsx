'use client';
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {MyContextProvider} from "@/service/context";
import {ConfigProvider} from "antd";
import {themeConfig} from "@/service/themeConfig";
import { Breadcrumb, Layout, Menu, theme } from 'antd';


import HeaderCus from "@/components/Header";
import FooterCus from "@/components/Footer";

const { Header, Content, Footer } = Layout;

const blackList = [
    '/login'
]

const isNotShowFooter = () => {
    return blackList.includes(location.pathname)
}

export const Providers = ({children}: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);
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
    const value = useMemo(() => ({isMobile}), [isMobile]);
    return (
        <MyContextProvider value={value}>
            <ConfigProvider
                theme={themeConfig}
            >
                <Layout
                    style={{
                        maxWidth: '100vw',
                        overflow: 'hidden'
                    }}
                >
                    <HeaderCus/>
                    <Content>
                        {children}
                    </Content>
                    {
                        isShowFooter && <FooterCus/>
                    }
                    {
                        !isShowFooter &&
                        <div style={{
                            height: '14px',
                            lineHeight: '14px',
                            textAlign: 'center',
                            padding: '10px 0 54px',
                            backgroundColor: 'white',
                            display: 'block',
                            boxSizing: 'content-box',
                            fontSize: '10px',
                            color: '#999999'
                        }}>
                            © 2024 Hashspce. All rights reserved
                        </div>
                    }

                </Layout>
            </ConfigProvider>
        </MyContextProvider>
    )
}