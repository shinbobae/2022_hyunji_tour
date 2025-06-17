import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Button, Input, InputNumber, notification, Select, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import scrollIntoView from 'scroll-into-view';
import { DndProvider, useDrag, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TableWrapStyle } from './style';
import { useAppDispatch, useAppSelector } from '../../../hooks/useToolkit';
import { getBusStopList } from '../../../api/contents/busStop/busStop';
import { getCurrencyType, getGoodsType } from '../../../api/contents/store/store';
import { getCityList } from '../../../api/contents/city/city';
import { ObjectOption } from '../../../api/type';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { CheckboxToggle } from '../../../assets/style/CheckboxButton';
import { StarFilled } from '@ant-design/icons';
interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    index: number;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
    onCheckRowKey: any;
    'data-row-key': string;
}

const type = 'DraggableBodyRow';

interface TableProps {
    store: string;
    column: ColumnsType<any> | undefined;
    tableData: any[];
    total: number | string;
    selectedRow: any[];
    onSelectRow: (key: React.Key[], row: any[]) => void;
    onChangeData: (data: any) => void;
    addYn: boolean;
    onCheckRowKey?: any;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: any;
    index: number;
    children: React.ReactNode;
}

const DraggableBodyRow = ({ index, moveRow, className, onCheckRowKey, style, ...restProps }: DraggableBodyRowProps) => {
    const ref = useRef<HTMLTableRowElement>(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
        accept: type,
        collect: (monitor) => {
            const { index: dragIndex } = monitor.getItem() || {};
            if (dragIndex === index) {
                return {};
            }
            return {
                isOver: monitor.isOver(),
                dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
            };
        },
        drop: (item: { index: number }) => {
            moveRow(item.index, index);
        },
    });
    const [, drag] = useDrag({
        type,
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    drop(drag(ref));

    return (
        <tr
            ref={ref}
            className={`${className}${isOver ? dropClassName : ''}`}
            style={{
                cursor: 'move',
                ...style,
            }}
            {...restProps}
        />
    );
};

const NormalBodyRow = ({ index, moveRow, className, style, ...restProps }: DraggableBodyRowProps) => {
    const ref = useRef<HTMLTableRowElement>(null);

    return (
        <tr
            ref={ref}
            className={className}
            style={{
                ...style,
            }}
            {...restProps}
        />
    );
};

const EditCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}: EditableCellProps) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return <td {...restProps}>{editing ? <div>????!{inputNode}</div> : children}</td>;
};

