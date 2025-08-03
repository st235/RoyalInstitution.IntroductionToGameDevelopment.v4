import React from "react";

import HtmlContentCard from "@/components/html-content-card/HtmlContentCard";
import type { InfoCardData } from "@/models/ui-data/InfoCardData";

type InfoCardProxyProps = {
    pageId: string;
    componentId: string;
    data: InfoCardData;
};

function InfoCardProxy(props: InfoCardProxyProps): React.ReactNode {
    return (
        <HtmlContentCard
            id={props.pageId}
            title={props.data.title}
            description={props.data.description} />
    );
}

export default InfoCardProxy;
export type { InfoCardProxyProps };
