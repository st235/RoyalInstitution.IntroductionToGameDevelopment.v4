import { useState, useEffect } from "react";

import { useAppDispatch } from "@/hooks/redux";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import { t } from "@/util/LocalisationContext";
import { useDebounce } from "@/hooks/useDebounce";
import Checkbox from "@components/checkbox/Checkbox";
import type { CheckboxData } from "@/models/ui-data/CheckboxData";

type CheckboxSavedState = {
    value?: boolean;
}

type CheckboxProxyProps = {
    pageId: string;
    componentId: string;
    data: CheckboxData;
    savedState?: CheckboxSavedState;
}

function CheckboxProxy(props: CheckboxProxyProps) {
    const dispatch = useAppDispatch();

    const [value, setValue] = useState<boolean | undefined>(undefined);
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

    return (
        <Checkbox
            title={t(props.data.title)}
            description={props.data.description ? t(props.data.description) : undefined}
            isToggled={props.savedState?.value}
            onToggle={setValue}
        />
    );
}

export default CheckboxProxy;
export type { CheckboxProxyProps, CheckboxSavedState };
