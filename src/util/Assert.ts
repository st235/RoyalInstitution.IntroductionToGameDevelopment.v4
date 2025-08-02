/**
 * Asserts whether the condition  holds, otherwise throws an exception.
 * If a message is supplied, the message with be provided in the error.
 * 
 * @param condition that would be checked against.
 * @param message an optional description on the expected condition.
 */
function assert(condition: boolean | undefined | null, message?: string) {
    if (!condition) {
        throw new Error(message ?? "Assertion error: the condition has not been met");
    }
}

function require<T>(value: T | undefined): T {
    assert(value !== undefined, "Value should not be undefined.");
    return value!;
}

export { assert, require };
