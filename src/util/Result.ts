type Common = {
    readonly success: boolean;
};

type Success<T = void> = {
    readonly value: T;
};

type Error<E = unknown> = {
    readonly error: E;
};

type Result<T = void, E = unknown> = Common & (Success<T> | Error<E>);

function succeed<T = void, E = unknown>(value: T): Result<T, E> {
    return {
        success: true,
        value: value,
    };
}

function error<T = void, E = unknown>(error: E): Result<T, E> {
    return {
        success: false,
        error: error,
    };
}

function requireValue<T = void, E = unknown>(result: Result<T, E>): T {
    return (result as Success<T>).value;
}

function requireError<T = void, E = unknown>(result: Result<T, E>): E {
    return (result as Error<E>).error;
}

export type { Result, Success, Error };
export { succeed, error, requireValue, requireError };
