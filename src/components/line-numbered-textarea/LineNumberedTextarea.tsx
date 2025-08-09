import "@components/line-numbered-textarea/LineNumberedTextarea.css";

import React, { useMemo, useState } from "react";

type LineNumberedTextareaStyle = "required" | "optional";

type LineNumberedTextareaProps = {
    minLines: number;
    style?: LineNumberedTextareaStyle;
    placeholder?: string;
    initialValue?: string;
    name?: string;
    extraLinesOffset?: number;
    controlsContent?: React.ReactNode;
    onValueChanged?: (value: string) => void;
};

function LineNumberedTextarea(props: LineNumberedTextareaProps) {
    const cssProperties: React.CSSProperties = {
        borderStyle: "solid",
    };
    if (props.style === "optional") {
        cssProperties.borderStyle = "dashed";
    }

    const [value, setValue] = useState(props.initialValue ?? "");

    const lineCount = useMemo(() => {
        const extraLinesOffset = props.extraLinesOffset ?? 0;
        let count = props.minLines;

        if (value && value.length > 0) {
            count = Math.max(count, value.split("\n").length + extraLinesOffset);
        } else if (props.placeholder) {
            count = Math.max(count, props.placeholder?.split("\n").length + extraLinesOffset);
        }

        return count;
    }, [props.placeholder, props.minLines, props.extraLinesOffset, value]);

    const linesArray = useMemo(() =>
        Array.from(
            { length: lineCount },
            (_, i) => i + 1
        ),
    [lineCount]);

    return (
        <div className="line-numbered-textarea" style={cssProperties}>
            <ul className="lines-counter">
                {linesArray.map(line => (
                    <li key={line} className="line">{line}</li>
                ))}
            </ul>
            <textarea className="textarea"
                name={props.name}
                value={value}
                placeholder={props.placeholder}
                onChange={e => {
                    setValue(e.target.value);
                    props.onValueChanged?.(e.target.value);
                }}
                wrap="off"
            />
            {props.controlsContent && <div className="controls">{props.controlsContent}</div>}
        </div>
    );
}

export default LineNumberedTextarea;
export type { LineNumberedTextareaProps };
