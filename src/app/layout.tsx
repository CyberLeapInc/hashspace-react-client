import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import {cn} from '@/lib/utils'
import "./globals.css";
import * as React from "react";
import './layout.css'
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {Providers} from "@/service/providers";


let metaDataCn = {
    title: 'Hash Space - 全球领先的一站式云算力平台',
    description: 'Hash Space提供全方位的一站式加密数字货币云算力服务，扩展您的加密货币投资潜力。',
    keywords: ['云算力','比特币挖矿','狗狗币挖矿','云挖矿','云计算','hashspace']
}
let metaDataEn = {
    title: 'Hash Space - Trusted Cloud Mining Platform',
    description: 'Hash Space offers comprehensive, one-stop cryptocurrency cloud mining services to expand your investment potential in the digital currency realm.',
    keywords: ['cloud mining bitcoin', 'cloud mining', 'bitcoin mining', 'litecoin mining', 'dogecoin mining', 'crypto cloud mining', 'hashspace']
}
let metaDataObj = metaDataEn;

if (typeof window !== 'undefined') {
    metaDataObj = window.localStorage.getItem('language') === 'en' ? metaDataEn : metaDataCn;
}

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: metaDataObj.title,
    description: metaDataObj.description,
    keywords: metaDataObj.keywords
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    return (
        <html lang="en">
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        </head>
        <body
            style={{
                position: 'absolute',
                width: '100%'
            }}
            className={cn(
                "min-h-screen bg-background font-sans antialiased bg-gray",
                fontSans.variable
            )}
        >
        <NextIntlClientProvider messages={messages}>
            <Providers>
                {children}
            </Providers>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
