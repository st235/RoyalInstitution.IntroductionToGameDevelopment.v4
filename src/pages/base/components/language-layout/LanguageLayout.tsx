import "@/pages/base/components/language-layout/LanguageLayout.css";

import { useMemo } from "react";

import { fetchLanguageInfoFor } from "@/util/Locale";

type LanguageLayoutProps = {
    selectedLanguage: string;
    supportedLanguages: string[];
    onLanguageSelected: (code: string) => void;
}

function LanguageLayout(props: LanguageLayoutProps) {
    const languageInfos = useMemo(() => 
        fetchLanguageInfoFor(props.supportedLanguages, props.selectedLanguage),
    [props.selectedLanguage, props.supportedLanguages]);

    return (
        <div className="language-layout">
            {languageInfos.map(info => {
                const itemClassName=`item ${info.code === props.selectedLanguage ? "selected" : ""}`;
                return (
                    <div key={info.code} className={itemClassName} onClick={() => props.onLanguageSelected(info.code)}>
                        <span className="emoji-icon">{info.emojiIcon}</span><span className="text">{info.title}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default LanguageLayout;
export type { LanguageLayoutProps };
