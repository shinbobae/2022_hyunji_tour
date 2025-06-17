import { PageInfo, PageRequest } from '../../type';

export type BookingListRequest = PageRequest & {
    'user-name'?: string;
    'booking-status'?: string;
    'store-idx'?: number;
    'pay-start-at'?: number;
    'pay-end-at'?: number;
    'pay-cancel-start-at'?: number;
    'pay-cancel-end-at'?: number;
    'guest-yn'?: string;
};

export type BookingDownloadRequest = {
    'store-idx'?: number;
    'start-at'?: number;
    'end-at'?: number;
};

export type BookingListResponse = {
    booking_list: BookingItem[];
    page_info: PageInfo;
    total_count: number;
    available_count: number;
    cancel_count: number;
};

export type BookingItem = {
    booking_idx: number;
    user_idx: number;
    // user_name: string;
    store_idx: number;
    store_name: string;
    store_biz_time_zone_id: string;
    store_category_idx: number;
    store_category_name: string;
    booking_date_from: number;
    booking_date_to: number;
    booking_status: string;
    goods_idx: number;
    goods_name: string;
    booking_token: string;
    use_date: string | null;
    user_info: BookingUserInfo;
};
export type BookingGoodsItem = {
    goods_idx: number;
    goods_name: string;
    goods_price: string;
    currency_name: string;
    goods_qty: number;
};

export type BookingUserInfo = {
    user_idx: number;
    user_type: string;
    user_name: string;
    user_email: string;
    user_phone: string;
    del_yn: string;
};

export type AddBookingRequest = {
    user_name: string;
    user_email: string;
    user_phone: string;
    store_idx: number;
    goods_idx: number;
    booking_date_from: number;
    booking_date_to: number;
};
