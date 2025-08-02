import "@/pages/base/components/game-controls-layout/GameControlsLayout.css";
import IconArrowClockwise from "@assets/icons/arrow-clockwise.svg";

import Button from "@/components/button/Button";

function GameControlsLayout() {
    return (
        <div className="game-controls-layout">
            <Button text="Restart" variant="primary" leadingIcon={IconArrowClockwise} />
        </div>
    );
}

export default GameControlsLayout;
