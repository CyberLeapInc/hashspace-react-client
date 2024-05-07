import axios from "axios";

const ApiPrefix = 'https://api.test.hashspace.dev/'
const ApiPrefixProd = 'https://api.hashspace.com/';

const axiosInstance = axios.create({
    baseURL: ApiPrefix,
    withCredentials: true,
})

axiosInstance.interceptors.response.use((res) => {
    console.log(res)
    if (res.data.status === '401') {
        console.log('1111')
    }
    return res.data
})

export const startLogin = function (email: string, captcha: string): Promise<{
    session_id: string;
    totp_enabled: boolean;

}>  {
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

export const login = function (session_id: string, code: string, totp?: string) {
    return axiosInstance.post('/auth/login', {
        session_id,
        code,
        totp
    })
}

export const logout = () => {
    return axiosInstance.get('/auth/signout');
}

export const getUserInfo  = function () {
    return axiosInstance.get('/api/auth/user/info')
}