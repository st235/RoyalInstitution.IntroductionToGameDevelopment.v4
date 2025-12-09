import React from "react";

import Label from "@components/label/Label";
import type { LabelData } from "@/models/ui-data/LabelData";
import { t } from "@/util/LocalisationContext";

type LabelProxyProps = {
    pageId: string;
    componentId: string;
    data: LabelData;
};

function LabelProxy(props: LabelProxyProps): React.ReactNode {
    return (
        <div>
            <Label
                title={t(props.data.title)}
                variant={props.data.variant}
            />
            {props.data.description && 
                <Label
                    title={t(props.data.description)}
                    variant="footnote"
                />
            }
        </div>
    );
}

export default LabelProxy;
export type { LabelProxyProps };
