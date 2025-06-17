import { PageInfo, PageRequest } from '../../type';

export type RouteListRequest = PageRequest & {
    'bus-route-name'?: string;
    'bus-route-status'?: number;
    'city-idx'?: number;
};

export type RouteListGetResponse = {
    bus_route_list: BusRouteListType[];
    page_info?: PageInfo;
    available_count: number;
    close_count: number;
    total_count: number;
};

export type BusRouteListType = {
    bus_route_idx: number;
    bus_route_name: string;
    create_at: string;
    update_at: string;
    bus_route_status: string;
    bus_stop_list: BusStopInfoItem[];
};

export type BusStopInfoItem = {
    bus_stop_idx: number;
    bus_stop_name: string;
    create_at: number;
    location_lat: number;
    location_lon: number;
    location_name: string;
};

export type BusRouteGetResponse = {
    bus_route_idx: number;
    bus_route_name: string;
    create_at: string;
    update_at: string;
    bus_route_status: string;
    image_file_url: string | null;
    bus_route_position_list: BusRoutePositionItem[];
};

export type BusRoutePositionItem = {
    bus_route_position_idx: number | null;
    bus_route_position_name: string;
    bus_route_position_description: string;
    bus_stop_idx: number | null;
    location_seq_no: number;
    location_lat: number;
    location_lon: number;
    bus_route_duration: number;
    bookmark_yn: string;
};

export type BusRouteSaveRequest = {
    bus_route_idx?: number;
    bus_route_name: string;
    bus_route_status: string;
    image_file_url: string;
    bus_route_position_list: BusRoutePositionItem[];
};

export type BusRouteOrderSaveRequest = {
    bus_route_order_list: {
        bus_route_idx: number;
        bus_route_order: number;
    }[];
};
