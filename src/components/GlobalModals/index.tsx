import NotificationBar from "@/components/NotificationBar";
import {Modal} from "antd";
import NoEleFee from "@/components/NoEleFee";
import FirstConfirm from "@/components/FirstConfirm";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {MyContext} from "@/service/context";
import {useMount} from "ahooks";


export const GlobalModals = () => {
    const [isNoFeeModel, setIsNoFeeModel] = useState(false);
    const [isShowNotification, setIsShowNotification] = useState(false);
    const [isShowFirstConfirm, setIsShowFirstConfirm] = useState(false);
    const {state} = useContext(MyContext);

    useMount(() => {
        const confirmed = window.localStorage.getItem('first_confirm') || '0';
        if (confirmed === '0') {
            setTimeout(() => {
                setIsShowFirstConfirm(true);
            }, 1000); // 延迟3秒显示
        }
    })

    const handleOnFirstConfirm = () => {
        window.localStorage.setItem('first_confirm', '1');
        setIsShowFirstConfirm(false)
    }

    useEffect(() => {
        if (state?.userInfo?.insufficient_electricity_balance) {
            setIsNoFeeModel(true)
        }
        if (state?.userInfo?.warning_electricity_balance) {
            setIsShowNotification(true)
        }
    }, [state]);


    return <>
        <NotificationBar show={isShowNotification} onClose={() => setIsShowNotification(false)} />
        <Modal width={420} closable={false} open={isNoFeeModel} footer={null}>
            <NoEleFee onCharge={() => setIsNoFeeModel(false)} />
        </Modal>
        <Modal closable={false} open={isShowFirstConfirm && !state?.userInfo?.has_identity} footer={null} >
            <FirstConfirm onConfirm={handleOnFirstConfirm} />
        </Modal>
    </>
}