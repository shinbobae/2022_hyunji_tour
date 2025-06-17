import React, { useCallback, useRef, useState, SetStateAction, Dispatch, useEffect } from 'react';
import Map, {
    MapProvider,
    Marker,
    NavigationControl,
    ViewStateChangeEvent,
    Layer,
    Source,
    MarkerDragEvent,
    FullscreenControl,
} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import Feature from 'maplibre-gl';
import { LocationStyle, RoadPinStyle } from './style';
import BusPin from './BusPin';
import ClickPin from './ClickPin';
import { useAppDispatch } from '../../../hooks/useToolkit';
import routeDetailSlice, { RouteLocationDataType } from '../../../store/slice/route/detail';
import busStopSlice, { BusStopDataType } from '../../../store/slice/busStop/busStop';
import { Tooltip } from 'antd';
import StorePin from './StorePin';
import GeocoderControl from './GeocoderControl';
import { BusLocationResponse } from '../../../api/contents/bus/busType';
import LocationBusPin from './LocationBusPin';

export interface CoordiType {
    type?: string | number;
    coordi: number[];
}
interface Props {
    store: string;
    lineShow: boolean;
    tableData: any[];
    sendCoordi?: Dispatch<SetStateAction<{ latitude: number; longitude: number } | null>>;
    height?: string;
    setTzid?: Dispatch<SetStateAction<string>>;
    getRoute?: RouteLocationDataType | BusStopDataType | null;
    currentLocationList?: BusLocationResponse;
    currentBus?: null | number;
    setCurrentBus?: any;
    fixLocation?: { lon: number; lat: number } | null;
    setFixLocation?: React.Dispatch<React.SetStateAction<{ lon: number; lat: number } | null>>;
}
const CoordMap = ({
    store,
    lineShow,
    tableData,
    sendCoordi,
    height,
    setTzid,
    getRoute,
    currentLocationList,
    currentBus,
    setCurrentBus,
    fixLocation,
    setFixLocation,
}: Props) => {
    const dispatch = useAppDispatch();
    const MAP_TOKEN = 'pk.eyJ1IjoibXl0aGluZ3MiLCJhIjoiY2w3b2JpdTY1MHd4NTNvcDlwcnliMDExayJ9.UpwHVHWnid-XVsncAK0ywA';
    const map = useRef(null);
    const [viewport, setViewport] = useState({
        latitude: 16.053547,
        longitude: 108.202569,
        zoom: 14,
    });
    const [data, setData] = useState<any>();
    const [clickMarker, setClickMarker] = useState<number[]>([]);
    const [firstLoading, setFirstLoading] = useState<boolean>(true);

    useEffect(() => {
        let sortCoordi = [...tableData].map((coordi) => {
            let initArray = [];
            initArray.push(coordi.longitude);
            initArray.push(coordi.latitude);
            return initArray;
        });
        setData({
            type: 'Feature',
            properties: {},
            geometry: { type: 'LineString', coordinates: sortCoordi },
        });
        if ((firstLoading && tableData.length > 0) || tableData.length === 1) {
            setViewport({
                ...viewport,
                latitude: tableData[0].latitude,
                longitude: tableData[0].longitude,
            });
            setFirstLoading(false);
        }
        if (tableData.length === 0) {
            setViewport({
                ...viewport,
                latitude: 16.053547,
                longitude: 108.202569,
            });
        }
    }, [firstLoading, tableData]);

    useEffect(() => {
        if (getRoute) {
            setViewport({
                ...viewport,
                latitude: getRoute.latitude,
                longitude: getRoute.longitude,
                zoom: 17,
            });
        }
    }, [getRoute]);

    const onMove = useCallback(
        (e: ViewStateChangeEvent) => {
            setViewport(e.viewState);
        },
        [viewport],
    );

    const onClick = useCallback(
        async (e: mapboxgl.MapLayerMouseEvent) => {
            if (!sendCoordi) return;
            sendCoordi({
                latitude: Math.floor(e.lngLat.lat * 1000000) / 1000000,
                longitude: Math.floor(e.lngLat.lng * 1000000) / 1000000,
            });
            if (store !== 'nonClick') {
                setClickMarker([e.lngLat.lat, e.lngLat.lng]);
            }

            const query = await fetch(
                `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${
                    Math.floor(e.lngLat.lng * 1000000) / 1000000
                },${Math.floor(e.lngLat.lat * 1000000) / 1000000}.json?access_token=${MAP_TOKEN}`,
                { method: 'GET' },
            );
            const data = await query.json();
            const userTimezone = data.features[0].properties.TZID;
            if (setTzid) {
                setTzid(userTimezone);
            }
        },
        [viewport],
    );

    const onDeleteClickMarker = useCallback(
        (e: any) => {
            if (!sendCoordi) return;
            e.preventDefault();
            setClickMarker([]);
            sendCoordi(null);
        },
        [clickMarker],
    );

    const onDragEnd = useCallback(
        async (e: MarkerDragEvent, index: number) => {
            if (!sendCoordi) return;
            const lat = Math.floor(e.lngLat.lat * 1000000) / 1000000;
            const lng = Math.floor(e.lngLat.lng * 1000000) / 1000000;
            sendCoordi({
                latitude: lat,
                longitude: lng,
            });
            setViewport({
                ...viewport,
                latitude: lat,
                longitude: lng,
            });
            const data = [...tableData];
            const getRow = data[index];
            const newRow = {
                ...getRow,
                latitude: lat,
                longitude: lng,
            };
            const newData = data.map((item, itemIndex) => {
                if (itemIndex === index) {
                    return newRow;
                } else {
                    return item;
                }
            });

            if (store === 'route') {
                dispatch(routeDetailSlice.actions.changeTableData(newData));
            } else if (store === 'busStop') {
                dispatch(busStopSlice.actions.changeTableData(newData));
            }

            const query = await fetch(
                `https://api.mapbox.com/v4/examples.4ze9z6tv/tilequery/${
                    Math.floor(e.lngLat.lng * 1000000) / 1000000
                },${Math.floor(e.lngLat.lat * 1000000) / 1000000}.json?access_token=${MAP_TOKEN}`,
                { method: 'GET' },
            );
            const featureData = await query.json();
            const userTimezone = featureData.features[0].properties.TZID;
            if (setTzid) {
                setTzid(userTimezone);
            }
        },
        [tableData, viewport],
    );

    return (
        <div className="Mapbox">
            <MapProvider>
                <Map
                    {...viewport}
                    ref={map}
                    mapboxAccessToken={MAP_TOKEN}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    style={{ height: height || '640px' }}
                    onClick={(e) => onClick(e)}
                    onMove={onMove}>
                    <div style={{ marginTop: '0.5rem', marginLeft: '0.5rem' }}>
                        <GeocoderControl mapboxAccessToken={MAP_TOKEN} position="top-left" />
                        <FullscreenControl />
                        <NavigationControl />
                    </div>
                    {lineShow && (
                        <Source type="geojson" data={data}>
                            <Layer
                                id="route"
                                type="line"
                                layout={{
                                    'line-join': 'round',
                                    'line-cap': 'round',
                                }}
                                paint={{
                                    'line-color': 'rgba(19,168,252,0.7 )',
                                    'line-width': 8,
                                }}
                            />
                        </Source>
                    )}
                    {currentLocationList &&
                        currentLocationList.length > 0 &&
                        currentLocationList.map((location, index) => (
                            <React.Fragment key={index}>
                                <Marker
                                    style={{ position: 'absolute', zIndex: 10 }}
                                    longitude={location.bus_location_info.location_lon}
                                    latitude={location.bus_location_info.location_lat}>
                                    <LocationStyle index={index} />
                                </Marker>
                                <Marker
                                    onClick={() => setCurrentBus(location.bus_idx)}
                                    style={{ position: 'absolute', zIndex: 10 }}
                                    longitude={location.bus_location_info.latest_location_lon}
                                    latitude={location.bus_location_info.latest_location_lat}>
                                    <LocationBusPin
                                        title={`${location.bus_name}`}
                                        index={index}
                                        active={currentBus === location.bus_idx}
                                    />
                                </Marker>
                            </React.Fragment>
                        ))}
                    {tableData?.map((coordi, index) =>
                        coordi.type == 1 ? (
                            <Marker
                                key={`coordi${coordi.longitude}${index}`}
                                latitude={coordi.latitude}
                                longitude={coordi.longitude}
                                draggable={true}
                                onClick={
                                    setFixLocation
                                        ? () => setFixLocation({ lon: coordi.longitude, lat: coordi.latitude })
                                        : () => console.log('중간경로 클릭')
                                }
                                onDragEnd={(e) => onDragEnd(e, index)}>
                                <Tooltip title={coordi.routeName || `이름을 설정해 주세요`}>
                                    <RoadPinStyle
                                        noname={coordi.routeName === ''}
                                        active={
                                            coordi.latitude === fixLocation?.lat &&
                                            coordi.longitude === fixLocation?.lon
                                        }
                                    />
                                </Tooltip>
                            </Marker>
                        ) : coordi.type == 2 || store === 'busStop' ? (
                            <Marker
                                key={`coordi${coordi.longitude}${index}`}
                                latitude={coordi.latitude}
                                longitude={coordi.longitude}
                                draggable={store === 'busStop'}
                                onDragEnd={(e) => onDragEnd(e, index)}
                                onClick={
                                    setFixLocation
                                        ? () => setFixLocation({ lon: coordi.longitude, lat: coordi.latitude })
                                        : () => console.log('버스정거장 클릭')
                                }>
                                <BusPin
                                    title={coordi.routeName}
                                    endpoint={store === 'route' && (index === 0 || index === tableData.length - 1)}
                                    bookmark={coordi.bookmarkYn === 'Y'}
                                    active={
                                        coordi.latitude === fixLocation?.lat && coordi.longitude === fixLocation?.lon
                                    }
                                />
                            </Marker>
                        ) : (
                            <Marker
                                key={`coordi${coordi.longitude}${index}`}
                                latitude={coordi.latitude}
                                longitude={coordi.longitude}
                                draggable={store === 'nonClick'}
                                onDragEnd={(e) => onDragEnd(e, index)}>
                                <StorePin />
                            </Marker>
                        ),
                    )}
                    {clickMarker.length > 0 && (
                        <div onContextMenu={onDeleteClickMarker}>
                            <Marker longitude={clickMarker[1]} latitude={clickMarker[0]} style={{ zIndex: 10 }}>
                                <ClickPin />
                            </Marker>
                        </div>
                    )}
                </Map>
            </MapProvider>
        </div>
    );
};

export default CoordMap;
