import { useAppSelector } from '@/hooks/redux';

import { type PropsWithChildren, createContext, useContext} from 'react';
import { useFetch } from '@/hooks/useFetch';

type TranslationsDict = {[Key: string]: {[Key: string]: string}};

type LocalisationEnvironment = {
  readonly translations: TranslationsDict | undefined,
}

const LocalisationContext = createContext<LocalisationEnvironment | null>(null);

interface LocalisationProviderProps extends PropsWithChildren {
  translationsRes: string;
}

function LocalisationProvider(props: LocalisationProviderProps) {
  const [translationsDict, error, isLoading] = useFetch<TranslationsDict>(props.translationsRes);

  return (
    <LocalisationContext value={{ translations: translationsDict }}>
      {props.children}
    </LocalisationContext>
  );
}

function t<T>(key: T): T {
  if (!key) {
    return key;
  }

  const localeState = useAppSelector(selector => selector.localeState);
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
