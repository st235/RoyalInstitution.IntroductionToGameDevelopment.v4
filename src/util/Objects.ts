function isObject(value: unknown | null | undefined): boolean {
    return (value !== null && value !== undefined && (typeof value) === "object" && !Array.isArray(value));
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

export { isObject, deepMerge, flatten };
