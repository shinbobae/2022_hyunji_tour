import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, Input, notification, Upload } from 'antd';
import React, { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import api_common from '../../api/api-common';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '../../hooks/useToolkit';
import { uploadPackageImage } from '../../api/contents/package/package';
import packageSlice from '../../store/slice/package/package';

interface UploderPropsType {
    category: 'store' | 'package';
    getImage: (image: string) => void;
}

const Uploader = ({ category, getImage }: UploderPropsType) => {
    const dispatch = useAppDispatch();
    const { uploadFailure, uploadResponse } = useAppSelector((state) => state.package);
    const [loading, setLoading] = useState(false);
    const uploadInput = useRef<HTMLInputElement>(null);
    const onClickImageUpload = useCallback(() => {
        if (uploadInput.current) uploadInput.current.click();
    }, [uploadInput.current]);

    useEffect(() => {
        dispatch(packageSlice.actions.changeInitState());
    }, []);
    const onChangeImage = (e: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('img', e.target.files[0]);
        const token = window.localStorage.getItem('utToken');
        if (category === 'store') {
            api_common
                .post(`/store/upload/image`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: 'Bearer ' + token,
                    },
                })
                .then((response) => {
                    console.log('response', response);
                    const getData = response.data;
                    if (getData) {
                        getImage(getData[0]);
                        setLoading(false);
                    }
                    return;
                })
                .catch((error) => {
                    console.log('err', error);
                    notification['warning']({
                        message: '업로드에 실패했습니다.',
                    });
                    setLoading(false);
                    return;
                });
        } else if (category === 'package') {
            setLoading(true);
            const formData = new FormData();
            formData.append('img', e.target.files[0]);
            dispatch(uploadPackageImage(formData));
        }
    };

    useEffect(() => {
        if (uploadFailure) {
            notification['warning']({
                message: '업로드에 실패했습니다.',
            });
            setLoading(false);
        }
        if (uploadResponse !== null) {
            getImage(uploadResponse);
            setLoading(false);
        }
    }, [uploadFailure, uploadResponse]);

    return (
        <div style={{ width: '100%' }}>
            <Button icon={<UploadOutlined />} onClick={onClickImageUpload} block type={'primary'} loading={loading}>
                Click to Upload
            </Button>
            <input type="file" hidden name="file" ref={uploadInput} onChange={onChangeImage} />
        </div>
    );
};

export default Uploader;
