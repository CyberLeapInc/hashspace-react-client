export interface OrderItem {
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
    good?: Good;
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
     * 支付完成的跳转链接，例如：https://www.oklink.com/btc/tx/4c64c6b961308665da715258a27f70169abbc2e15783692470f893cfdece88a2
     */
    payment_transcation_id: string;
    /**
     * 挖矿开始
     */
    start_at?: number;
    /**
     * 状态，1-待支付；2-支付成功挖矿中；3-支付超时；4-挖矿结束
     */
    state?: number;
    address?: string;
    [property: string]: any;
}

/**
 * 云算力合约产品详情
 */
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
    unit: string;
    [property: string]: any;
}
export interface DataType {
    key: string;
    name: string;
    money: string;
    address: string;
}