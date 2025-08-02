import IconFloppy2Fill from "@assets/icons/floppy2-fill.svg";

import { useAppDispatch } from "@/hooks/redux";
import { useState } from "react";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import { require } from "@/util/Assert";
import Button from "@/components/button/Button";
import LineNumberedTextarea from "@/components/line-numbered-textarea/LineNumberedTextarea";
import type { SandboxData } from "@/models/ui-data/SandboxData";

type SandboxSavedState = {
    value?: string;
}

type SandboxProxyProps = {
    pageId: string;
    componentId: string;
    data: SandboxData;
    savedState?: SandboxSavedState;
}

function Sandbox(props: SandboxProxyProps) {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState(props?.savedState?.value);

    function onSaveContent() {
        dispatch(
            updateComponent({
                pageId: props.pageId,
                componentId: props.componentId,
                persistencyId: require(props.data.persistencyId),
                state: {
                    value,
                }
            })
        );
    }

    return (
        <LineNumberedTextarea
            minLines={7}
            placeholder={props.data.placeholder}
            initialValue={value}
            controlsContent={
                props.data.persistencyId ? 
                    (<Button variant="primary" text="Save" leadingIcon={IconFloppy2Fill} onClick={onSaveContent} />) : null
            }
            onValueChanged={value => setValue(value)}
        />
    );
}

export default Sandbox;
export type { SandboxProxyProps, SandboxSavedState };
