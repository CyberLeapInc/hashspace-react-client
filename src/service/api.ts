import axios from "axios";

const ApiPrefix = 'https://api.test.hashspace.dev/'
const ApiPrefixProd = 'https://api.hashspace.com/';

const axiosInstance = axios.create({
    baseURL: ApiPrefix,
    withCredentials: true,
})

export const startLogin = function (email: string, captcha: string) {
    return axiosInstance.post('/auth/login/start', {
        email,
        captcha
    })
}

export const getLoginCode = function (session_id: string) {
    return axiosInstance.post('/auth/login/code', {
        session_id
    })
}

export const login = function (session_id: string, code: string, totp: string) {
    return axiosInstance.post('/auth/login', {
        session_id,
        code,
        totp
    })
}