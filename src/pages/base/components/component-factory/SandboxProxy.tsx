import { useState, useEffect } from "react";

import { useAppDispatch } from "@/hooks/redux";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import { t } from "@/util/LocalisationContext";
import LineNumberedTextarea from "@/components/line-numbered-textarea/LineNumberedTextarea";
import type { SandboxData } from "@/models/ui-data/SandboxData";
import { useDebounce } from "@/hooks/useDebounce";

type SandboxSavedState = {
    value?: string;
}

type SandboxProxyProps = {
    pageId: string;
    componentId: string;
    data: SandboxData;
    savedState?: SandboxSavedState;
}

function SandboxProxy(props: SandboxProxyProps) {
    const dispatch = useAppDispatch();

    const [value, setValue] = useState<string | undefined>(undefined);
    const debouncedValue = useDebounce(value, 1500);

    useEffect(() => {
        if (!props.data.persistencyId || !debouncedValue) {
            return;
        }

        dispatch(
            updateComponent({
                pageId: props.pageId,
                componentId: props.componentId,
                persistencyId: props.data.persistencyId,
                state: {
                    value: debouncedValue,
                }
            })
        );
    }, [debouncedValue]);

    let placeholder = props.data.placeholder;
    if (props.data.shouldTranslatePlaceholder !== false && placeholder) {
        placeholder = t(placeholder);
    }

    return (
        <LineNumberedTextarea
            minLines={props.data.minLinesCount ?? 10}
            placeholder={placeholder}
            initialValue={props.savedState?.value ?? props.data.initialValue}
            style={props.data.optional ? "optional" : "required"}
            onValueChanged={setValue}
        />
    );
}

export default SandboxProxy;
export type { SandboxProxyProps, SandboxSavedState };
