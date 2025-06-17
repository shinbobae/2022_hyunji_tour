import { ResultResponse } from './type';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Modal, notification } from 'antd';
const APIDV_URL = process.env.REACT_APP_API_HOST;
const REST_URL = APIDV_URL;

const handleResponse = <T>(response: ResultResponse<T>) => {
    console.log('handleResponse', response);
    switch (response.code) {
        case '200':
            return response.data;
        case '1000':
            Modal.confirm({
                title: '로그인 토큰이 만료되어 로그아웃되었습니다.',
                centered: true,
                okText: '확인',
                okType: 'danger',
                cancelText: '취소',
                onOk() {
                    window.localStorage.removeItem('utToken');
                    location.href = '/login';
                },
            });
            return;
        case '1009':
            Modal.confirm({
                title: '로그인 토큰이 만료되어 로그아웃되었습니다.',
                centered: true,
                okText: '확인',
                okType: 'danger',
                cancelText: '취소',
                onOk() {
                    window.localStorage.removeItem('utToken');
                    location.href = '/login';
                },
            });
            return;
        case '1001':
            notification['warning']({
                message: '이메일 아이디를 확인해 주세요.',
            });
            return;
        case '1002':
            notification['warning']({
                message: '비밀번호를 확인해 주세요.',
            });
            return;
        case '1003':
            notification['warning']({
                message: '이미 등록된 이메일 입니다.',
            });
            return;
        case '2003':
            notification['warning']({
                message: '지난 날짜로 QR 생성은 불가능합니다.',
            });
            return;
        case '3004':
            notification['warning']({
                message: `삭제된 정류장은 경로에서 사용 중인 정류장 입니다.`,
                style: { wordBreak: 'keep-all' },
            });
            return;
        case '3005':
            notification['warning']({
                message: `이미 지정된 버스 관리자 입니다. 지정 되지 않은 관리자만 등록 가능합니다.`,
                style: { wordBreak: 'keep-all' },
            });
            return;
        case '400':
            notification['warning']({
                message: '잘못된 요청입니다.',
            });
            return;
        case '401':
            notification['warning']({
                message: '조회 권한이 없습니다.',
            });
            return;
        default:
            return;
    }
};

const api_common: AxiosInstance = axios.create({
    baseURL: REST_URL,
    headers: { 'Content-Type': 'application/json' },
    // withCredentials: true,
});

api_common.interceptors.request.use(
    function (config) {
        const token = window.localStorage.getItem('utToken');
        if (token) {
            config.headers = { Authorization: 'Bearer ' + token };
        }
        return config;
    },
    function (error) {
        console.log('api interceptor error', error);
        return Promise.reject(error);
    },
);

api_common.interceptors.response.use(
    function (response) {
        if (response.data.code === '200') {
            return response.data;
        } else {
            handleResponse(response.data);
        }
    },
    function (error) {
        console.log('api interceptor response error', error);
        handleResponse(error.response.data);
        return Promise.reject(error);
    },
);

export default api_common;

/*
    String OK = "200";
    String BAD_REQUEST = "400";
    String UNAUTHORIZED = "401";
    String FORBIDDEN = "403";
    String NOT_FOUND = "404";
    String SERVER_ERROR = "500";
    String SERVICE_UNAVAILABLE = "503";

    String INVALID_TOKEN = "1000";
    String INVALID_EMAIL = "1001";
    String INVALID_PASSWORD = "1002";
    String DUPLICATE_EMAIL = "1003";
    String INVALID_USER = "1004";
    String INVALID_AUTH_CODE = "1005";
    String AUTHENTICATION_FAILED = "1006";
    String ALREADY_LOGIN = "1007";
    String INVALID_LOGIN_DEVICE = "1008";

    String INVALID_STORE = "2000";
    String INVALID_GOODS = "2001";
    String INVALID_BOOKING = "2002";
    String INVALID_BOOKING_DATE = "2003";
    String ORDER_QTY_EXCEED = "2004";
    String INVALID_STORE_CATEGORY = "2005";
    String INVALID_CURRENCY = "2006";
    String INVALID_GOODS_TYPE = "2007";
    String INVALID_STORE_IMG = "2008";

    String INVALID_BUS_STOP = "3000";
    String INVALID_BUS_ROUTE = "3001";
    String INVALID_BUS_ROUTE_POSITION = "3002";
    String INVALID_BUS = "3003";

    String INVALID_MANAGER = "4000";
    String INVALID_MANAGER_ROLE = "4001";
*/
