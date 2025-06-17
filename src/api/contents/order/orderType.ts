import { PageInfo, PageRequest } from '../../type';

export type OrderListRequest = PageRequest & {
    'user-name'?: string;
    'store-idx'?: number;
    'pay-start-at'?: number;
    'pay-end-at'?: number;
    'pay-cancel-start-at'?: number;
    'pay-cancel-end-at'?: number;
    'package-goods-yn'?: 'Y' | 'N';
    'user-phone'?: string;
    'order-status'?: string;
    'update-sort-status'?: string;
    'update-start-at'?: number;
    'update-end-at'?: number;
};

export type OrderListResponse = {
    page_info: PageInfo;
    order_list: OrderItem[];
};

export type OrderItem = {
    order_id: string;
    user_idx: number;
    user_name: string;
    order_type: string;
    package_idx: number | null;
    package_name: string | null;
    order_status: string;
    pay_at: number | null;
    pay_cancel_at: number | null;
    order_price: string;
    pay_dis_price: string;
    pay_price: string;
    pay_commission: string | null;
    pg_type: string;
    pay_transaction_id: string | null;
    pay_cancel_comment: string | null;
    update_at: number | null;
    user_phone: string;
    booking_info_list: BookingInfoItem[];
};

export type BookingInfoItem = {
    booking_idx: number;
    user_idx: number;
    user_name: string;
    store_idx: number;
    store_name: string;
    store_biz_time_zone_id: string;
    store_category_idx: number;
    store_category_name: string;
    booking_date_from: number | string;
    booking_date_to: number | string;
    booking_status: string;
    use_date: string | null;
    goods_idx: number;
    goods_name: string;
};

export type OrderCsvRequest = {
    'user-name'?: string;
    'store-idx'?: number;
    'pay-start-at'?: number;
    'pay-end-at'?: number;
    'pay-cancel-start-at'?: number;
    'pay-cancel-end-at'?: number;
    'package-goods-yn'?: 'Y' | 'N';
    'user-phone'?: string;
    'order-status'?: string;
    'update-sort-status'?: string;
    'update-start-at'?: number;
    'update-end-at'?: number;
};

export type OrderCancelRequest = {
    order_id: string;
    reason: string;
};
