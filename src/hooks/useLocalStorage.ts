import { useEffect, useState } from "react";

import { SaveToLocalStorage, ReadFromLocalStorage } from "@/util/LocalStorageUtil";

export const useLocalStorageState = <T>(key: string, initialState: T): [T, (value: T) => void] => {
    const [value, setValue] = useState<T>(() => {
        const localValue = ReadFromLocalStorage<T>(key);
        if (!localValue) {
            return initialState;
        }
        return localValue;
    });

    useEffect(() => {
        SaveToLocalStorage<T>(key, value);
    }, [key, value]);

    return [value, setValue];
};
