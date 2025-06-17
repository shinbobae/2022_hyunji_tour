import { PageInfo, PageRequest } from '../../type';

export type UserListRequest = PageRequest & {
    'user-name'?: string;
};

export type UserListResponse = {
    user_list: UserItem[];
    page_info: PageInfo;
};

export type UserItem = {
    user_idx: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    create_at: number;
    del_yn: string;
};

export type SaveUserRequest = {
    user_email: string;
    user_password: string;
    user_name: string;
    user_phone: string;
};

export type EditUserRequest = {
    user_idx: number;
    user_password: string;
    user_name: string;
    user_phone: string;
};

export type SaveUserResponse = {
    user_idx: number;
    user_name: string;
    user_email: string;
    user_phone: string;
    create_at: number;
    del_yn: string;
};
