import { PageInfo, PageRequest } from '../../type';

export type PackageListRequest = PageRequest & {
    'package-name'?: string;
};

export type PackageListResponse = {
    page_info: PageInfo;
    package_list: PackageListItem[];
};

export type PackageListItem = {
    package_idx: number;
    package_name: string;
    package_price: string;
    currency_idx: number;
    currency_name: string;
    package_description: string;
    package_image_url: string;
    goods_order_max_booking_cnt: number;
};

export type PackageGetResponse = PackageListItem & {
    package_goods_info_list: (PackageGoodsItem & { package_idx: number })[];
};

export type PackageGoodsItem = {
    store_category_idx: number;
    store_category_name: string;
    store_category_order: number;
    store_idx: number;
    store_name: string;
    goods_idx: number;
    goods_name: string;
    goods_type_idx: number;
    goods_type_name: string;
};

export type AddPackageRequest = {
    package_name: string;
    package_description: string;
    package_price: string;
    currency_idx: number;
    currency_name: string;
    goods_order_max_booking_cnt: number;
    package_goods_info_list: PackageGoodsItem[];
    image_file_url: string;
};
export type EditPackageRequest = AddPackageRequest & {
    package_idx: number;
};
