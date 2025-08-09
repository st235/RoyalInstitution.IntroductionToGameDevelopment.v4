import { UI_KEY_CHECKBOX, UI_KEY_INFO_CARD, UI_KEY_SANDBOX, UI_KEY_LABEL } from "@/models/ui-data/UiKeys";
import CheckboxProxy, { type CheckboxSavedState } from "@/pages/base/components/component-factory/CheckboxProxy";
import InfoCardProxy from "@/pages/base/components/component-factory/InfoCardProxy";
import LabelProxy from "@/pages/base/components/component-factory/LabelProxy";
import SandboxProxy, { type SandboxSavedState } from "@/pages/base/components/component-factory/SandboxProxy";
import type { CheckboxData } from "@/models/ui-data/CheckboxData";
import type { ComponentPersistentState } from "@/models/ui-data/ComponentPersistentState";
import type { InfoCardData } from "@/models/ui-data/InfoCardData";
import type { LabelData } from "@/models/ui-data/LabelData";
import type { PageComponent } from "@/models/Page";
import type { SandboxData } from "@/models/ui-data/SandboxData";

type ComponentFactoryProps = {
    pageId: string;
    component: PageComponent;
    savedState?: ComponentPersistentState;
}

function ComponentFactory(props: ComponentFactoryProps) {
    switch (props.component.type) {
    case UI_KEY_INFO_CARD: return (
        <InfoCardProxy
            pageId={props.pageId}
            componentId={props.component.id}
            data={props.component.data as InfoCardData}
        />
    );
    case UI_KEY_SANDBOX: return (
        <SandboxProxy
            pageId={props.pageId}
            componentId={props.component.id}
            data={props.component.data as SandboxData}
            savedState={props.savedState?.state as SandboxSavedState}
        />
    );
    case UI_KEY_LABEL: return (
        <LabelProxy
            pageId={props.pageId}
            componentId={props.component.id}
            data={props.component.data as LabelData}
        />
    );
    case UI_KEY_CHECKBOX: return (
        <CheckboxProxy
            pageId={props.pageId}
            componentId={props.component.id}
            data={props.component.data as CheckboxData}
            savedState={props.savedState?.state as CheckboxSavedState}
        />
    );
    default: return (<></>);
    }
}

export default ComponentFactory;
export type { ComponentFactoryProps };
