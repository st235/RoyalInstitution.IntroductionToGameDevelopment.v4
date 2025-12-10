import "@/pages/base/components/nuke-data-button/NukeDataButton.css";

import IconEraserFill from "@assets/icons/eraser-fill.svg";

import { useEffect, useState } from "react";
import { ClearLocalStorage } from "@/util/LocalStorageUtil";
import { t } from "@/util/LocalisationContext";

interface NukeDataButtonState {
    messageId: string;
    action: (stateChanger: (state: NukeDataButtonState) => void) => void;
};

const InitialState: NukeDataButtonState = {
    messageId: "info-footer.nuke-user-data.entry",
    action: (stateChanger: (state: NukeDataButtonState) => void) => {
        stateChanger(AreYouSureState);
    }
};

const AreYouSureState: NukeDataButtonState = {
    messageId: "info-footer.nuke-user-data.sure",
    action: (stateChanger: (state: NukeDataButtonState) => void) => {
        stateChanger(AreYouAbsolutelySureState);
    }
};

const AreYouAbsolutelySureState: NukeDataButtonState = {
    messageId: "info-footer.nuke-user-data.suresure",
    action: (stateChanger: (state: NukeDataButtonState) => void) => {
        stateChanger(ThisWillDestroyAllUserDataState);
    }
};

const ThisWillDestroyAllUserDataState: NukeDataButtonState = {
    messageId: "info-footer.nuke-user-data.erasedata",
    action: (stateChanger: (state: NukeDataButtonState) => void) => {
        stateChanger(ConfirmRemovalState);
    }
};

const ConfirmRemovalState: NukeDataButtonState = {
    messageId: "info-footer.nuke-user-data.confirm",
    action: () => {
        ClearLocalStorage();
        window.location.reload();
    }
};

function NukeDataButton() {
    const [state, setState] = useState<NukeDataButtonState>(InitialState);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (state !== InitialState) {
                setState(InitialState);
            }
        }, 1500);

        return () => {
            clearTimeout(timer);
        };
    }, [state]);

    function changeState(state: NukeDataButtonState) {
        setState(state);
    }

    return (
        <div className="nuke-data-button"
            onClick={() => state.action(changeState)}>
            <img className="logo" src={IconEraserFill} />{t(state.messageId)}
        </div>
    );
}

export default NukeDataButton;
