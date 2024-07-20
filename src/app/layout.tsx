import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import {cn} from '@/lib/utils'
import "./globals.css";
import * as React from "react";
import './layout.css'
import {NextIntlClientProvider} from 'next-intl';
import {getLocale, getMessages} from 'next-intl/server';
import {Providers} from "@/service/providers";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: 'Hash Space',
    description: 'some Description',
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();
    return (
        <html lang="en">
        <body
            style={{
                position: 'absolute'
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
