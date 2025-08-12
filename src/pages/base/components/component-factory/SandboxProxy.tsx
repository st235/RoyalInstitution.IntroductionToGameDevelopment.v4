import { useAppDispatch } from "@/hooks/redux";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import LineNumberedTextarea from "@/components/line-numbered-textarea/LineNumberedTextarea";
import type { SandboxData } from "@/models/ui-data/SandboxData";
import { debounce } from "@/util/Debounce";

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

    function onValueChanged(value: string) {
        if (!props.data.persistencyId) {
            return;
        }

        dispatch(
            updateComponent({
                pageId: props.pageId,
                componentId: props.componentId,
                persistencyId: props.data.persistencyId,
                state: {
                    value,
                }
            })
        );
    }

    const onValueChangedDebounced = debounce(onValueChanged, 1500);

    return (
        <LineNumberedTextarea
            minLines={props.data.minLinesCount ?? 10}
            placeholder={props.data.placeholder}
            initialValue={props.savedState?.value ?? props.data.initialValue}
            style={props.data.optional ? "optional" : "required"}
            onValueChanged={value => onValueChangedDebounced(value)}
        />
    );
}

export default SandboxProxy;
export type { SandboxProxyProps, SandboxSavedState };
