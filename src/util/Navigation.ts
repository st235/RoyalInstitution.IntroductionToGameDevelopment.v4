function getHomeUrl(): string {
    const language = __getLanguage();
    return `/${language}/default`;
}

function getNavigationUrl(url: string, defaultLang: string, lang?: string): string {
    if (url.startsWith("/")) {
        url = url.substring(1);
    }

    return `/${lang ?? defaultLang}/${url}`;
}

function isHomePage(pageId?: string): boolean {
    return pageId?.toLowerCase() === "default";
}

function isLanguageSupportedForNavigation(newLang: string, supportedLangs: string[]): boolean {
    return new Set(supportedLangs).has(newLang.toLowerCase());
}

const __DEFAULT_LOCALE_IF_UNDEFINED = "en";

function __getLanguage(): string {
    const locale = navigator.languages ? navigator.languages[0] : navigator.language;
    return new Intl.Locale(locale).language ?? __DEFAULT_LOCALE_IF_UNDEFINED;
}

export { getHomeUrl, getNavigationUrl, isHomePage, isLanguageSupportedForNavigation };
