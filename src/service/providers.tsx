'use client';
import React, {ReactNode, useEffect, useMemo, useState} from "react";
import {MyContextProvider} from "@/service/context";
import {ConfigProvider} from "antd";
import {themeConfig} from "@/service/themeConfig";
import { Breadcrumb, Layout, Menu, theme } from 'antd';


import HeaderCus from "@/components/Header";
import FooterCus from "@/components/Footer";

const { Header, Content, Footer } = Layout;


export const Providers = ({children}: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);
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
                    <FooterCus/>
                </Layout>
            </ConfigProvider>
        </MyContextProvider>
    )
}