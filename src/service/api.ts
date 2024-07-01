import axios from "axios";
import {message} from "antd";

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
    if (data.code === 3 || data.code === 9) {
        return Promise.reject({
            message: data.message,
            details: {
                ...data.details[0],
                type: data.details[0]? data.details[0]['@type'] ? data.details[0]['@type'].split('.')[4] : '' : '',
            }
        })
    }
    if (data.code === 13) {
        return Promise.reject({
          message: data.message || '服务器错误',
          details: {}
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
    '/productList',
    '/calculator',
    '/login'
]

axiosInstance.interceptors.response.use((res) => {
    console.log(res)
    if (res.data.code === 13) {
        message.error('服务器错误')

        return Promise.reject(res.data)
    }
    return res.data
}, (e) => {
    console.log('!~~~~')
    console.log(e)
    console.log('!~~~~')
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
            message.error('服务器错误')
            return Promise.reject(response.data)
        case status.FORBIDDEN:
            message.error('无权限')
            return Promise.reject(response.data)
        default:
            console.error(e);
            return Promise.reject(response.data)
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
    goods: GoodWrapper[];
    [property: string]: any;
}

export interface GoodWrapper {
    /**
     * 可挖币种，例如：BTC, LTC, DOGE
     */
    currency?: string[];
    list?: GoodListItem[];
    mining_currency: string;
}

export interface GoodListItem {
    /**
     * 算法
     */
    algorithm?: string;
    /**
     * 收益币种，例如：BTC, LTC, DOGE
     */
    currency: string[];
    /**
     * 日电费。单位为USD。后边为 /{unit}/D，例如：$0.00002342/T/D
     */
    daily_electricity?: string;
    /**
     * 日收益。单位为USD。后边为 /{unit}/D，例如：$0.00002342/T/D
     */
    daily_income?: string;
    /**
     * 默认购买的算力数量，例如：100 T
     */
    default_buy_qty: string;
    /**
     * 描述，例如：快速开始
     */
    description?: string;
    /**
     * 结束时间，秒级别时间戳
     */
    end_at?: number;
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
     * 挖矿币种
     */
    mining_currency: string;
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
    start_at?: number;
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

export interface GoodDetailResponse {
    item: GoodDetail;
    [property: string]: any;
}
type currency = 'BTC' | 'DOGE' | 'LTC'

export interface GoodDetail {
    /**
     * 算法
     */
    algorithm: string;
    /**
     * 可挖矿币种
     */
    currency: currency[];
    /**
     * 日电费
     */
    daily_electricity: string;
    /**
     * 日收益
     */
    daily_income: string;
    /**
     * 描述
     */
    description: string;
    /**
     * 结束时间
     */
    end_at: number;
    /**
     * 云算力ID
     */
    good_id: string;
    /**
     * 预期收益
     */
    income: string;
    /**
     * 最大购买量
     */
    max_qty: string;
    /**
     * 最小购买量
     */
    min_qty: string;
    /**
     * 商品名
     */
    name: string;
    /**
     * 功耗
     */
    power_consumption: string;
    /**
     * 算力单价
     */
    price: string;
    /**
     * 总剩余可买
     */
    remain_qty: string;
    /**
     * 开始时间
     */
    start_at: number;
    /**
     * 购买量步长
     */
    step_qty: string;
    /**
     * 算力单位 T。G
     */
    unit: string;
    mining_currency: string;
    [property: string]: any;
}

export const getProductDetail = (goodId: string): Promise<GoodDetailResponse> => {
    return axiosInstance.get(`/api/public/cloudhash/${goodId}`)
}
export interface PubInoRes {
    /**
     * 收款地址
     */
    payment_currency: PaymentCurrency[];
    [property: string]: any;
}

export interface PaymentCurrency {
    /**
     * 币种，如BTC，LTC，USDT
     */
    currency: string;
    /**
     * 支持的网络，如：ERC20, TRC20
     */
    network: string[];
    networks: Array<{
        name: string;
        full_name: string;
    }>;
    [property: string]: any;
}
export const getPubInfo = (): Promise<PubInoRes> => {
    return axiosInstance.get(`/api/public/info`)
}

export interface PublicMarketResponse {
    list: List[];
    [property: string]: any;
}

export interface List {
    /**
     * 计算器初始化价格
     */
    calculator_init_price: string;
    /**
     * 计算器最大价格
     */
    calculator_max_price: string;
    /**
     * 计算器最小价格
     */
    calculator_min_price: string;
    /**
     * 计算器比价步长
     */
    calculator_price_step: string;
    /**
     * 币种
     */
    currency: string;
    /**
     * 难度
     */
    difficulty: string;
    /**
     * 最新价格
     */
    last_usdt_price: string;
    /**
     * 全网算力，需要转换为 K,M, G, T, P
     */
    network_hashrate: string;
    [property: string]: any;
}


export const getPublicMarket = ():Promise<PublicMarketResponse> => {
    return axiosInstance.post('/api/public/market', {})
}


export interface BuyProductReq {
    /**
     * 币种，如：USDT
     */
    currency: string;
    /**
     * 电费，如：$120； 电费=electricity_day * good.electricity_cost * hashrate_qty
     */
    electricity_cost: string;
    /**
     * 充值电费天数，如：10天;  限制 最小good.min_electricity_day;  步长为 good.step_electricity_day
     */
    electricity_day: number;
    /**
     * 下单购买的算力商品ID，如：BTC001
     */
    good_id: string;
    /**
     * 算力费用，如：$30； 算力费用=hashrate_qty*good.cost
     */
    hashrate_cost: string;
    /**
     * 购买算力数量，如：100 T; 限制 最小为 good.min_qty;  步长为 good.step_qty; 最大为 good.total_remain_qty
     */
    hashrate_qty: string;
    /**
     * 网络，如：ERC20
     */
    network: string;
    /**
     * 总费用，如：$150； 总费用=算力费用+电费
     */
    total_cost: string;
    /**
     * 交易ID,
     * uuidv4。用于防止重复下单，如果遇到网络波动，下单失败，则可重新传入该trace_id。避免重复下单，如：8fcae8d5-1460-4543-b923-24c7aab7b358
     */
    trace_id: string;
    [property: string]: any;
}

export interface BuyProductRes {
    /**
     * 收款地址
     */
    address: string;
    /**
     * 金额
     */
    amount: string;
    /**
     * 订单失效时间戳，秒级别
     */
    expired_at: number;
    /**
     * 订单号
     */
    order_id: string;
    [property: string]: any;
}

export const buyProduct = (data:BuyProductReq): Promise<BuyProductRes> => {
    return axiosInstance.post('/api/auth/cloudhash/buy', data)
}

export enum paymentResult {
    paying=1,
    done,
    timeout
}

export interface PaymentResultResponse {
    /**
     * 支付状态，1-待支付；2-已支付；3-支付超时
     */
    state: paymentResult;
    [property: string]: any;
}
export const getPaymentResult = (id: string): Promise<PaymentResultResponse> => {
    return axiosInstance.get(`/api/auth/user/payment/${id}`)
}

export interface OrderListItem {
    /**
     * 总费用，例如：$120.9
     */
    cost?: string;
    /**
     * 日期
     */
    created_at?: number;
    /**
     * 电费，例如：$30
     */
    electricity_cost?: string;
    /**
     * 挖矿结束
     */
    end_at?: number;
    /**
     * 云算力合约产品详情
     */
    good?: OrderListGood;
    /**
     * 算力，如：100 T，单位为{good.unit}
     */
    hashrate?: string;
    /**
     * 合约费用，例如:  $90
     */
    hashrate_cost?: string;
    /**
     * 订单ID，如：E202323121312
     */
    order_id: string;
    /**
     * 支付到期时间
     */
    payment_expired_at?: number;
    /**
     *
     * 支付完成的地址链接，例如：https://www.blockchain.com/explorer/addresses/btc/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     */
    payment_link: string;
    /**
     * 支付的地址，如：bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     */
    payment_link_source: string;
    /**
     * 支付的请求参数，用于重新支付，参考购买算力接口
     */
    payment_request: PaymentRequest;
    /**
     * 挖矿开始
     */
    start_at?: number;
    /**
     * 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
     */
    state?: number;
}

/**
 * 云算力合约产品详情
 */
export interface OrderListGood {
    algorithm: string;
    currency: string[];
    daily_electricity: string;
    daily_income: string;
    description: string;
    end_at: number;
    good_id: string;
    income: string;
    max_qty: string;
    min_qty: string;
    name: string;
    power_consumption: string;
    price: string;
    remain_qty: string;
    start_at: number;
    step_qty: string;
    unit: string;
}

/**
 * 支付的请求参数，用于重新支付，参考购买算力接口
 */
export interface PaymentRequest {
    /**
     * 币种
     */
    currency: string;
    /**
     * 电费
     */
    electricity_cost: string;
    /**
     * 充值电费天数
     */
    electricity_day: number;
    /**
     * 下单购买的算力商品ID
     */
    good_id: string;
    /**
     * 算力费用
     */
    hashrate_cost: string;
    /**
     * 购买算力数量
     */
    hashrate_qty: string;
    /**
     * 网络
     */
    network: string;
    network_full_name: string;

    /**
     * 总费用
     */
    total_cost: string;
    /**
     * 交易ID
     */
    trace_id: string;
    transfer_amount: string;
}

export interface OrderListResponse {
    list: OrderListItem[];
    pagination: PageInfo;
    [property: string]: any;
}

/**
 * 云算力合约产品详情
 */
export interface OrderGood {
    algorithm: string;
    currency: string[];
    daily_electricity: string;
    daily_income: string;
    description: string;
    end_at: number;
    good_id: string;
    income: string;
    max_qty: string;
    min_qty: string;
    name: string;
    power_consumption: string;
    price: string;
    remain_qty: string;
    start_at: number;
    step_qty: string;
    unit: string;
}

/**
 * 分页
 */
export interface PageInfo {
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
}

export const getOrderList = (page = 1, pageSize = 20): Promise<OrderListResponse> => {
    return axiosInstance.get('/api/auth/user/order', {
        params: {
            page,
            page_size: pageSize
        }
    })
}

export const bindAddressStart = (currency : string, remark: string, address: string): Promise<{
    session_id: string
}> => {
    return axiosInstance.post('/api/auth/address/start', {
        currency,
        remark,
        address
    })
}

export const bindAddressFinish = (data: {
    /**
     * 6位验证码
     */
    code: string;
    session_id: string;
    /**
     * 2fa验证码
     */
    totp?: string;
}) => {
    return axiosInstance.post('/api/auth/address', data)
}

export const deleteOrder = (id: string) => {
    return axiosInstance.delete(`/api/auth/user/order/${id}`)
}
export interface ElectricityResponse {
    /**
     * 电费余额，例如: $4.8
     */
    balance: string;
    /**
     * 预计可挖矿天数，例如：10天
     */
    estimate_remain_day: number;
    /**
     * 电费历史明细
     */
    list: ElectricityList[];
    /**
     * 最低充值电费金额，例如：$50
     */
    min_electricity_charge_amount: string;
    pagination: PageInfo;
    /**
     * 充值电费步长，例如：$10
     */
    step_electricity_charge_amount: string;
    /**
     * 昨日电费，例如: $1.23
     */
    yesterday_cost: string;
    [property: string]: any;
}

export interface ElectricityList {
    /**
     * 金额，例如: $1.23
     */
    amount?: string;
    /**
     * 时间
     */
    created_at?: number;
    /**
     * 算力订单号，例如：E2023234243
     */
    order_id?: string;
    /**
     * 支付超时时间
     */
    payment_expired_at: number;
    /**
     *
     * 支付完成的地址跳转链接，例如：https://www.blockchain.com/explorer/addresses/btc/bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     */
    payment_link: string;
    /**
     * 支付完成的地址，如：bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     */
    payment_link_source: string;
    /**
     * 1-待支付；2-已支付；3-支付失败
     */
    state: number;
    /**
     * 类型：1-充值；2-扣除电费
     */
    type?: number;
    payment_request: {
        amount:string
        currency: string
        network: string
        network_full_name: string
        trace_id:string
        transfer_amount: string
    }

}

export const getElectricityInfo = ({page, pageSize}: {
    page: number,
    pageSize: number,
}): Promise<ElectricityResponse> => {
    return axiosInstance.get('/api/auth/electricity', {
        params: {
            page,
            page_size: pageSize
        }
    })
}

export interface chargeElectricityRequest {
    /**
     * 充值金额，如: $ 30; 限制两位；最小为：min_electricity_charge_amount
     */
    amount: string;
    /**
     * 充值币种，如：USDT
     */
    currency: string;
    /**
     * 网络，如：ERC20
     */
    network: string;
    /**
     * 交易ID, uuidv4。用于防止重复下单，如果遇到网络波动，下单失败，则可重新传入该trace_id。避免重复下单 必需
     * 如：8fcae8d5-1460-4543-b923-24c7aab7b358
     */
    trace_id: string;
}
export interface chargeElectricityResponse {
    /**
     * 地址
     */
    address: string;
    /**
     * 付款金额
     */
    amount: string;
    /**
     * 到期时间
     */
    expired_at: number;
    /**
     * 订单ID
     */
    order_id: string;
}
export const chargeElectricity = (data: chargeElectricityRequest): Promise<chargeElectricityResponse> => {
    return axiosInstance.post('/api/auth/electricity/charge', data)
}

export interface GetChainListResponse {
    list: Chain[];
    [property: string]: any;
}

export interface Chain {
    /**
     * 计算器初始化价格
     */
    calculator_init_price: string;
    /**
     * 计算器最大价格
     */
    calculator_max_price: string;
    /**
     * 计算器最小价格
     */
    calculator_min_price: string;
    /**
     * 计算器比价步长
     */
    calculator_price_step: string;
    /**
     * 币种
     */
    currency: currency;
    /**
     * 难度
     */
    difficulty: string;
    /**
     * 最新价格
     */
    last_usdt_price: string;
    /**
     * 全网算力，需要转换为 K,M, G, T, P
     */
    network_hashrate: string;
}

export const getChainList = (): Promise<GetChainListResponse> => {
    return axiosInstance.get('/api/public/chain')
}

export interface FullRevenueRequest {
    /**
     * 难度，例如：8394713171361
     */
    difficulty: string;
    /**
     * 云算力ID，例如：BTC001
     */
    good_id: string;
    /**
     * 购买算力数量，例如:  15 T。算力单位为产品对应的算力单位
     */
    hashrate_qty: string;
    /**
     * 当前币价，例如：$ 75000.91
     */
    price: Price;
}

/**
 * 当前币价，例如：$ 75000.91
 */
export interface Price {
    /**
     * BTC币价
     */
    BTC?: string;
    /**
     * DOGE币价
     */
    DOGE?: string;
    /**
     * LTC币价
     */
    LTC?: string;
    [property: string]: any;
}

export interface FullRevenueResponse  {
    /**
     * 总收入币种，例如：BTC
     */
    currency: string;
    /**
     * 日收入币，例如：0.000045 BTC
     */
    daily_coin_income: DailyCoinIncome;
    /**
     * 日收入USD，例如：$1.32
     */
    daily_income: string;
    /**
     * 合约支出USD，例如：$150
     */
    hashrate_cost: string;
    /**
     * 净收入USD，例如：$81.3
     */
    net_income: string;
    /**
     * 回本天数，例如：30天; 如果小于等于0，则为无法回本
     */
    payback_day: number;
    /**
     * 回本币价，例如：$73000.01; 如果价格为多个时如LTC，DOGE，该数据无效
     */
    payback_price: string;
    /**
     * 投资回报率，例如：3.0596， 为回报率305.96%
     */
    roi: string;
    /**
     * 总收入币，例如：0.00025 BTC
     */
    total_coin_income: TotalCoinIncome;
    /**
     * 总支出USD，例如：$303.3
     */
    total_cost: string;
    /**
     * 总收入USD; 下单页的预期收益，例如：$222.23
     */
    total_income: string;
    [property: string]: any;
}
export interface TotalCoinIncome {
    /**
     * BTC总币收益
     */
    BTC: string;
    /**
     * DOGE总币收益
     */
    DOGE: string;
    /**
     * LTC总币收益
     */
    LTC: string;
    [property: string]: any;
}
/**
 * 日收入币，例如：0.000045 BTC
 */
export interface DailyCoinIncome {
    /**
     * BTC日收益
     */
    BTC: string;
    /**
     * LTC日收益
     */
    LTC: string;
    [property: string]: any;
}


export const fullRevenue = (data:FullRevenueRequest): Promise<FullRevenueResponse> => {
    return axiosInstance.post('/api/public/cloudhash/full-revenue', data)
}

export interface OrderDetailResponse {
    /**
     * 币的收益
     */
    coin_income: CoinIncome[];
    /**
     * 币种，如 BTC
     */
    currency: string;
    /**
     * 算力曲线
     */
    history: HashrateHistoryItem[];
    item: Item;
    /**
     * 矿池观察者链接，为url
     */
    pool_observer_link: string;
    /**
     * 实时交付算力，如100.11 TH； 下边所有包含算力的单位为 item.good.unit 如 T
     */
    realtime_hashrate: string;
    /**
     * 今日已挖预估收益；单位为币，如 0.000013222 BTC
     */
    today_estimate_income: string;
    /**
     * 总收益；单位为币，如 0.0123123 BTC
     */
    total_income: string;
    /**
     * 昨日电费；单位为 USD，如 $11.77
     */
    yesterday_electricity_cost: string;
    /**
     * 昨日交付算力，如100.11 TH
     */
    yesterday_hashrate: string;
    /**
     * 昨日收益；单位为币，如 0.000123123 BTC
     */
    yesterday_income: string;
}

export interface Item {
    cost: string;
    created_at: number;
    electricity_cost: string;
    end_at: number;
    good: Good;
    hashrate: string;
    hashrate_cost: string;
    payment_expired_at: number;
    start_at: number;
    state: number;
    [property: string]: any;
}

export interface Good {
    algorithm: string;
    currency: string[];
    daily_electricity: string;
    daily_income: string;
    description: string;
    end_at: number;
    good_id: string;
    income: string;
    max_qty: string;
    min_qty: string;
    name: string;
    power_consumption: string;
    price: string;
    remain_qty: string;
    start_at: number;
    step_qty: string;
    /**
     * 算力单位
     */
    unit: string;
    [property: string]: any;
}

export interface CoinIncome {
    /**
     * 币种
     */
    currency: string;
    /**
     * 今日已挖预估收益；单位为币，如 0.000013222 BTC
     */
    today_estimate_income: string;
    /**
     * 总收益；单位为币，如 0.0123123 BTC
     */
    total_income: string;
    /**
     * 昨日总收益；单位为币，如 0.0123123 BTC
     */
    yesterday_income: string;
    [property: string]: any;
}

export interface HashrateHistoryItem {
    /**
     * 时间，为秒级别时间戳
     */
    created_at: number;
    /**
     * 算力，如 11.2 T, 单位为item.good.unit
     */
    hashrate: string;
}

export interface GoodDetail {
    cost: string;
    created_at: number;
    electricity_cost: string;
    end_at: number;
    good: {
        algorithm: string;
        currency: currency[];
        daily_electricity: string;
        daily_income: string;
        description: string;
        end_at: number;
        good_id: string;
        income: string;
        max_qty: string;
        min_qty: string;
        name: string;
        power_consumption: string;
        price: string;
        remain_qty: string;
        start_at: number;
        step_qty: string;
        /**
         * 算力单位
         */
        unit: string;
    };
    hashrate: string;
    hashrate_cost: string;
    payment_expired_at: number;
    start_at: number;
    state: number;
}

export const getOrderInfo = (id: string): Promise<OrderDetailResponse> => {
    return axiosInstance.get(`/api/auth/user/order/${id}`)
}

export interface PaymentListResponse {
    list: PaymentItem[];
    pagination: PageInfo;
}

export interface PaymentItem {
    /**
     * 达标率，例如：0.9。为90%的达标率
     */
    compliance_rate?: string;
    /**
     * 日期
     */
    created_at?: number;
    /**
     * 收益，例如：0.012312313 BTC
     */
    income?: Income[];
    /**
     * 收益币种，例如： BTC
     */
    income_currency?: string;
    /**
     * 支付txid的URL
     */
    payment_link: string;
    /**
     * 支付txid
     */
    payment_link_source: string;
    /**
     * 实际算力，例如：90 T
     */
    real_hashrate?: string;
    /**
     * 支付状态，1-已支付；2-待支付
     */
    status: number;
    /**
     * 理论算力，例如：100 T
     */
    theory_hashrate?: string;
    /**
     * 算力单位，例如T
     */
    unit: string;
    [property: string]: any;
}

export interface Income {
    /**
     * 收益金额，例如：0.012312313 BTC
     */
    amount: string;
    /**
     * 收益币种，例如： BTC
     */
    currency: string;
    /**
     * 支付txid的URL
     */
    payment_link: string;
    /**
     * 支付txid
     */
    payment_link_source: string;
    /**
     * 支付状态，1-已支付；2-待支付
     */
    status: number;
    [property: string]: any;
}

export const getPaymentList = (id:string): Promise<PaymentListResponse> => {
    return axiosInstance.get(`/api/auth/user/order/${id}/payment`, {
        params: {
            page: 1,
            page_size: 30
        }
    })
}

export const getElectricityCanUseLeftDays = (amount: string): Promise<{
    day: string
}> => {
    return axiosInstance.post('/api/auth/electricity/charge/day', {
        amount
    })
}