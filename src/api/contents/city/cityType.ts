import { PageInfo, PageRequest } from '../../type';

export type CityListRequest = PageRequest & {
    'country-name'?: string;
};

export type CityListResponse = {
    page_info: PageInfo;
    city_list: CityListItem[];
};

export type CityListItem = {
    city_idx: number;
    country_idx: number;
    country_name: string;
    city_name: string;
    service_yn: string;
};

export type AddCityRequest = {
    country_idx: number;
    country_name: string;
    city_name: string;
    service_yn: string;
};

export type EditCityRequest = AddCityRequest & {
    city_idx: number;
};

export type SaveCityResponse = {
    city_idx: number;
    country_idx: number;
    country_name: string;
    city_name: string;
    service_yn: string;
};
