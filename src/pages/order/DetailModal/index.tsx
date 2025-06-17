import React, { useCallback } from 'react';
import { OrderDataType } from '../../../store/slice/order/order';
import { Badge, Button, Modal, Tag, Typography } from 'antd';
import { TableDataStyle, TableHeadStyle, TableStyle } from '../CancelModal/style';
import BookingExpandTable from '../BookingExpandTable';

type Props = {
    data: OrderDataType | null;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCancelId: React.Dispatch<React.SetStateAction<string | null>>;
    setCancelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const colors = [
    'pink',
    'red',
    'yellow',
    'orange',
    'cyan',
    'green',
    'blue',
    'purple',
    'geekblue',
    'magenta',
    'volcano',
    'gold',
    'lime',
];
const DetailModal = ({ data, open, setOpen, setCancelId, setCancelOpen }: Props) => {
    return (
        <Modal
            title="주문 상세 정보"
            visible={open}
            footer={
                data?.orderStatus !== '1'
                    ? [
                          <Button key="back" onClick={() => setOpen(false)}>
                              닫기
                          </Button>,
                      ]
                    : [
                          <Button key="back" onClick={() => setOpen(false)}>
                              닫기
                          </Button>,
                          <Button
                              key="submit"
                              danger
                              onClick={() => {
                                  setCancelId(data ? data.orderId : null);
                                  setCancelOpen(true);
                              }}>
                              주문 취소
                          </Button>,
                      ]
            }
            onCancel={() => setOpen(false)}
            zIndex={100}
            width={1200}>
            <TableStyle>
                <tr>
                    <TableHeadStyle>주문 ID</TableHeadStyle>
                    <TableDataStyle>{data?.orderId}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>예약자명</TableHeadStyle>
                    <TableDataStyle>{data?.userName}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>타입</TableHeadStyle>
                    <TableDataStyle>
                        {data?.orderType === '0' ? '일반' : data?.orderType === '1' ? '패키지' : ''}
                    </TableDataStyle>
                </tr>
                {data?.packageName !== '' && (
                    <tr>
                        <TableHeadStyle>패키지명</TableHeadStyle>
                        <TableDataStyle>
                            <Tag color={'magenta'}>{data?.packageName}</Tag>
                        </TableDataStyle>
                    </tr>
                )}
                <tr>
                    <TableHeadStyle>상품</TableHeadStyle>
                    <TableDataStyle>
                        {data?.bookingInfoList && <BookingExpandTable data={data.bookingInfoList} />}
                    </TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>상태</TableHeadStyle>
                    <TableDataStyle>
                        {data?.orderStatus === '0'
                            ? `결제요청`
                            : data?.orderStatus === '1'
                            ? `결제성공`
                            : data?.orderStatus === '2'
                            ? `결제실패`
                            : data?.orderStatus === '3'
                            ? `취소성공`
                            : data?.orderStatus === '4'
                            ? '취소실패 '
                            : '-'}
                    </TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>결제일시</TableHeadStyle>
                    <TableDataStyle>{data?.payAt}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>최종변경일</TableHeadStyle>
                    <TableDataStyle>{data?.orderUpdateDate}</TableDataStyle>
                </tr>
                {data?.payCancelAt !== '' && (
                    <>
                        <tr>
                            <TableHeadStyle>취소일시</TableHeadStyle>
                            <TableDataStyle>{data?.payCancelAt}</TableDataStyle>
                        </tr>
                        <tr>
                            <TableHeadStyle>취소사유</TableHeadStyle>
                            <TableDataStyle>{data?.payCancelComment}</TableDataStyle>
                        </tr>
                    </>
                )}
                <tr>
                    <TableHeadStyle>주문 및 할인금액</TableHeadStyle>
                    <TableDataStyle>
                        {data?.orderPrice} <Typography.Text type={'danger'}>(-{data?.payDisPrice})</Typography.Text>
                    </TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>결제금액</TableHeadStyle>
                    <TableDataStyle>{data?.payPrice}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>수수료(%)</TableHeadStyle>
                    <TableDataStyle>{data?.payCommission}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>PG 타입</TableHeadStyle>
                    <TableDataStyle>{data?.pgType}</TableDataStyle>
                </tr>
            </TableStyle>
        </Modal>
    );
};

export default DetailModal;
