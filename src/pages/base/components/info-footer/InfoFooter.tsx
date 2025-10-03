import "@/pages/base/components/info-footer/InfoFooter.css";

import IconBootstrapFill from "@assets/icons/bootstrap-fill.svg";
import IconGithub from "@assets/icons/github.svg";
import IconInfoLg from "@assets/icons/info-lg.svg";

import ImageLogoGoogleSlides from "@assets/images/logo-google-slides.svg";
import ImageLogoItchIo from "@assets/images/logo-itchio-textless-black.svg";
import ImageLogoRoyalInstitution from "@assets/images/logo-royal-institution.svg";

import Icon from "@components/icon/Icon";
import PopupLayout from "@components/popup-layout/PopupLayout";

function InfoFooter() {
    return (
        <PopupLayout
            className="info-footer-root"
            anchor={{bottom: 0, left: 0}}
            popupContent={
                <div className="info-footer-popup">
                    <span className="title">Assets used in IDE interface:</span>
                    <a className="link common-container" target="_blank" href="https://icons.getbootstrap.com/">
                        <img className="logo small" src={IconBootstrapFill} />
                        <span className="text small">Bootstrap Icons</span>
                    </a>
                    <span className="title">Assets used in game:</span>
                    <a className="link common-container" target="_blank" href="https://v3x3d.itch.io/bountiful-bits">
                        <img className="logo small" src={ImageLogoItchIo} />
                        <span className="text small">"Bountiful Bits" by <b>VEXED</b></span>
                    </a>
                    <a className="link common-container" target="_blank" href="https://v3x3d.itch.io/bit-bonanza">
                        <img className="logo small" src={ImageLogoItchIo} />
                        <span className="text small">"Bit Bonanza" by <b>VEXED</b></span>
                    </a>
                    <a className="link common-container" target="_blank" href="https://joebrogers.itch.io/bitpotion">
                        <img className="logo small" src={ImageLogoItchIo} />
                        <span className="text small">"BitPotion" by <b>Joeb Rogers</b></span>
                    </a>
                    <a className="link common-container" target="_blank" href="https://beatscribe.itch.io/beatscribes-free-uge-music-asset-pack">
                        <img className="logo small" src={ImageLogoItchIo} />
                        <span className="text small">"Free Gameboy UGE Music Asset Pack" by <b>beatscribe</b></span>
                    </a>
                    <span className="title">Useful links:</span>
                    <a className="link common-container" target="_blank" href="https://github.com/st235/RoyalInstitution.IntroductionToGameDevelopment.v4">
                        <img className="logo" src={IconGithub} />
                        <span className="text">Found an issue?<br/>Contribute to Github</span>
                    </a>
                    <a className="link common-container" target="_blank" href="https://drive.google.com/file/d/1BgSYHf9Mtmrfp4VLJRgswybM-D7huySt/view?usp=share_link">
                        <img className="logo" src={ImageLogoGoogleSlides} />
                        <span className="text">Consult with the workshop<br/>slides for more tips & trics</span>
                    </a>
                    <a className="link ri" target="_blank" href="https://www.rigb.org">
                        <span className="in-collaboration">In collaboration with:</span>
                        <img className="logo-ri" src={ImageLogoRoyalInstitution} />
                    </a>
                </div>
            }>
            <Icon icon={IconInfoLg} />
        </PopupLayout>
    );
}


export default InfoFooter;
