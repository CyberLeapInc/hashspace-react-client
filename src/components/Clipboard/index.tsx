import react, {useState} from 'react'
import copy from "copy-to-clipboard";
import React from "react";
import {message} from "antd";
import css from './index.module.css'
import { CopyOutlined } from "@ant-design/icons";

export const Clipboard = ({str = '', linkUrl = ''}: {str: string, linkUrl?: string}) => {
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
        <div className={css.wrapper} onClick={handleCopy}>
            {
                linkUrl && <a href={linkUrl} target="_blank" rel="noreferrer noopener">{str}</a>
            }
            {
                !linkUrl && <span>{str}</span>
            }
            <CopyOutlined className={css.copyOutLine}/>
        </div>
        {contextHolder}
    </>)

}

export default Clipboard;