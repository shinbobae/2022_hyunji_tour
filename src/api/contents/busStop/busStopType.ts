export type BusStopItem = {
    bus_stop_idx?: number;
    create_at: number;
    bus_stop_name: string;
    bus_stop_description: string;
    city_idx: number;
    city_name: string;
    location_name: string;
    location_lat: string;
    location_lon: string;
    use_yn: string;
};

export type BusStopPostRequest = {
    bus_stop_list: BusStopPostItem[];
};

export type BusStopPostItem = {
    bus_stop_idx?: number;
    bus_stop_name: string;
    bus_stop_description: string;
    city_idx: number;
    city_name: string;
    location_name: string;
    location_lat: number;
    location_lon: number;
};
