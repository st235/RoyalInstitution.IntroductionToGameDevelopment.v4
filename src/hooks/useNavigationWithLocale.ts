import { useNavigate } from "react-router";

import { getNavigationUrl } from "@/util/Navigation";

function useNavigateWithLocale(defaultLanguage: string, lang?: string) {
    const navigator = useNavigate();
    return (url: string) => {
        navigator(getNavigationUrl(url, defaultLanguage, lang));
    };
}

export { useNavigateWithLocale };
