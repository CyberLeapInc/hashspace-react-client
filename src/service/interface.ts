export interface UserInfo {
    address: Address[];
    /**
     * 账户注册时间
     */
    created_at: number;
    /**
     * 邮箱
     */
    email: string;
    /**
     * 是否通过KYC
     */
    has_identity: boolean;
    /**
     * 是否绑定手机号
     */
    has_phone: boolean;
    /**
     * 是否开启2FA
     */
    has_totp: boolean;
    /**
     * KYC详情
     */
    identity: Identity;
    /**
     * 手机号区号
     */
    phone_country_code: string;
    /**
     * 手机号
     */
    phone_number: string;
    /**
     * 用户可读uid
     */
    uid: string;
    [property: string]: any;
}

export interface Address {
    /**
     * 地址。如 bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
     */
    address: string;
    /**
     * 币种。如BTC
     */
    currency: string;
    /**
     * 备注。如 我的交易所地址
     */
    remark: string;
    [property: string]: any;
}

/**
 * KYC详情
 */
export interface Identity {
    /**
     * KYC失败原因
     */
    fail_reason: string;
    /**
     * KYC审核状态
     */
    status: number;
    [property: string]: any;
}
