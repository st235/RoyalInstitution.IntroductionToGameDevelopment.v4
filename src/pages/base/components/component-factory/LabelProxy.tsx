import React from "react";

import Label from "@components/label/Label";
import type { LabelData } from "@/models/ui-data/LabelData";

type LabelProxyProps = {
    pageId: string;
    componentId: string;
    data: LabelData;
};

function LabelProxy(props: LabelProxyProps): React.ReactNode {
    return (
        <Label
            title={props.data.title}
            variant={props.data.variant}
        />
    );
}

export default LabelProxy;
export type { LabelProxyProps };
