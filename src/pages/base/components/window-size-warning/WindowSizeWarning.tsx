import "@/pages/base/components/window-size-warning/WindowSizeWarning.css";

import LogoLegendOfRoyalInstitution from "@assets/images/logo-legend-of-royal-institution.jpeg";

import { t } from "@/util/LocalisationContext";

function WindowSizeWarning() {
    return (
        <div className="window">
            <div className="fake-controls">
                <span className="control red" />
                <span className="control orange" />
                <span className="control green" />
            </div>
            <img src={LogoLegendOfRoyalInstitution} />
            <p>{t("window-size-warning")}</p>
        </div>
    );
}

export default WindowSizeWarning;
