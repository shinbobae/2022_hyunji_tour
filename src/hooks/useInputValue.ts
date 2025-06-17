import { Dispatch, SetStateAction, useCallback, useState } from 'react';

type Handler = (e: any) => void;
type ReturnTypes<T = any> = [T, Handler, Dispatch<SetStateAction<T>>];
const useInputValue = <T = any>(initialValue: T): ReturnTypes<T> => {
    const [value, setValue] = useState(initialValue);
    const handler = useCallback((val: any) => {
        setValue(val);
    }, []);
    return [value, handler, setValue];
};

export default useInputValue;
