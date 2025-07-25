import "@/pages/base/components/logo-popup/LogoPopup.css";

import PopupLayout from "@components/popup-layout/PopupLayout";

function IdeLogo() {
    return (
        <div className="logo-image">
            {/* <img src={LogoIde} /> */}
        </div>
    );
}

function LogoPopup() {
    return (
        <PopupLayout
            className="logo-popup"
            popupContent={
                <div className="logo-popup-content">
                    <span className="title">Web IDE: <span className="highlight">Legend of Royal Institution</span></span>
                    <span className="subtitle">Workshop:<br/>Introduction to Game Development</span>
                    <div className="popup-tags">
                        <span className="tag highlight">v{import.meta.env.VITE_APP_VERSION}</span>
                        <span className="tag">typescript</span>
                        <span className="tag">phaser</span>
                        <span className="tag">maze</span>
                        <span className="tag">game</span>
                    </div>
                    <div className="popup-tags">
                        <span className="tag">workshop</span>
                        <span className="tag">royal institution</span>
                        <span className="tag">react</span>
                        <span className="tag">redux</span>
                    </div>
                    <span className="footer">Made with ❤️ by <a href="https://github.com/st235">st235</a></span>
                </div>
            }>
            <IdeLogo />
        </PopupLayout>
    );
}

export default LogoPopup;
