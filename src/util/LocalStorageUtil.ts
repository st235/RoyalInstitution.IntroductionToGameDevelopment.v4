function SaveToLocalStorage<T>(key: string, value: T): boolean {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

function ReadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
        const item = window.localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : defaultValue;
    } catch (error) {
        console.error(error);
        return defaultValue;
    }
}

function RemoveFromLocalStorage(key: string): boolean {
    try {
        window.localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export { SaveToLocalStorage, ReadFromLocalStorage, RemoveFromLocalStorage };
