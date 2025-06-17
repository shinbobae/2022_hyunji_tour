import { PageInfo, PageRequest } from '../../type';

export type StoreListRequest = PageRequest & {
    'store-name'?: string;
    'biz-yn'?: string;
    'store-category-idx'?: number;
};

export type StoreListResponse = {
    store_list: [];
    page_info: PageInfo;
    total_count: number;
    open_count: number;
    close_count: number;
};

export type StoreListItem = {
    store_idx: number;
    create_at: string;
    store_name: string;
    store_biz_time_from: string;
    store_biz_time_to: string;
    // store_biz_yn: string;
    store_biz_day: string;
};

export type StoreSaveRequest = {
    store_idx?: number;
    store_name: string;
    city_idx: number;
    city_name: string;
    store_address: string;
    store_phone: string;
    store_description: string;
    store_category_idx: number;
    store_biz_time_from: string;
    store_biz_time_to: string;
    store_biz_day: string;
    // store_biz_yn: string;
    store_location_lat: number;
    store_location_lon: number;
    goods_list: StoreGoodsItem[];
    image_list: string[];
    store_biz_time_zone_id: string;
};

export type StoreGoodsItem = {
    goods_idx?: number;
    goods_name: string;
    goods_price: string;
    goods_type_idx: number;
    currency_idx: number;
    max_booking_cnt: number;
    package_goods_yn: string;
};

export type StoreGoodsTypeList = StoreGoodsTypeItem[];
export type StoreGoodsTypeItem = { goods_type_idx: number; goods_type_name: string };
export type StoreCurrencyList = StoreCurrencyItem[];
export type StoreCurrencyItem = { currency_idx: number; currency_name: string };
export type StoreCategoryTypeList = StoreCategoryTypeItem[];
export type StoreCategoryTypeItem = { store_category_idx: number; store_category_name: string };

export type StoreGetResponse = {
    store_idx: number;
    store_name: string;
    store_description: string;
    store_phone: string;
    store_category_idx: number;
    city_idx: number;
    city_name: string;
    store_address: string;
    store_location_lat: number;
    store_location_lon: number;
    store_biz_time_from: string;
    store_biz_time_to: string;
    store_biz_yn: string;
    store_biz_day: string;
    goods_list: StoreGoodsItem[];
    image_list: string[];
    store_biz_time_zone_id: string;
};

export type GoodsListRequest = {
    storeIdx: number;
    'package-goods-yn'?: 'Y' | 'N';
};

export type GoodsListResponse = GoodsListItem[];

export type GoodsListItem = {
    goods_idx: number;
    goods_name: string;
    goods_price: string;
    goods_type_idx: number;
    goods_type_name: string;
    currency_idx: number;
    currency_name: string;
};
