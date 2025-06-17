import * as React from 'react';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { Tooltip } from 'antd';
import SyncAltOutlinedIcon from '@mui/icons-material/SyncAltOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { StarFilled } from '@ant-design/icons';
const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

type Props = {
    title: string;
    endpoint?: boolean;
    bookmark?: boolean;
    active?: boolean;
};

const BusPin = ({ title, endpoint, bookmark, active }: Props) => {
    return (
        <Tooltip title={title || `이름을 설정해 주세요`}>
            <div style={{ position: 'relative', transform: 'translateY(-30%)' }}>
                <svg height={40} viewBox="0 0 24 24">
                    <path
                        d={ICON}
                        style={{
                            stroke: '#fff',
                            fill: title === '' ? '#70e700' : endpoint ? '#ff59c5' : active ? '#70e700' : '#5990ff',
                        }}
                    />
                </svg>
                <DirectionsBusIcon
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0%',
                        transform: 'translate(-50%, 25%)',
                        color: '#ffffff',
                    }}
                    fontSize={'medium'}
                />
                {bookmark && (
                    <StarFilled
                        style={{
                            position: 'absolute',
                            top: '-40%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: endpoint ? '#ff59c5' : '#5990ff',
                            fontSize: '1rem',
                        }}
                    />
                )}
            </div>
        </Tooltip>
    );
};

export default React.memo(BusPin);
