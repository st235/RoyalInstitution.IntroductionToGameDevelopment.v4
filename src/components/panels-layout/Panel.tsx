import "@components/panels-layout/Panel.css";

import React from "react";

interface PanelProps extends React.PropsWithChildren {
    ref: React.RefObject<HTMLDivElement>;
    defaultWeight: number;
    overwriteWidth?: number;
    minWidth?: number;
};

function Panel(props: PanelProps) {
    const cssProps = {
        width: props.overwriteWidth,
        minWidth: props.minWidth,
        flex: "1 0 auto",
    } as React.CSSProperties;

    if (!props.overwriteWidth) {
        cssProps.flex = `${props.defaultWeight} 0 0`;
    }

    return (
        <div ref={props.ref}
            className="panel"
            style={cssProps}>
            {props.children}
        </div>
    );
}

export default Panel;
export type { PanelProps };
