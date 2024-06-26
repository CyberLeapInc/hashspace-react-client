'use client'
import React, {createContext, useReducer, useEffect, useContext, ReactNode} from 'react';
import {UserInfo} from "@/service/interface";
import {Chain, getChainList, getUserInfo} from "@/service/api";
import {useMount} from "ahooks";
export interface State {
    userInfo: UserInfo;
    isMobile: boolean,
    chainList: Chain[];
}

export enum ActionType {
    setUserInfo = 'SET_USER_INFO',
    setChainList = 'SET_CHAIN_LIST',
    setIsMobile = 'SET_IS_MOBILE',
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
        address: []
    },
    isMobile: false,
    chainList: []
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
            const userInfo = res;
            dispatch({ type: ActionType.setUserInfo, payload: userInfo });
        })
        getChainList().then((res) => {
            const chainList = res.list;
            dispatch({ type: ActionType.setChainList, payload: chainList });
        })
    });

    return (
        <MyContext.Provider value={{ state, dispatch }}>
            {children}
        </MyContext.Provider>
    );
};
