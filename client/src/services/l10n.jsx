import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {getPresetLanguage, setPresetLanguage} from '../state/clientSettingsStore';
import translationsEN from '../assets/i18n/en.json';
import translationsDE from '../assets/i18n/de.json';
import {getLocalizedFormats} from './timeUtil';

const DEFAULT_LANGUAGE = 'en';
const INTERPOLATION_REGEX = /%\{(.*?)\}/g;

const dictionary = {
  en: translationsEN,
  de: translationsDE
};

export const L10nContext = React.createContext(undefined);

/**
 * Wraps given children in Context Provider.
 *
 * Provides "t" "setLanguage" and "language"  to Children (via react's useContext)
 * Usage:
 *   const {t} = useContext(L10nContext);
 *   return <div >{t('room')}</div>;
 *
 */
export const WithL10n = ({children}) => {
  const initialLanguage = getPresetLanguage() || DEFAULT_LANGUAGE;
  let currentPhrases = dictionary[initialLanguage];
  const initTranslatorState = {
    t,
    setLanguage,
    language: initialLanguage,
    format: getLocalizedFormats(initialLanguage)
  };

  const [translator, setTranslator] = useState(initTranslatorState);

  return <L10nContext.Provider value={translator}>{children}</L10nContext.Provider>;

  /**
   * The most-used method! "t" in most components.
   * Lookup given translationKey in current dictionary (according to currently set language).
   * Can interpolate translations with given data. Interpolation pattern is %{somePropertyKeyHere}
   */
  function t(translationKey, data) {
    let phrase;
    if (typeof currentPhrases[translationKey] === 'string') {
      phrase = currentPhrases[translationKey];
    } else {
      phrase = `!!!${translationKey}!!!`;
    }
    if (!data) {
      return phrase;
    }

    // Interpolate: Creates a `RegExp` object for each interpolation placeholder.
    let result = phrase;
    result = String.prototype.replace.call(
      result,
      INTERPOLATION_REGEX,
      function (expression, argument) {
        if (!Object.prototype.hasOwnProperty.call(data, argument) || data[argument] === null) {
          return expression;
        }
        return data[argument];
      }
    );

    return result;
  }

  function setLanguage(lang) {
    setPresetLanguage(lang);
    currentPhrases = dictionary[lang];
    setTranslator({
      t,
      setLanguage,
      language: lang,
      format: getLocalizedFormats(lang)
    });
  }
};

WithL10n.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
