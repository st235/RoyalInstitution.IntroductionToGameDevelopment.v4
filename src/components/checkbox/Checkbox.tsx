import "@components/checkbox/Checkbox.css";

import { useState } from "react";

import Label from "@components/label/Label";

type CheckboxProps = {
    title: string;
    description?: string;
    isToggled?: boolean;
    onToggle?: (value: boolean) => void;
};

function Checkbox(props: CheckboxProps) {
    const [toggleState, setToggleState] = useState<boolean>(props.isToggled ?? false);

    function onChange() {
        const newToggleState = !toggleState;
        setToggleState(newToggleState);
        props.onToggle?.(newToggleState);
    }

    console.log("new toggle state", toggleState);

    return (
        <div className="checkbox-container" onClick={onChange}>
            <div className="checkbox-info">
                <Label title={props.title} variant="quartary" />
                {props.description && <Label title={props.description} variant="footnote" />}
            </div>
            <input key={Math.random()} type="checkbox" defaultChecked={toggleState} onChange={onChange} />
        </div>
    );
}

export default Checkbox;
export type { CheckboxProps };
