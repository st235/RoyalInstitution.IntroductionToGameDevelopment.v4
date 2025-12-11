import { useCallback, useState, useEffect } from "react";

import IconOpenFullscreen from "@assets/icons/fullscreen.svg";
import IconCloseFullscreen from "@assets/icons/fullscreen-exit.svg";

import { useAppDispatch } from "@/hooks/redux";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import { t } from "@/util/LocalisationContext";
import LineNumberedTextarea from "@/components/line-numbered-textarea/LineNumberedTextarea";
import type { SandboxData } from "@/models/ui-data/SandboxData";
import Button from "@/components/button/Button";
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

    const [isFullscreen, setFullscreen] = useState<boolean>(false);
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
    }, [dispatch, debouncedValue, props.componentId, props.data.persistencyId, props.pageId]);

    let placeholder = props.data.placeholder;
    if (props.data.shouldTranslatePlaceholder !== false && placeholder) {
        placeholder = t(placeholder);
    }

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape" && isFullscreen) {
            setFullscreen(false);
        }
    }, [isFullscreen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, handleKeyDown]);

    return (
        <LineNumberedTextarea
            minLines={props.data.minLinesCount ?? 10}
            placeholder={placeholder}
            initialValue={props.savedState?.value ?? props.data.initialValue}
            style={props.data.optional ? "optional" : "required"}
            controlsContent={
                <Button text={t(isFullscreen ? "pages-all.close-fullscreen" : "pages-all.go-fullscreen")}
                    variant="primary"
                    size="small"
                    leadingIcon={isFullscreen ? IconCloseFullscreen : IconOpenFullscreen}
                    onClick={() => setFullscreen(!isFullscreen)} />
            }
            isFullscreen={isFullscreen}
            onValueChanged={setValue}
        />
    );
}

export default SandboxProxy;
export type { SandboxProxyProps, SandboxSavedState };
