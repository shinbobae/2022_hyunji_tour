import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, notification, Upload } from 'antd';
import React, { ChangeEventHandler, useCallback, useEffect, useRef, useState } from 'react';

interface UploaderPropsType {
    getImage: any;
}

const UploadButton = ({ getImage }: UploaderPropsType) => {
    const [loading, setLoading] = useState(false);
    const uploadInput = useRef<HTMLInputElement>(null);

    const onClickImageUpload = useCallback(() => {
        if (uploadInput.current) uploadInput.current.click();
    }, [uploadInput.current]);

    const onChangeImage = (e: any) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('img', e.target.files[0]);
        getImage(e.target.files[0]);
        setLoading(false);
    };

    return (
        <div style={{ width: '100%' }}>
            <Button icon={<UploadOutlined />} onClick={onClickImageUpload} block type={'primary'} loading={loading}>
                Click to Upload
            </Button>
            <input type="file" hidden name="file" ref={uploadInput} onChange={onChangeImage} />
        </div>
    );
};

export default UploadButton;
