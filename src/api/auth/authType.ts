export type LoginRequest = {
    manager_email: string;
    manager_password: string;
    login_device: LoginDevice;
};

export type LoginDevice = {
    device_uuid: string;
    device_name: string;
    device_os: string;
    push_token: string;
};

export type RegisterRequest = {
    email_token: string;
    signup_user_info: RegisterUser;
};

export type RegisterUser = {
    user_password: string;
    user_name: string;
    user_phone: string;
};

export type EmailAuthRequest = {
    user_email: string;
    auth_objective: string;
};

export type EmailAuthConfirm = {
    user_email: string;
    auth_code: string;
};

export type ChangePasswordRequest = {
    email_token: string;
    user_password: string;
};

export type ChangeUserInfoRequest = {
    user_password: string; // 비밀번호 변경이 아니면 빈 문자열
    user_name: string;
    user_phone: string;
};

export type LogoutRequest = {
    device_uuid: string;
};
