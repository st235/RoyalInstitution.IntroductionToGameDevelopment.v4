function isObject(value: unknown | null | undefined): boolean {
    return (value !== null && value !== undefined && (typeof value) === "object" && !Array.isArray(value));
}

function isPrimitive(value: unknown | null | undefined) {
    const valueType = typeof value;
    return (valueType === "boolean" || valueType === "number" || valueType === "string");
}

function deepEquals(a: unknown, b: unknown): boolean {
    if (a === b) {
        return true;
    }

    if (typeof a !== typeof b) {
        return false;
    }

    if (isPrimitive(a)) {
        return a === b;
    }

    if ((a === null || a === undefined) || (b === null || b === undefined)) {
        return a === b;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        for (let i = 0; i < a.length; i++) {
            if (!deepEquals(a[i], b[i])) {
                return false;
            }
        }

        return true;
    }

    if (a instanceof Map && b instanceof Map) {
        if (a.size !== b.size) {
            return false;
        }

        for (const key of b.keys()) {
            if (!a.has(key)) {
                return false;
            }

            if (!deepEquals(a.get(key), b.get(key))) {
                return false;
            }
        }

        return true;
    }

    if (a instanceof Set && b instanceof Set) {
        if (a.size !== b.size) {
            return false;
        }

        for (const [value,] of a.entries()) {
            if (!b.has(value)) {
                return false;
            }
        }

        return true;
    }

    const aKeys = Object.keys(a as object);
    const bKeys = Object.keys(b as object);

    if (aKeys.length !== bKeys.length) {
        return false;
    }

    for (const key of aKeys) {
        if (!deepEquals((a as {[key: string]: unknown})[key], (b as {[key: string]: unknown})[key])) {
            return false;
        }
    }

    return true;
}

function deepMerge(target: {[Key: string]: unknown}, ...sources: unknown[]): {[Key: string]: unknown} {
    if (sources.length === 0) {
        return target;
    }

    for (const source of sources) {
        if (!isObject(source)) {
            continue;
        }

        const sourceObject = source as {[Key: string]: unknown};
        for (const [key, value] of Object.entries(sourceObject)) {
            if (isObject(value)) {
                if (!target[key] || !isObject(target[key])) {
                    target[key] = {};
                }
                deepMerge(target[key] as {[Key: string]: unknown}, value);
            } else {
                target[key] = value;
            }
        }
    }

    return target;
}

function flatten(value: {[Key: string]: unknown} | undefined | null): {[Key: string]: unknown} {
    if (value === null || value === undefined) {
        return {};
    }

    const flattenedObject: {[Key: string]: unknown} = {};

    for (const [key, child] of Object.entries(value)) {
        if (isObject(child)) {
            const flattenedChild = flatten(child as {[Key: string]: unknown});
            Object.assign(flattenedObject, flattenedChild);
        } else {
            flattenedObject[key] = child;
        }
    }

    return flattenedObject;
}

export { isObject, deepMerge, deepEquals, flatten };