const EditTable = ({
    store,
    column,
    tableData,
    total,
    selectedRow,
    onSelectRow,
    onChangeData,
    addYn,
    onCheckRowKey,
}: TableProps) => {
    const dispatch = useAppDispatch();
    const [editingKey, setEditingKey] = useState('');
    const { busStopList } = useAppSelector((state) => state.busStop);
    const { storeGoodsTypeOptionList, storeCurrencyOptionList } = useAppSelector((state) => state.storeDetail);
    const { cityOptionList } = useAppSelector((state) => state.city);
    useEffect(() => {
        dispatch(getBusStopList());
        dispatch(getGoodsType());
        dispatch(getCurrencyType());
        dispatch(getCityList({}));
    }, []);

    const isEditing = (record: any) => record.key === editingKey;

    const onEdit = (record: any) => {
        setEditingKey(record.key);
    };

    const onChangeInput = (key: string, index: number, e: any) => {
        if (key === 'latitude' || key === 'longitude') {
            const reg = /^-?\d*(\.\d*)?$/;
            if (!reg.test(e.target.value)) {
                notification['warning']({
                    key: 'alert',
                    message: '위도, 경도는 숫자로 입력해 주세요.',
                });
                return;
            }
        }
        if (key === 'maximum') {
            const reg = /^-?\d*(\.\d*)?$/;
            if (!reg.test(e.target.value)) {
                notification['warning']({
                    key: 'alert',
                    message: '최대치는 숫자로 입력해 주세요.',
                });
                return;
            }
        }
        const data = [...tableData];
        const getRow = data[index];
        const newRow = {
            ...getRow,
            [key]: e.target.value,
        };
        const newData = data.map((item, itemIndex) => {
            if (itemIndex === index) {
                return newRow;
            } else {
                return item;
            }
        });

        onChangeData(newData);
    };

    const onChangeSelect = (key: string, index: number, value: number | string, label?: string) => {
        const data = [...tableData];
        const getRow = data[index];
        let newRow = { ...getRow };
        if (key === 'type') {
            newRow = {
                ...getRow,
                [key]: value,
                routeName: '',
                // description: '',
                // latitude: 0,
                // longitude: 0,
                // duration: '',
            };
        } else if (key === 'cityIdx' && label) {
            newRow = {
                ...getRow,
                cityIdx: value,
                cityName: label,
            };
        } else {
            newRow = {
                ...getRow,
                [key]: value,
            };
        }
        const newData = data.map((item, itemIndex) => {
            if (itemIndex === index) {
                return newRow;
            } else {
                return item;
            }
        });

        onChangeData(newData);
    };

    const onChangeBusStop = (index: number, value: any) => {
        const data = [...tableData];
        const getRow = data[index];
        let newRow = { ...getRow };

        newRow = {
            ...getRow,
            routeId: value,
            routeName: busStopList.find((item) => item.routeId === value)?.routeName,
            latitude: busStopList.find((item) => item.routeId === value)?.latitude,
            longitude: busStopList.find((item) => item.routeId === value)?.longitude,
        };
        const newData = data.map((item, itemIndex) => {
            if (itemIndex === index) {
                return newRow;
            } else {
                return item;
            }
        });

        onChangeData(newData);
    };

    const moveRow = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const currentData = [...tableData];

            const [removeData] = currentData.splice(dragIndex, 1);
            currentData.splice(hoverIndex, 0, removeData);
            const newData = currentData.map((row, rowIndex) => {
                return {
                    ...row,
                    routeNo: Number(rowIndex) + 1,
                };
            });

            onChangeData(newData);
        },
        [tableData],
    );

    useEffect(() => {
        if (addYn) {
            const table = document.querySelector('.ant-table-body');
            // @ts-ignore
            scrollIntoView(table.querySelector('.scroll-row'), {
                time: 0,
                align: {
                    top: 0.8,
                    lockY: false,
                },
            });
        }
    }, [addYn]);

    return (
        <DndProvider backend={HTML5Backend}>
            <TableWrapStyle>
                <Table
                    rowKey={'key'}
                    rowClassName={(record, index) => (index === tableData.length - 1 ? 'scroll-row' : '')}
                    dataSource={tableData}
                    rowSelection={{
                        getCheckboxProps: (record) => ({ disabled: record.useYn === 'Y' }),
                        selectedRowKeys: selectedRow,
                        onChange: onSelectRow,
                    }}
                    footer={() =>
                        store === 'route'
                            ? `총 ${total} / 소요시간 약 ${tableData
                                  .map((item) => Number(item.duration))
                                  ?.reduce((a, b) => a + b, 0)} min`
                            : `총 ${total}`
                    }
                    pagination={{ pageSize: 999999, hideOnSinglePage: true }}
                    scroll={{ x: 1050, y: 700 }}
                    components={{
                        body: {
                            row: store === 'busStop' ? NormalBodyRow : DraggableBodyRow,
                            cell: EditCell,
                        },
                    }}
                    onRow={(_, index) => {
                        const attr = {
                            _,
                            index,
                            moveRow,
                            onClick: () => onCheckRowKey && onCheckRowKey(_),
                        };
                        return attr as React.HTMLAttributes<any>;
                    }}>
                    {column?.map((col) => {
                        if (col.key === 'action') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    width={80}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    fixed="right"
                                    render={(_: any, record: any) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Button type="primary" size={'small'} onClick={() => setEditingKey('')}>
                                                    OK
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size={'small'} onClick={() => onEdit(record)}>
                                                Edit
                                            </Button>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsType') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Select
                                                value={_}
                                                onChange={(val) => onChangeSelect('goodsType', index, val)}>
                                                <Select.Option value={0} disabled>
                                                    상품 타입 선택
                                                </Select.Option>
                                                {storeGoodsTypeOptionList.map((item) => (
                                                    <Select.Option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <span>
                                                {storeGoodsTypeOptionList.find((item) => item.value === _)?.label}
                                            </span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsCurrency') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Select
                                                value={_}
                                                onChange={(val) => onChangeSelect('goodsCurrency', index, val)}>
                                                <Select.Option value={0} disabled>
                                                    화폐 선택
                                                </Select.Option>
                                                {storeCurrencyOptionList.map((item) => (
                                                    <Select.Option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        ) : (
                                            <span>
                                                {storeCurrencyOptionList.find((item) => item.value === _)?.label}
                                            </span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'maximum') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('maximum', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'routeName') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={col.width}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            record.type === '2' ? (
                                                <Select
                                                    style={{ width: '100%', textAlign: 'left' }}
                                                    value={_}
                                                    onChange={(val) => onChangeBusStop(index, val)}>
                                                    <Select.Option value={''} disabled>
                                                        정류장 선택
                                                    </Select.Option>
                                                    {busStopList?.map((busStop, index) => (
                                                        <Select.Option
                                                            key={`bus-stop${index}`}
                                                            value={busStop.routeId}
                                                            style={{ whiteSpace: 'wrap' }}>
                                                            {busStop.routeName}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            ) : (
                                                <Input
                                                    value={_}
                                                    onChange={(e) => onChangeInput('routeName', index, e)}
                                                    placeholder={'이름을 입력해 주세요.'}
                                                />
                                            )
                                        ) : (
                                            <span>{record.type === '2' ? record.routeName : _}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'useYn') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={70}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return (
                                            <Typography.Text type={_ === 'Y' ? `success` : `warning`}>
                                                {_ === 'Y' ? `사용중` : `미사용중`}
                                            </Typography.Text>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'cityName') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={150}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <>
                                                <Select
                                                    value={{
                                                        value: record.cityIdx,
                                                        label: _ === '' ? '도시를 선택해 주세요.' : _,
                                                    }}
                                                    placeholder={`도시를 선택해 주세요.`}
                                                    style={{ width: '100%' }}
                                                    labelInValue
                                                    onChange={(option) => {
                                                        onChangeSelect('cityIdx', index, option.value, option.label);
                                                    }}>
                                                    <Select.Option value={0} disabled>
                                                        도시를 선택해 주세요.
                                                    </Select.Option>
                                                    {cityOptionList?.map((option) => (
                                                        <Select.Option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </>
                                        ) : _ === '' ? (
                                            <Typography.Text type={'secondary'}>도시를 선택해 주세요.</Typography.Text>
                                        ) : (
                                            <Typography.Text>{_}</Typography.Text>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'bookmarkYn') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={150}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        if (record.type === '2') {
                                            // 정류장 === "2"
                                            if (editable) {
                                                return (
                                                    <CheckboxToggle
                                                        checked={_ === 'Y'}
                                                        onChange={(e) =>
                                                            onChangeSelect(
                                                                'bookmarkYn',
                                                                index,
                                                                e.target.checked ? 'Y' : 'N',
                                                            )
                                                        }>
                                                        <StarFilled
                                                            style={{
                                                                verticalAlign: 'middle',
                                                                color: _ === 'Y' ? '#5990ff' : '#cccccc',
                                                                fontSize: '1.4rem',
                                                            }}
                                                        />
                                                    </CheckboxToggle>
                                                );
                                            } else {
                                                return (
                                                    <StarFilled
                                                        style={{
                                                            verticalAlign: 'middle',
                                                            color: _ === 'Y' ? '#5990ff' : '#cccccc',
                                                            fontSize: '1.4rem',
                                                        }}
                                                    />
                                                );
                                            }
                                        } else {
                                            return <Typography.Text>-</Typography.Text>;
                                        }
                                    }}
                                />
                            );
                        } else if (col.key === 'description') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={150}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('description', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'location') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={200}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('location', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'type') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={120}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Select value={_} onChange={(val) => onChangeSelect('type', index, val)}>
                                                <Select.Option value={'1'}>Road</Select.Option>
                                                <Select.Option value={'2'}>Bus Stop</Select.Option>
                                            </Select>
                                        ) : (
                                            <span>{_ === '1' ? `Road` : `Bus Stop`}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'latitude') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={120}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input
                                                value={_}
                                                readOnly={record.type === '2'}
                                                onChange={(e) => onChangeInput('latitude', index, e)}
                                            />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'longitude') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={120}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input
                                                value={_}
                                                readOnly={record.type === '2'}
                                                onChange={(e) => onChangeInput('longitude', index, e)}
                                            />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'duration') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    width={100}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('duration', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'packageYn') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Select
                                                value={_}
                                                onChange={(val) => onChangeSelect('packageYn', index, val)}>
                                                <Select.Option value={''} disabled>
                                                    패키지 여부 선택
                                                </Select.Option>
                                                <Select.Option key={'N'} value={'N'}>
                                                    스토어 상품
                                                </Select.Option>
                                                <Select.Option key={'Y'} value={'Y'}>
                                                    패키지 상품
                                                </Select.Option>
                                            </Select>
                                        ) : (
                                            // <Input value={_} onChange={(e) => onChangeInput('goodsName', index, e)} />
                                            <Tag color={_ === 'Y' ? 'magenta' : 'green'}>
                                                {_ === 'Y' ? '패키지 상품' : '스토어 상품'}
                                            </Tag>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsName') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('goodsName', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsDesc') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('goodsDesc', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsType') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('goodsType', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsPrice') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input value={_} onChange={(e) => onChangeInput('goodsPrice', index, e)} />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else if (col.key === 'goodsCurrency') {
                            return (
                                <Table.Column
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                    render={(_: any, record: any, index: number) => {
                                        const editable = isEditing(record);
                                        return editable ? (
                                            <Input
                                                value={_}
                                                onChange={(e) => onChangeInput('goodsCurrency', index, e)}
                                            />
                                        ) : (
                                            <span>{_}</span>
                                        );
                                    }}
                                />
                            );
                        } else {
                            return (
                                <Table.Column
                                    width={col.width && col.width}
                                    align={'center'}
                                    title={col.title}
                                    dataIndex={col.key}
                                    key={col.key}
                                />
                            );
                        }
                    })}
                </Table>
            </TableWrapStyle>
        </DndProvider>
    );
};

export default EditTable;
