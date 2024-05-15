import axios from "axios";

const ApiPrefix = 'https://api.test.hashspace.dev/'
const ApiPrefixProd = 'https://api.hashspace.com/';

const axiosInstance = axios.create({
    baseURL: ApiPrefix,
    withCredentials: true,
})

enum status {
    OK = 200,
    NOT_LOGIN = 401,
    BUSINESS_ERROR = 400,
    SERVER_ERROR = 500,
    FORBIDDEN = 403
}

const handleBusinessError = (data: {code: number, message: string, details: any}): Promise<{
    message: string;
    details: Array<any> | string;
}> => {
    console.log('business error')
    console.log(data)
    if (data.code === 3 || data.code === 9) {
        return Promise.reject({
            message: data.message,
            details: {
                ...data.details[0],
                type: data.details[0]['@type'].split('.')[4]
            }
        })
    }
    return Promise.reject({
        message: 'unknown',
        details: ''
    })
}

// 路由白名单
// 目前是【首页 云算力 常见问题 计算器 关于】
const whiteList = [
    '',
    '/',
    '/cloudCount',
    '/calculator',
    '/login'
]

axiosInstance.interceptors.response.use((res) => {
    return res.data
}, (e) => {
    const {response} = e;
    switch (response.status) {
        case status.NOT_LOGIN:
            if (!whiteList.includes(location.pathname)) {
                location.replace('/')
            }
            break;
        case status.BUSINESS_ERROR:
            return handleBusinessError(response.data)
        case status.SERVER_ERROR:
            // todo
            break;
        case status.FORBIDDEN:
            // todo
            break;
        default:
            console.error(e);
            return Promise.reject(e)
    }

})

export const startLogin = function (email: string, captcha: string): Promise<{
    session_id: string;
    totp_enabled: boolean;

}> {
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

export const getUserInfo = function () {
    return axiosInstance.get('/api/auth/user/info')
}

export const getKycToken = function (): Promise<{ access_token: string }> {
    return axiosInstance.post('/api/auth/identity')
}

export const getTotpCode = (data: {
    /**
     * 场景：1-绑定TOTP；2-更新地址；3-解除绑定TOTP
     */
    scene: number;
    /**
     * 会话ID
     */
    session_id: string;
    [property: string]: any;
}) => {
    return axiosInstance.post('/api/auth/code', data)
}

export const startTotp = (): Promise<{
    /**
     * 需要前端渲染为二维码
     */
    qrcode_url: string;
    /**
     * secret
     */
    secret: string;
    /**
     * 会话ID
     */
    session_id: string;
    [property: string]: any;
}
> => {
    return axiosInstance.post('/api/auth/totp/start')
}

export const finishTotp = (data: {
                               /**
                                * 验证码
                                */
                               code: string;
                               /**
                                * 会话ID
                                */
                               session_id: string;
                               /**
                                * 2fa
                                */
                               totp: string;
                               [property: string]: any;
                           }
) => {
    return axiosInstance.post('/api/auth/totp', data);
}

export const unbindTotpStart = (): Promise<{
    session_id: string;
}> => {
    return axiosInstance.post('/api/auth/totp/unbind-start')
}

export const unbindTotpFinish = (data: {
                                     /**
                                      * 验证码
                                      */
                                     code: string;
                                     /**
                                      * 会话ID
                                      */
                                     session_id: string;
                                     [property: string]: any;
                                 }
) => {
    return axiosInstance.post('/api/auth/totp/unbind', data)
}

export const bindPhoneStart = (): Promise<{
    session_id: string;
}> => {
    return axiosInstance.post('/api/auth/bind-phone/start')
}
export const getPhoneCode = (data: {
                                      /**
                                       * cloudflare 验证码
                                       */
                                      captcha: string;
                                      /**
                                       * 是否发送原始手机号验证码，仅在用户换绑时，发送当前手机号时为true
                                       */
                                      is_current_phone: boolean;
                                      /**
                                       * 手机号区号
                                       */
                                      phone_country_code: string;
                                      /**
                                       * 手机号
                                       */
                                      phone_number: string;
                                      /**
                                       * 会话ID
                                       */
                                      session_id: string;
                                      [property: string]: any;
                                  }
) => {
    return axiosInstance.post('/api/auth/bind-phone/send', data)
}

export const bindPhoneFinish = (data: {
                                    /**
                                     * 验证码
                                     */
                                    code: string;
                                    /**
                                     * 当前手机号的验证码；仅当换绑时必须传入
                                     */
                                    current_code?: string;
                                    /**
                                     * 会话ID
                                     */
                                    session_id: string;
                                    [property: string]: any;
                                }
) => {
    return axiosInstance.post('/api/auth/bind-phone', data)
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
        params: {
            page: 1,
            page_size: 10,
        }
    })
}


export interface GoodListResponse {
    goods: Good[];
    [property: string]: any;
}

export interface Good {
    /**
     * 可挖币种，例如：BTC, LTC, DOGE
     */
    currency?: string[];
    list?: GoodListItem[];
    [property: string]: any;
}

export interface GoodListItem {
    /**
     * 算法
     */
    algorithm?: string;
    /**
     * 可挖币种，例如：BTC, LTC, DOGE
     */
    currency?: string[];
    /**
     * 日电费。单位为USD。后边为 /{unit}/D，例如：$0.00002342/T/D
     */
    daily_electricity?: string;
    /**
     * 日收益。单位为USD。后边为 /{unit}/D，例如：$0.00002342/T/D
     */
    daily_income?: string;
    /**
     * 描述，例如：快速开始
     */
    description?: string;
    /**
     * 结束时间，秒级别时间戳
     */
    end_at: number;
    /**
     * 云算力ID，例如：BTC001
     */
    good_id?: string;
    /**
     * 预期收益。单位USD，例如：$12.292
     */
    income?: string;
    /**
     * 总共可买量，单个用户最多能买多少算力。例如 50T
     */
    max_qty?: string;
    /**
     * 最小购买量，最少购买多少算力，例如购买最少10T算力
     */
    min_qty?: string;
    /**
     * 商品名，例如： 30天新手
     */
    name?: string;
    /**
     * 功耗。单位为J/{unit}，例如：29.6 J/T。
     */
    power_consumption?: string;
    /**
     * 算力单价。单位为USD。后边为 /{unit}，美元价格。例如：$1.50/T
     */
    price?: string;
    /**
     * 总剩余可买，总共剩余多少算力可买。如果为0，则为售罄。例如：1000 T
     */
    remain_qty?: string;
    /**
     * 开始时间，秒级别时间戳
     */
    start_at: number;
    /**
     * 购买量步长，步长购买多少算力,  例如步长20T，只能购买30 , 50, 70, 90, 110 ...
     */
    step_qty?: string;
    /**
     * 算力单位 K M G T P E，https://minerstat.com/hashrate-converter
     */
    unit?: string;
    [property: string]: any;
}

export const getProductList = (): Promise<GoodListResponse> => {
    return axiosInstance.get('/api/public/cloudhash')
}

