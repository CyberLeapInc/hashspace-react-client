import react from 'react'
import css from './index.module.css'
import {Button} from "antd";


export interface EasyConfirmContentProps {
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText: string;
    cancelText: string;
    children?: React.ReactNode;
}
export const EasyConfirmContent = ({title, content, onConfirm, onCancel, confirmText, cancelText, children} :EasyConfirmContentProps ) => {
    return (
        <div className={css.wrapper}>
            <div className={css.title}>{title}</div>
            <div className={css.content}>{content}</div>
            {children}
            <div className={css.buttons}>
                <Button size={"large"} type={"primary"} shape={"round"} onClick={onCancel} className={css.button}>{cancelText}</Button>
                <Button size={"large"} type={'primary'} shape={"round"} ghost  onClick={onConfirm} className={css.button}>{confirmText}</Button>
            </div>
        </div>
    )
}