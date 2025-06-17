export interface ResultResponse<T> {
    code: string;
    data: T;
}
// const OK = "0000";
// const OK_NODATA = "0001";

// const BAD_REQUEST = "1001";
// const UNAUTHORIZED_REQUEST = "1002";
// const INTERNAL_SERVER_ERROR = "1003";
// const NOT_FOUND = "1004";
// const OUT_OF_LENGTH_REQUEST = "1005";

// const INVALID_TOKEN = "2001";
// const INVALID_ID = "2002";
// const INVALID_PASSWORD = "2003";

export type PageInfo = {
    page: number;
    limit: number;
    offset: number;
    total: number;
};

export type PageRequest = {
    page?: number;
    limit?: number;
};

export type ObjectOption = {
    value: string | number;
    label: string;
};
