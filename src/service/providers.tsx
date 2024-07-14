'use client';
import React, {ReactNode, useContext, useEffect, useMemo, useState} from "react";
import {MyContext, MyContextProvider} from "@/service/context";
import {ConfigProvider, Modal} from "antd";
import {themeConfig} from "@/service/themeConfig";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import NotificationBar from "@/components/NotificationBar";
import NoEleFee from "@/components/NoEleFee";
import HeaderCus from "@/components/Header";
import FooterCus from "@/components/Footer";
import {LoadingComponent} from "@/service/loading";

const { Header, Content, Footer } = Layout;

const blackList = [
    '/login'
]

const isNotShowFooter = () => {
    return blackList.includes(location.pathname)
}

export const Providers = ({children}: { children: ReactNode }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isNoFeeModel, setIsNoFeeModel] = useState(false);
    const [isShowNotification, setIsShowNotification] = useState(false);
    const {state} = useContext(MyContext);
    const value = useMemo(() => ({isMobile}), [isMobile]);
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
    useEffect(() => {
        if (state.userInfo.insufficient_electricity_balance) {
            setIsNoFeeModel(true)
        }
        if (state.userInfo.warning_electricity_balance) {
            setIsShowNotification(true)
        }
    }, [state.userInfo.insufficient_electricity_balance, state.userInfo.warning_electricity_balance]);
    return (
        <MyContextProvider value={value}>
            <ConfigProvider
                theme={themeConfig}
            >
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
                <NotificationBar show={isShowNotification} onClose={() => setIsShowNotification(false)} />
                <Modal width={420} closable={false} open={isNoFeeModel} footer={null}>
                    <NoEleFee onCharge={() => setIsNoFeeModel(false)} />
                </Modal>
            </ConfigProvider>
        </MyContextProvider>
    )
}