import {Button, Checkbox} from "antd";
import css from './index.module.css';
import {useState} from "react";
import {useTranslations} from 'next-intl';

interface FirstConfirmProps {
    onConfirm: () => void;

}

const FirstConfirm = ({
    onConfirm
                      }: FirstConfirmProps) => {

    const t = useTranslations('firstConfirm');
    const [confirm, setConfirm] = useState(false);

    const handleCheckbox = (e: any) => {
        const checked = e.target.checked;
        setConfirm(checked);
    }

    return (
        <>
            <div className={css.title}>{t('notification')}</div>
            <div className={css.info}>
               {t('declarationContent')}
            </div>
            <div className={css.checkbox}>
                <div style={{marginRight: '8px'}}><Checkbox onChange={handleCheckbox} /></div>
                <div  >{t('declarationDesc')}</div>
            </div>
            <Button disabled={!confirm} onClick={onConfirm} shape={"round"} size={"large"} block type={"primary"}>{t('confirm')}</Button>
        </>
    )
}

export default FirstConfirm;