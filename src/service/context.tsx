'use client'
import React, {createContext, ReactNode, useEffect, useReducer} from 'react';
import {UserInfo} from "@/service/interface";
import {Chain, getChainList, getPubInfo, getUserInfo, PubInoRes} from "@/service/api";
import {useMount} from "ahooks";

export interface State {
    userInfo: UserInfo;
    isMobile: boolean,
    chainList: Chain[];
    pubInfo: PubInoRes;
}

export enum ActionType {
    setUserInfo = 'SET_USER_INFO',
    setChainList = 'SET_CHAIN_LIST',
    setIsMobile = 'SET_IS_MOBILE',
    setPubInfo = 'SET_PUB_INFO',
}

interface Action {
    type: ActionType;
    payload?: any;
}

export const initialState: State = {
    userInfo: {
        email: "",
        created_at: 0,
        has_identity: false,
        has_totp: false,
        has_phone: false,
        phone_number: "",
        phone_country_code: "",
        uid: "",
        identity: {
            fail_reason: "",
            status: -1
        },
        address: [],
        warning_electricity_balance: false,
        insufficient_electricity_balance: false
    },
    isMobile: false,
    chainList: [],
    pubInfo: {
        payment_currency: [],
        currency_rates: {
            USDC: {
                USD: '0'
            },
            USDT: {
                USD: '0'
            },
            LTCT: {
                USD: '0'
            },
        }
    }
};


export const MyContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => undefined
});

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.setUserInfo:
            return { ...state, userInfo: action.payload };
        case ActionType.setChainList:
            return { ...state, chainList: action.payload };
        case ActionType.setIsMobile:
            return { ...state, isMobile: action.payload };
        case ActionType.setPubInfo:
            return { ...state, pubInfo: action.payload };
        default:
            return state;
    }
};

export const MyContextProvider= ({ children, value }: { children: ReactNode,value: {
        isMobile: boolean
    } }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        if (value) {
            dispatch({ type: ActionType.setIsMobile, payload: value.isMobile });
        }
    }, [value]);

    useMount(() => {
        getUserInfo().then((res) => {
            dispatch({ type: ActionType.setUserInfo, payload: res });
        })
        getChainList().then((res) => {
            const chainList = res.list;
            dispatch({ type: ActionType.setChainList, payload: chainList });
        })
        getPubInfo().then((res) => {
            dispatch({ type: ActionType.setPubInfo, payload: res });
        })
    });

    return (
        <MyContext.Provider value={{ state, dispatch }}>
            {children}
        </MyContext.Provider>
    );
};
