import react, {useState} from 'react'
import copy from "copy-to-clipboard";
import React from "react";
import {message} from "antd";
import css from './index.module.css'
import { CopyOutlined } from "@ant-design/icons";
import {cn} from "@/lib/utils";
import CopyIcon from '../../../public/copy-icon.png'
import Image from "next/image";

export const Clipboard = ({str = '', linkUrl = '', maxTextWidth = '100%', style = {}, noBg=false}: {str: string, linkUrl?: string, maxTextWidth?:string, style?: Record<string, string>, noBg?: boolean}) => {
    const [data, setData] = useState(str)
    const [messageApi, contextHolder] = message.useMessage();


    const handleCopy = () => {
        messageApi.open({
            type: 'success',
            content: '复制成功'
        });
        copy(data)
    }

    return (<>
        <div className={cn( noBg? css.noBgWrapper : css.wrapper)} onClick={handleCopy}>
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