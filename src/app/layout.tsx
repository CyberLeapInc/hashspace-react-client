import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import {cn} from '@/lib/utils'
import "./globals.css";
import * as React from "react";
import './layout.css'
import {Providers} from "@/service/providers";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
})

export const metadata: Metadata = {
    title: 'Hash Space',
    description: 'some Description',
}

export default function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
        <body
            className={cn(
                "min-h-screen bg-background font-sans antialiased bg-gray",
                fontSans.variable
            )}
        >
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}
