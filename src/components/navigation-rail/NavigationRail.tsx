import "@components/navigation-rail/NavigationRail.css";

import React from "react";

interface NavigationRailProps extends React.PropsWithChildren {
    header?: React.ReactNode;
    footer?: React.ReactNode;
};

function NavigationRail(props: NavigationRailProps) {
    return (
        <div className="navigation-rail">
            <div className="header">{props.header}</div>
            <div className="icons">{props.children}</div>
            <div className="footer">{props.footer}</div>
        </div>
    );
}

export default NavigationRail;
export type { NavigationRailProps };
