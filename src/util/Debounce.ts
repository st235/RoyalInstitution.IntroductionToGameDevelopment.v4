// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function debounce<T extends Function>(
    this: unknown,
    callback: T,
    timeoutMs: number = 1000,
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
): Function {
    let timer: number;
    return (...args: unknown[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            callback.apply(this, args);
        }, timeoutMs);
    };
}

export { debounce };
