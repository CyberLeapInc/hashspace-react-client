import react, {useState} from 'react'
import copy from "copy-to-clipboard";
import React from "react";
import {message} from "antd";
import css from './index.module.css'
import { CopyOutlined } from "@ant-design/icons";
import {cn} from "@/lib/utils";
import CopyIcon from '../../../public/copy-icon.png'
import Image from "next/image";
import {useTranslations} from 'next-intl';

export const Clipboard = ({str = '', wrapperStyle = {}, linkUrl = '', maxTextWidth = '100%', style = {}, noBg=false}: {wrapperStyle? : Record<string, string>; str: string, linkUrl?: string, maxTextWidth?:string, style?: Record<string, string>, noBg?: boolean}) => {
    const t = useTranslations('buyProduct');
    const [data, setData] = useState(str)
    const [messageApi, contextHolder] = message.useMessage();


    const handleCopy = () => {
        messageApi.open({
            type: 'success',
            content:t("clipboard.copySuccess")
        });
        copy(data)
    }

    return (<>
        <div className={cn( noBg? css.noBgWrapper : css.wrapper)} style={wrapperStyle} onClick={handleCopy}>
            <span className={css.text} style={{
                maxWidth: maxTextWidth,
                color: linkUrl ? '#3c53ff' : '#333',
                textDecoration: linkUrl ? 'underline' : 'none',
                ...style
            }}>
                {
                    linkUrl && <a style={{cursor: 'pointer'}} href={linkUrl} target="_blank" rel="noreferrer noopener">{str}</a>
                }
                {
                    !linkUrl && <span>{str}</span>
                }
            </span>

            <Image className={css.copyIcon} src={CopyIcon} alt={'copyicon'}/>
        </div>
        {contextHolder}
    </>)

}

export default Clipboard;