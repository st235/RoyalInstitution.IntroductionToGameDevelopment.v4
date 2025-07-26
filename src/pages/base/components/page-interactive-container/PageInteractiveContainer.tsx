import "@/pages/base/components/page-interactive-container/PageInteractiveContainer.css";

import HtmlContentCard from "@/components/html-content-card/HtmlContentCard";
import type { Page } from "@/models/Page";

type PageInteractiveContainerProps = {
    page: Page;
};

function PageInteractiveContainer(props: PageInteractiveContainerProps) {
    const page = props.page;

    return (
        <div className="panel-interactive-container">
            <HtmlContentCard id={page.id} title={page.title} description={page.description} />
        </div>
    );
}

export default PageInteractiveContainer;
export type { PageInteractiveContainerProps };
