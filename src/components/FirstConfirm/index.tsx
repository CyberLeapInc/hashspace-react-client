import {Button, Checkbox} from "antd";
import css from './index.module.css';
import {useState} from "react";

interface FirstConfirmProps {
    onConfirm: () => void;

}

const FirstConfirm = ({
    onConfirm
                      }: FirstConfirmProps) => {
    const [confirm, setConfirm] = useState(false);

    const handleCheckbox = (e: any) => {
        const checked = e.target.checked;
        setConfirm(checked);
    }

    return (
        <>
            <div className={css.title}>提示</div>
            <div className={css.info}>
                本人在此确认并申明：本人非古巴、伊朗、朝鲜、叙利亚以及其他受到相关国家或政府或国际机构管理或执行的制裁的国家或地区居民。Hash Space提供的服务在本人所在的国家或地区是符合法律法规和相关政策的。
            </div>
            <div className={css.checkbox}>
                <div style={{marginRight: '8px'}}><Checkbox onChange={handleCheckbox} /></div>
                <div  >由于本人所在的国家或者地区使用Hash Space提供的服务系违法导致的所有法律风险和责任将完全由本人独立承担。</div>
            </div>
            <Button disabled={!confirm} onClick={onConfirm} shape={"round"} size={"large"} block type={"primary"}>确定</Button>
        </>
    )
}

export default FirstConfirm;