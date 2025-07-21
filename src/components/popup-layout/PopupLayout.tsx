import "@components/popup-layout/PopupLayout.css";

import React from "react";

interface PopupLayoutProps extends React.PropsWithChildren {
    className?: string;
    anchor?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    };
    popupContent: React.ReactNode;
};

function PopupLayout(props: PopupLayoutProps) {
    const anchorProperties: React.CSSProperties = {
    };

    if (!props.anchor) {
        anchorProperties.top = 0;
        anchorProperties.left = 0;
    }

    if (props.anchor?.left) {
        anchorProperties.left = props.anchor.left;
    }

    if (props.anchor?.top) {
        anchorProperties.top = props.anchor.top;
    }

    if (props.anchor?.right) {
        anchorProperties.right = props.anchor.right;
    }

    if (props.anchor?.bottom) {
        anchorProperties.bottom = props.anchor.bottom;
    }

    return (
        <div className={`popup-layout ${props.className ?? ""}`}>
            {props.children}
            <div
                className="popup"
                style={anchorProperties}>
                {props.popupContent}
            </div>
        </div>
    );
}

export default PopupLayout;
export type { PopupLayoutProps };
