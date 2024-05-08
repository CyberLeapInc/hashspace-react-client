import axios from "axios";

const ApiPrefix = 'https://api.test.hashspace.dev/'
const ApiPrefixProd = 'https://api.hashspace.com/';

const axiosInstance = axios.create({
    baseURL: ApiPrefix,
    withCredentials: true,
})

axiosInstance.interceptors.response.use((res) => {
    console.log('==========')
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

export const getKycToken = function () : Promise<{access_token: string}> {
    return axiosInstance.post('/api/auth/identity')
}

export interface LoginHistoryResponse {
    list: LoginHistoryItem[];
    pagination: 分页;
    [property: string]: any;
}

export interface LoginHistoryItem {
    /**
     * 登陆时间
     */
    created_at: number;
    /**
     * 登陆IP
     */
    ip: string;
    /**
     * 登陆位置
     */
    location: string;
    /**
     * 设备名
     */
    user_agent: string;
    [property: string]: any;
}

/**
 * 分页
 */
export interface 分页 {
    /**
     * 页数
     */
    page: number;
    /**
     * 每夜数量
     */
    page_size: number;
    /**
     * 总数量
     */
    total_count: number;
    /**
     * 总页数
     */
    total_page: number;
    [property: string]: any;
}


export const getLoginHistory = function (): Promise<LoginHistoryResponse> {
    return axiosInstance.get('/api/auth/login-history', {
        params:{
            page: 1,
            page_size: 10,
        }
    })
}