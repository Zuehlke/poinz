import Polyglot from 'node-polyglot';

export default function translatorFactory(dictionary, language) {
  const polyglot = new Polyglot({phrases: dictionary[language]});

  const getTranslatorFunction = () => (translationKey, data) =>
    polyglot.t(translationKey, {
      ...data,
      _: `!!!${translationKey}!!!`
    });

  return {
    t: getTranslatorFunction(),
    setLanguage: (lang) => {
      polyglot.replace(dictionary[lang]);
      return getTranslatorFunction();
    }
  };
}
