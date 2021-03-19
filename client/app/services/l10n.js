import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Polyglot from 'node-polyglot';

import {getPresetLanguage, setPresetLanguage} from '../state/clientSettingsStore';
import translationsEN from '../assets/i18n/en.json';
import translationsDE from '../assets/i18n/de.json';
import {getLocalizedFormats} from './timeUtil';

const DEFAULT_LANGUAGE = 'en';

const dictionary = {
  en: translationsEN,
  de: translationsDE
};

export const L10nContext = React.createContext(undefined);

/**
 * Wraps children in Context Provider.
 * Provides "t" "setLanguage" and "language"  to Children (via react's useContext)
 *
 * Internally holds reference to polyglot instance, currently used language
 * see https://www.npmjs.com/package/node-polyglot
 *
 * @param children
 * @return {JSX.Element}
 * @constructor
 */
export const WithL10n = ({children}) => {
  const initialLanguage = getPresetLanguage() || DEFAULT_LANGUAGE;
  const polyglot = new Polyglot({phrases: dictionary[initialLanguage]});
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
   *
   * Custom wrapper for polyglot translator function with same signature.
   * Provides default translation for missing keys. (during development, better visibility)
   */
  function t(translationKey, data) {
    return polyglot.t(translationKey, {
      ...data,
      _: `!!!${translationKey}!!!`
    });
  }

  function setLanguage(lang) {
    setPresetLanguage(lang);
    polyglot.replace(dictionary[lang]);
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
