import React from "react";

import HtmlContentCard from "@/components/html-content-card/HtmlContentCard";
import type { InfoCardData } from "@/models/ui-data/InfoCardData";
import { t } from "@/util/LocalisationContext";

type InfoCardProxyProps = {
    pageId: string;
    componentId: string;
    data: InfoCardData;
};

function InfoCardProxy(props: InfoCardProxyProps): React.ReactNode {
    return (
        <HtmlContentCard
            id={props.pageId}
            title={t(props.data.title)}
            description={t(props.data.description)} />
    );
}

export default InfoCardProxy;
export type { InfoCardProxyProps };
