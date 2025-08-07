const _REGEXP_NON_EMPTY_WHITESPACE = /\s+/;
const _REGEXP_NEW_LINE = /\r?\n/;

function splitByNewLine(value: string): string[] {
    return value.split(_REGEXP_NEW_LINE);
}

function splitByWhitespace(value: string): string[] {
    return value.split(_REGEXP_NON_EMPTY_WHITESPACE);
}

export { splitByNewLine, splitByWhitespace };
