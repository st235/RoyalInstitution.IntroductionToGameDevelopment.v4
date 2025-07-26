import "@components/min-screen-size-overlay/MinScreenSizeOverlay.css";

import React from "react";

function MinScreenSizeOverlay(props: React.PropsWithChildren) {
    return (
        <div className="min-screen-size-overlay-banner">
            {props.children}
        </div>
    );
}

export default MinScreenSizeOverlay;
