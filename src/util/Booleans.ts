function parseBoolean(value: unknown): boolean {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        const lowerCaseValue = value.toLowerCase();
        return lowerCaseValue === "true" || lowerCaseValue === "1";
    }

    return false;
}

export { parseBoolean };
