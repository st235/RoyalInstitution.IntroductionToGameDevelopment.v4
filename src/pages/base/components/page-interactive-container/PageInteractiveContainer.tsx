import "@/pages/base/components/page-interactive-container/PageInteractiveContainer.css";

import React from "react";

function PageInteractiveContainer(props: React.PropsWithChildren) {
    return (
        <div className="panel-interactive-container">
            {props.children}
        </div>
    );
}

export default PageInteractiveContainer;
