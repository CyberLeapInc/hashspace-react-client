'use client'
import {Drawer} from "antd";
import China from '../../../public/china.png'
import England from '../../../public/united-kingdom.png'
import {useEffect, useRef, useState} from "react";
import css from "@/components/LanguageSelector/index.module.css";
import Image from "next/image";
import Arrow from "../../../public/arrow-up-outline-black.png";
import DividerCus from "@/components/ui/dividerCus";
import ArrowDownSolid from '../../../public/arrow-solid.png'
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import {useMount} from "ahooks";
import Cookie from 'js-cookie'

const Content = ({onClick,currentLocal, onClose}: {onClick: (locale: string) => void, currentLocal: string, onClose: () => void}) => {
    const [innerLocal, setInnerLocal] = useState('en')
    const handleOnClick = (locale: string) => {
        onClick(locale)
        setInnerLocal(locale)
        onClose()
    }
    useEffect(() => {
        setInnerLocal(currentLocal)
    }, []);
    return <div className={css.contentWrapperMobile}>
        <div className={css.mobileTitle}>
            <span>{
                currentLocal === 'zh-CN' ? '语言' : 'Language'
            }</span>
            <CloseOutlined onClick={onClose} size={12}/>
        </div>
        <DividerCus margin={10}/>
        <div style={{
            color: currentLocal === 'en' ? '#333333' : '#666666',
            fontWeight: currentLocal === 'en' ? 500 : 400
        }} onClick={() => handleOnClick('en')} className={css.contentWrapperRowMobile}>
            <span>English</span>
            {
                innerLocal === 'en' && <CheckOutlined/>
            }
        </div>
        <div style={{
            color: currentLocal === 'zh-CN' ? '#333333' : '#666666',
            fontWeight: currentLocal === 'zh-CN' ? 500 : 400
        }} onClick={() => handleOnClick('zh-CN')} className={css.contentWrapperRowMobile}>
            <span>中文简体</span>
            {
                innerLocal === 'zh-CN' && <CheckOutlined/>
            }
        </div>
    </div>
}


const LanguageSelectorMobile = ({
                                    onClick
                                }: {
    onClick: () => void
}) => {
    const [open, setOpen] = useState(false)
    const [currentLocal, setCurrentLocal] = useState('en' as string)
    const [currentImage, setCurrentImage] = useState(England as any)
    const ref = useRef();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // @ts-ignore
            ref.current = window.document.getElementById('root')
        }
    }, []);
    const handleOnContentClick = (locale: string) => {
        if (locale === currentLocal) return
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('language', locale)
            document.cookie = `language=${locale}; path=/`;
            window.location.reload()
            setOpen(false)
        } else {
            setOpen(false)
        }
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const locale = Cookie.get('language') || 'en'
            setCurrentLocal(locale)
        } else {
            setCurrentLocal('en')
        }
    }, [])
    useEffect(() => {
        if (currentLocal === 'zh-CN') {
            setCurrentImage(China)
        } else {
            setCurrentImage(England)
        }
    }, [currentLocal]);
    const handleOutClick = () => {
        onClick()
        setOpen(true)
    }
    return <>
        <div className={css.selectorWrapperMobile} onClick={handleOutClick}>
            <Image src={currentImage || England} alt={'language_icon'} width={28} height={28}/>
            <div className={css.languageNameMobile}>
                {
                    currentLocal === 'zh-CN' ? '中文简体' : 'English'
                }
            </div>
            <Image src={ArrowDownSolid} alt={'arrow'} width={6} height={4} />
        </div>
        <Drawer
            placement="bottom"
            closable={false}
            open={open}
            getContainer={ref.current}
            height={'calc(100vh - 200px)'}
            onClose={() => setOpen(false)}
            bodyStyle={{
                padding: '0',
                backgroundColor: ' #FFFFFF',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.01s',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                zIndex: 9999
            }}
        >
            <Content onClose={() => setOpen(false)} currentLocal={currentLocal} onClick={handleOnContentClick} />
        </Drawer>
    </>
}

export default LanguageSelectorMobile;