const __DEFAULT_LOCALE_LANGUAGE = "en";
const __DEFAULT_LANGUAGE_EMOJI_ICON = "🏳️";

const __LANGUAGE_TO_EMOJI_MAPPING: { [Key: string]: string } = {
    "en": "🇺🇸",
    "ru": "🇷🇺"
};

type LanguageInfo = {
    code: string;
    title: string;
    emojiIcon: string;
}

function getBrowserLanguageIsoCode(): string {
    const rawLocale = navigator.languages ? navigator.languages[0] : navigator.language;
    const locale = new Intl.Locale(rawLocale);
    return locale.language ?? __DEFAULT_LOCALE_LANGUAGE;
}

function fetchLanguageInfoFor(languages: string[], lang: string): LanguageInfo[] {
    const languageNames = new Intl.DisplayNames([lang], {type: "language"});

    return languages.map(language => {
        return {
            code: language,
            title: languageNames.of(language) ?? language,
            emojiIcon: __LANGUAGE_TO_EMOJI_MAPPING[language] ?? __DEFAULT_LANGUAGE_EMOJI_ICON
        };
    });
}

export { getBrowserLanguageIsoCode, fetchLanguageInfoFor };
