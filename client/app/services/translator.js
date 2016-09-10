import log from 'loglevel';

import translationsEN from '../assets/i18n/en.json';
import translationsDE from '../assets/i18n/de.json';


const LOGGER = log.getLogger('translator');

const dictionary = {
  en: translationsEN,
  de: translationsDE
};

/**
 * Performs a lookup of a translation with the given key for the given language.
 *
 * @param translationKey
 * @param language
 * @returns {string}
 */
export default function lookup(translationKey, language) {

  const translations = dictionary[language];

  if (!translations) {
    LOGGER.error(`Unknown language '${language}'`);
    return `!!!${translationKey}!!!`;
  }

  const translation = translations[translationKey];
  if (!translation) {
    return `!!!${translationKey}!!!`;
  }

  return translation;
}

