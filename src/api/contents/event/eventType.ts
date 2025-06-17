import { PageInfo, PageRequest } from '../../type';

export type EventListRequest = PageRequest & {
    use_yn?: string;
};

export type EventListResponse = {
    page_info: PageInfo;
    event_list: EventListItem[];
};

export type EventListItem = {
    event_idx: number;
    image_file_url: string;
    button_name: string;
    button_url: string;
    use_yn: string;
};

export type AddEventRequest = {
    image_file_url: string;
    button_name: string;
    button_url: string;
    use_yn: string;
};

export type EditEventRequest = AddEventRequest & {
    event_idx: number;
};
