'use client'
import React, {createContext, useReducer, useEffect, useContext, ReactNode} from 'react';
import {UserInfo} from "@/service/interface";
export interface State {
    userInfo: UserInfo;
}

export enum ActionType {
    setUserInfo = 'SET_USER_INFO'
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
            status: 0
        },
        address: []
    },
};

export const MyContext = createContext<{ state: State; dispatch: React.Dispatch<Action> }>({
    state: initialState,
    dispatch: () => undefined
});

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_USER_INFO':
            return { ...state, userInfo: action.payload };
        default:
            return state;
    }
};

export const MyContextProvider= ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <MyContext.Provider value={{ state, dispatch }}>
            {children}
        </MyContext.Provider>
    );
};
