import { PageInfo } from '../../type';

export type BusItem = {
    bus_idx: number;
    bus_name: string;
    bus_route_idx: number;
    manager_idx: number;
    manager_name: string;
    drive_yn: string;
};

export type BusList = {
    bus_list: BusItem[];
    page_info: PageInfo;
    total_count: number;
    available_count: number;
    close_count: number;
};

export type BusSaveRequest = {
    bus_idx?: number;
    bus_name: string;
    bus_route_idx: number;
    manager_idx: number;
    drive_yn: string;
};

export type BusDeleteRequest = {
    bus_list: BusDeleteItem[];
};
export type BusDeleteItem = {
    bus_idx: number;
};

export type BusLocationRequest = {
    'bus-route-idx': number;
};

export type BusLocationResponse = {
    bus_idx: number;
    bus_name: string;
    bus_location_info: BusLocationInfo;
}[];

export type BusLocationInfo = {
    bus_route_position_idx: number;
    locate_seq_no: number;
    location_lat: number;
    location_lon: number;
    latest_location_lat: number;
    latest_location_lon: number;
};
