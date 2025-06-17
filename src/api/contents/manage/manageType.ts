import { PageInfo, PageRequest } from '../../type';

export type ManageGetRequest = PageRequest & {
    'manager-name'?: string;
    'manager-role-idx'?: number;
};

export type ManageSaveRequest = {
    manager_email: string;
    manager_password: string;
    manager_name: string;
    manager_phone: string;
    manager_role_idx: number;
    store_idx: number;
};

export type ManageEditRequest = {
    manager_idx: number;
    manager_password: string;
    manager_name: string;
    manager_phone: string;
    suspend_yn: string;
    manager_role_idx: number;
    store_idx: number;
};
export type ManageRoleResponseItem = {
    manager_role_idx: number;
    manager_role_name: string;
};
export type ManageRoleResponse = ManageRoleResponseItem[];

export type ManageListResponse = {
    manager_list: ManageListResponseItem[];
    page_info: PageInfo;
};

export type ManageListResponseItem = {
    manager_idx: number;
    create_at: number;
    update_at: number;
    suspend_yn: string;
    manager_email: string;
    manager_name: string;
    manager_phone: string;
};

export type ManagerGetResponse = {
    manager_idx: number;
    suspend_yn: string;
    manager_email: string;
    manager_name: string;
    manager_phone: string;
    manager_role_idx: number;
    manager_role_name: string;
    store_idx: number;
    store_name: string;
};
