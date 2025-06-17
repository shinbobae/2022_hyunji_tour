import React, { useCallback } from 'react';
import { Button, Col, Row } from 'antd';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
interface ImageListPropsType {
    imageList: string[];
    setImageList: React.Dispatch<React.SetStateAction<string[]>>;
}

const ImageWrapStyle = styled.div`
    position: relative;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    background-color: #fff;
    & button {
        position: absolute;
        right: -8px;
        top: -8px;
    }
    & img {
        display: block;
        width: 100%;
        max-width: 100px;
        height: auto;
    }
`;

const ImageList = ({ imageList, setImageList }: ImageListPropsType) => {
    const onDeleteImage = useCallback(
        (removeImage: string) => {
            const newList = imageList.filter((image) => image !== removeImage);
            setImageList(newList);
        },
        [imageList],
    );
    return (
        <Row wrap gutter={[16, 16]}>
            {imageList.map((image) => (
                <Col key={`store-image${image}`}>
                    <ImageWrapStyle>
                        <Button
                            size={'small'}
                            shape="circle"
                            icon={<CloseOutlined />}
                            onClick={() => onDeleteImage(image)}
                        />
                        <img src={image} alt="스토어 미리보기 이미지" />
                    </ImageWrapStyle>
                </Col>
            ))}
        </Row>
    );
};

export default ImageList;
