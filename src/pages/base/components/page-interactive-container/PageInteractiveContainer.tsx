import "@/pages/base/components/page-interactive-container/PageInteractiveContainer.css";

import React from "react";

import HtmlContentCard from "@/components/html-content-card/HtmlContentCard";
import type { Page } from "@/models/Page";

interface PageInteractiveContainerProps extends React.PropsWithChildren {
    page: Page;
};

function PageInteractiveContainer(props: PageInteractiveContainerProps) {
    const page = props.page;

    return (
        <div className="panel-interactive-container">
            <HtmlContentCard id={page.id} title={page.title} description={page.description} />
            {props.children}
        </div>
    );
}

export default PageInteractiveContainer;
export type { PageInteractiveContainerProps };
