import { useAppDispatch } from "@/hooks/redux";
import { updateComponent } from "@/reducers/pageComponentsSlice";

import { t } from "@/util/LocalisationContext";
import { debounce } from "@/util/Debounce";
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

    function onValueChanged(value: boolean) {
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
        <Checkbox
            title={t(props.data.title)}
            description={props.data.description ? t(props.data.description) : undefined}
            isToggled={props.savedState?.value}
            onToggle={value => onValueChangedDebounced(value)}
        />
    );
}

export default CheckboxProxy;
export type { CheckboxProxyProps, CheckboxSavedState };
