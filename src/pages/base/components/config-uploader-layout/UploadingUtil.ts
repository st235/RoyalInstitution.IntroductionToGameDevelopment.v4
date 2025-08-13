const _DEFAULT_CONFIG_FILENAME = "my-config";

function GenerateUrlFromConfigObject(configObject: unknown): string {
    const fileData = JSON.stringify(configObject);
    const blob = new Blob([fileData], { type: "text/plain" });
    return URL.createObjectURL(blob);
}

function GenerateFilename(filenamePrefix?: string): string {
    const currentTimestamp = new Date().getMilliseconds();
    return `${filenamePrefix ?? _DEFAULT_CONFIG_FILENAME}.${currentTimestamp}.json`;
}

export { GenerateUrlFromConfigObject, GenerateFilename };
