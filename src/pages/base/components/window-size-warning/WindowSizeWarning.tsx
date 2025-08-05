import "@/pages/base/components/window-size-warning/WindowSizeWarning.css";

import LogoLegendOfRoyalInstitution from "@assets/images/logo-legend-of-royal-institution.jpeg";

function WindowSizeWarning() {
    return (
        <div className="window">
            <div className="fake-controls">
                <span className="control red" />
                <span className="control orange" />
                <span className="control green" />
            </div>
            <img src={LogoLegendOfRoyalInstitution} />
            <p>Sorry, the window size is too small for comfortable IDE usages. Please try resizing the window, increasing your screen resolution, or using a device with a larger display.</p>
        </div>
    );
}

export default WindowSizeWarning;
