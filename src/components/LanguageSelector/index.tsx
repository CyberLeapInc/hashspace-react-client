'use client'
import {Popover} from "antd";
import Image from "next/image";
import China from '../../../public/china.png'
import England from '../../../public/united-kingdom.png'
import css from './index.module.css'
import Arrow from '../../../public/arrow-up-outline-black.png'
import {useEffect, useState} from "react";


const Content = ({onClick}: {onClick: (locale: string) => void}) => {
    return <div className={css.contentWrapper}>
        <div onClick={() => onClick('zh-CN')} className={css.contentWrapperRow}>
            <Image src={China} alt={'language_icon'} width={18} height={18}/>
            <span style={{marginLeft: '8px'}}>中文简体</span>
        </div>
        <div onClick={() => onClick('en')} className={css.contentWrapperRow}>
            <Image src={England} alt={'language_icon'} width={18} height={18}/>
            <span style={{marginLeft: '8px'}}>English</span>
        </div>
    </div>
}

const LanguageSelector = ({}) => {
    const [open, setOpen] = useState(false)
    const [currentLocal, setCurrentLocal] = useState('zh-CN' as string)
    const [currentImage, setCurrentImage] = useState(England as any)
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
    };
    const handleOnContentClick = (locale: string) => {
        if (locale === currentLocal) return
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('language', locale)
            window.location.reload()
            setOpen(false)
        } else {
            setOpen(false)
        }
    }
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const locale = window.localStorage.getItem('language') || 'en'
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

    return <Popover
        overlayInnerStyle={{
            padding: 0,
            borderRadius: '20px',
            minWidth: '210px'
        }}
        open={open}
        onOpenChange={handleOpenChange}
        content={() => <Content onClick={handleOnContentClick}/>}
    >
        <div className={css.selectorWrapper}>
            <Image src={currentImage || England} alt={'language_icon'} width={32} height={32}/>
            <Image src={Arrow} alt={'arrow'} width={11} height={6} className={css.arrowStyle} style={{
                transform: open ? 'rotate(0)' : 'rotate(180deg)',
            }}/>
        </div>
    </Popover>
}

export default LanguageSelector;