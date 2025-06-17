import React, { useCallback, useEffect } from 'react';
import { Input, Modal, notification } from 'antd';
import { TableDataStyle, TableHeadStyle, TableStyle } from './style';
import useInput from '../../../hooks/useInput';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { cancelOrder } from '../../../api/contents/order/order';
import orderSlice from '../../../store/slice/order/order';

type Props = {
    id: string | null;
    open: boolean;
    setDetailOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setCancelOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const CancelModal = ({ id, open, setDetailOpen, setCancelOpen }: Props) => {
    const dispatch = useAppDispatch();
    const { deleteFailure, deleteLoading, deleteSuccess } = useAppSelector((state) => state.order);
    const [message, onChangeMessage] = useInput('');
    const onCancelOrder = useCallback(() => {
        if (id) {
            dispatch(cancelOrder({ order_id: id, reason: message }));
        }
    }, [id, message]);

    useEffect(() => {
        if (deleteFailure) {
            notification['warning']({ message: '취소 실패했습니다.' });
            dispatch(orderSlice.actions.changeInitState());
        }
        if (deleteSuccess) {
            notification['success']({ message: '취소 완료되었습니다.' });
            setDetailOpen(false);
            setCancelOpen(false);
        }
    }, [deleteFailure, deleteSuccess]);
    return (
        <Modal
            title="주문 취소"
            visible={open}
            onOk={onCancelOrder}
            onCancel={() => setCancelOpen(false)}
            okText={'주문 취소'}
            okType={'danger'}
            cancelText={'닫기'}
            zIndex={1000}
            width={800}
            confirmLoading={deleteLoading}>
            <TableStyle>
                <tr>
                    <TableHeadStyle>주문 ID</TableHeadStyle>
                    <TableDataStyle>{id}</TableDataStyle>
                </tr>
                <tr>
                    <TableHeadStyle>취소사유</TableHeadStyle>
                    <TableDataStyle>
                        <Input value={message} onChange={onChangeMessage} placeholder={'취소사유'} />
                    </TableDataStyle>
                </tr>
            </TableStyle>
        </Modal>
    );
};

export default CancelModal;
