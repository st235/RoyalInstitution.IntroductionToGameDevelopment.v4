import { useAppSelector } from "@/hooks/redux";

import { type PropsWithChildren, createContext, useContext} from "react";
import { useFetch } from "@/hooks/useFetch";

type TranslationsDict = {[Key: string]: {[Key: string]: string}};

type LocalisationEnvironment = {
    readonly translations: TranslationsDict | undefined,
}

const LocalisationContext = createContext<LocalisationEnvironment | null>(null);

interface LocalisationProviderProps extends PropsWithChildren {
    translationsRes: string;
}

function LocalisationProvider(props: LocalisationProviderProps) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [translationsDict, _error, _isLoading] = useFetch<TranslationsDict>(props.translationsRes);

    return (
        <LocalisationContext value={{ translations: translationsDict }}>
            {props.children}
        </LocalisationContext>
    );
}

function t(key: string): string {
    if (!key) {
        return key;
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const localeState = useAppSelector(selector => selector.localeState);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const context = useContext(LocalisationContext);

    const lang = localeState.selectedLanguage ?? localeState.defaultLanguage;
    const defaultLang = localeState.defaultLanguage;
    const dict = context?.translations;

    if (!dict) {
        return key;
    }

    let localisedKey = key;
    if (dict[defaultLang]) {
        localisedKey = dict[defaultLang][key];
    }
    if (dict[lang] && dict[lang][key]) {
        localisedKey = dict[lang][key];
    }

    return localisedKey;
}

export default LocalisationProvider;
export { t };
